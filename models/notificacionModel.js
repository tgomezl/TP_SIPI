const mongoose =require("mongoose")

const notificacionSchema= new mongoose.Schema({
    descripcion:{
        type:String,
    },
    leido:{
        type:Boolean,
        default:false,
    },
    fechaCreacion:{
        type:Date,
        default: () => Date.now()
    },
    deUser:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    paraFixer:{type: mongoose.Schema.Types.ObjectId, ref: 'Fixer'}

})

//hook pre save??

const model=mongoose.model("Note", notificacionSchema)
module.exports=model;