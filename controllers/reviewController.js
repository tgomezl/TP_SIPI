const model = require("../models/reviewModel")

exports.create=async(req,res,next)=>{
    try {
        const review = await model.create(req.body)
        res.status(200).json({
            status:"success",
            data:{
                data:review
            }
        })
    } catch (error) {
        next(error)
    }


}

exports.getAll=async(req,res,next)=>{
    try {
        const reviews = await model.find()
        res.status(200).json({
            status:"success",
            cantidad: reviews.length,
            data:{
                data:reviews
            }
        })
    } catch (error) {
        next(error)
    }


}



exports.getOne=async(req,res,next)=>{
    try {
        const review = await model.findById(req.params.id).populate("usuario").populate("fixer").populate("trabajo")
        if(!review){
            res.status(200).json({
                status:"documento no encontrado",
                data:{
                    data:null
                }
            })
        }else{
            res.status(200).json({
                status:"success",
                data:{
                    data:review
                }
            })
        }
        
    } catch (error) {
        next(error)
    }


}