const mongoose =require("mongoose")
const validator=require("validator")

const userSchema= new mongoose.Schema({
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
        validate: [validator.isEmail," el email es invalido"]
    },
    password:{
        type:String,
        required:[true, "no tiene password"],
        minlength: 8,
        select:false   //no hace un get de este campo
    },
    telefono:String,
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
    rol:{
        type:String,
        default:"user"
    }
    //misreviewshechas:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    //trabajos:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Trabajo' }]

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

userSchema.virtual('isFixer').get(function() {
    return false;
});

userSchema.virtual("reviews",{
    ref:"Review",
    localField:"_id",
    foreignField:"usuario"
})

userSchema.virtual("trabajos",{
    ref:"Trabajo",
    localField:"_id",
    foreignField:"user"
})

//hash la password

const model= mongoose.model('User',userSchema)

module.exports=model;