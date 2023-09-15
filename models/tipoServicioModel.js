const mongoose =require("mongoose")

const tipoServicioSchema= new mongoose.Schema({
    nombre:{
        type:String,
        unique:[true,"is not unique"],
        required:[true,"nombre servicio is required"]
    },
    imagen:String
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


tipoServicioSchema.virtual("fixers",{
    ref: "Fixer",
    foreignField:"tipoServicio",
    localField:"_id",
    
})

const model = mongoose.model("TipoServicio", tipoServicioSchema)

module.exports=model;