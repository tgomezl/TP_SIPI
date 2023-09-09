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
    horario:{
        type:String
    },
    barrio:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Barrio' }],
    tipoServicio:[{ type: mongoose.Schema.Types.ObjectId, ref: 'TipoServicio' }],
    rating:{ 
        type:Number,
        default:6.0,
    },
    //misreviewsrecibidas:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    //trabajos:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Trabajo' }]
})

const model= mongoose.model("Fixer", fixerSchema)

module.exports=model

