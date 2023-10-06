const mongoose =require("mongoose")
//lo crea el user y el fixer lo acepta
//la reivew se puede hacer solo sobre un trabajo finalizado
const trabajoSchema= new mongoose.Schema({
    titulo:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true
    },
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
        default:"inciado sin aprobacion"
    },
    fechaInicio:{
        type:Date,
        default: () => Date.now()
    },
    
    reviewHecha:{
        type:Boolean,
        default:false,
    },
    imagenPortada:{
        type:String,
        default:"proximamente.jpg"
    },
    imagenes:[String],
    aceptadoPorFixer:{
        type:Boolean,
        default:false,
    },
    visto:{
        type:Boolean,
        default:false,
    },
    notasDelFixer:{
        type:String
    },
    finalizado:{
        type:Boolean, 
        default:false
    }
}
,{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


trabajoSchema.virtual("review",{
    ref:"Review",
    localField:"_id",
    foreignField:"trabajo"
})

const model=mongoose.model("Trabajo", trabajoSchema)
module.exports=model