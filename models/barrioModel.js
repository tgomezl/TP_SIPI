const mongoose =require("mongoose")

const barrioSchema= new mongoose.Schema({
    nombre:{
        type:String,
        required:[true,"nombre barrio is required"],
        unique:[true, "is not unique"],
        lowercase: true
    },

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

barrioSchema.virtual("fixers",{
    ref: "Fixer",
    foreignField:"barrios",
    localField: "_id",
    
})

const model=mongoose.model("Barrio", barrioSchema)
module.exports=model;