const barrioModel=require("../models/barrioModel")
//get all y create
//require el barriomodel
exports.getAll=async(req,res,next)=>{
    try {
        const barrios=await barrioModel.find()
        res.status(200).json({
            status:"success",
            cantidad:barrios.length,
            data:{
                data:barrios
            }
        })
    } catch (error) {
        console.log("catching");
        next(error)
    }

}

exports.create=async(req,res,next)=>{
    try {
        const barrio=await barrioModel.create(req.body)
        res.status(200).json({
            status:"success",
            data:{
                data:barrio
            }
        })
    } catch (error) {
        console.log("catching");
        next(error)
    }
}