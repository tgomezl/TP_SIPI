const model =require("../models/fixerModel")

exports.create=async(req,res,next)=>{
    try {
        const fixer = await model.create(req.body)
        res.status(200).json({
            status:"success",
            data:{
                data:fixer
            }
        })
    } catch (error) {
        next(error)
    }


}

exports.getAll=async(req,res,next)=>{
    try {
        const fixers = await model.find();
        res.status(200).json({
            status:"success",
            cantidad: fixers.length,
            data:{
                data:fixers
            }
        })
    } catch (error) {
        next(error)
    }


}


exports.getOne=async(req,res,next)=>{
    try {
        const fixer = await model.findById(req.params.id).populate("reviews");
        res.status(200).json({
            status:"success",
            data:{
                data:fixer
            }
        })
    } catch (error) {
        next(error)
    }


}