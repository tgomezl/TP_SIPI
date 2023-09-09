const tipoModel=require("../models/tipoServicioModel")
//get all y create
//require el barriomodel
exports.getAll=async(req,res,next)=>{
    try {
        const tipos=await tipoModel.find()
        res.status(200).json({
            status:"success",
            cantidad:tipos.length,
            data:{
                data:tipos
            }
        })
    } catch (error) {
        console.log("catching");
        next(error)
    }

}

exports.create=async(req,res,next)=>{
    try {
        const tipo=await tipoModel.create(req.body)
        res.status(200).json({
            status:"success",
            data:{
                data:tipo
            }
        })
    } catch (error) {
        console.log("catching");
        next(error)
    }
}