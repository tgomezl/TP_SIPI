const mongoose =require("mongoose")
//lo crea el user y el fixer lo acepta
//la reivew se puede hacer solo sobre un trabajo finalizado
const trabajoSchema= new mongoose.Schema({
    user:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' ,
        required:[true,"debe indicar el user"]
    }, //required
    fixer:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Fixer', 
        required:[true,"debe indicar el fixer"]
    },  //required
    estado:{
        type:String,
        default:"en curso"
    },
    fechaInicio:{
        type:Date,
        default: () => Date.now()
    },
    fechaFinalizacion:{
        type:Date,
        default: () => Date.now() + 7*24*60*60*1000
    },
    reviewHecha:{
        type:Boolean,
        default:false,
    },
    imagenes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],
    aceptadoPorFixer:{
        type:Boolean,
        default:false,
    }
})

const model=mongoose.model("Trabajo", trabajoSchema)
module.exports=model