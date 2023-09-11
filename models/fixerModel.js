const mongoose=require("mongoose")
const validator=require("validator")

const fixerSchema= new mongoose.Schema({
    nombre: {
        type:String,
        required:[true,"does not have name"]
    },
    apellido: {
        type:String,
        required:[true,"does not have lastname"]
    },
    mail:{
        type:String, 
        unique:[true,"mail is not unique"],
        lowercase: true,
        validate: [validator.isEmail," el email es invalido"],
        select:false
    },
    password:{
        type:String,
        required:[true, "no tiene password"],
        minlength: 8,
        select:false   
    },
    telefono:{
        type:String,
        select:false,
    },
    habilitado:{
        type: Boolean, 
        default:true
    },
    imagenPerfil:{
        type:String,
        default:"defaultImage.jpg"
    },
    passwordChangedAt:{
        type:Date,
        default:Date.now(),
    },
    horario:{
        type:String
    },
    barrios:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Barrio' }],
    tipoServicio:[{ type: mongoose.Schema.Types.ObjectId, ref: 'TipoServicio' }],
    rating:{ 
        type:Number,
        default:6.0,
    },
    //misreviewsrecibidas:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    //trabajos:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Trabajo' }]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

fixerSchema.virtual('isFixer').get(function() {
    return true;
});

fixerSchema.virtual('isUser').get(function() {
    return false;
});

fixerSchema.virtual("reviews",{
    ref: "Review",
    foreignField:"fixer",
    localField: "_id",
    
})

const model= mongoose.model("Fixer", fixerSchema)

module.exports=model

