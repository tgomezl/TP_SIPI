const mongoose =require("mongoose")

const validator= require("validator")

const reviewSchema= mongoose.Schema({
    descripcion:{
        type:String,
        required:[true, "no tiene descripcion"]
    },
    calificacion:{
        type:Number,
        required:[true, "no tiene calificacion"],
        min:1,
        max:10
    },
    usuario:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' ,
        required:[true,"necesita un user"]
    },
    fixer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Fixer',
        required:[true,"necesita un fixer"] 
    },
    trabajo:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Trabajo',
        required:[true,"necesita un trabajo"] 
    },
    imagenes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],
    createdAt:{
        type:Date,
        default:Date.now(),
    },
})

//chequear que el trabajo exista y modificar el rating del fixer


reviewSchema.index({ usuario:1, trabajo:1},{unique:true})

const Model=mongoose.model('Review', reviewSchema )

module.exports=Model;