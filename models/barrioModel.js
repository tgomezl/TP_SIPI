const mongoose =require("mongoose")

const barrioSchema= new mongoose.Schema({
    nombre:{
        type:String,
        required:[true,"nombre barrio is required"],
        unique:[true, "is not unique"],
        lowercase: true
    },

})

const model=mongoose.model("Barrio", barrioSchema)
module.exports=model;