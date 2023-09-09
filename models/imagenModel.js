const mongoose =require("mongoose")

const imagenSchema= new mongoose.Schema({
    nombreImagen:{
        type:String,
    },
    tipo:{
        type:String,
    }

})

const model=mongoose.model("Image", imagenSchema)
module.exports=model;