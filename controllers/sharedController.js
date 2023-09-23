const AppError =require("../utils/AppError")
const reviewModel=require("../models/reviewModel")
const jobModel=require("../models/trabajoModel")

exports.getAllReviewsFromUser=async(req,res,next)=>{
   
    //console.log("id recibido",req.params.id);
    //res.send("OK")
    try {
        console.log("------------------getAllReviewsFromUser");
        //console.log("id recibido",req.params.id);
        //res.send("OK")
        const reviews =await reviewModel.find().where("usuario").equals(req.params.id)
        res.status(200).json({
            status:"success",
            cantidad:reviews.length,
            data:{
                data:reviews
            }
        })
    } catch (error) {
        next(new AppError("error en getAllJobsFromUser"),401)
    }
}


exports.getAllJobsFromUser=async(req,res,next)=>{
    try {
        console.log("-------------------------getAllJobsFromUser");
        //console.log("id recibido",req.params.id);
        //res.send("OK")
        const jobs =await jobModel.find().where("user").equals(req.params.id)
        res.status(200).json({
            status:"success",
            cantidad:jobs.length,
            data:{
                data:jobs
            }
        })
    } catch (error) {
        next(new AppError("error en getAllJobsFromUser"),401)
    }
    
}

exports.getAllReviewsFromFixer=async(req,res,next)=>{
    //esta no se si es necesaria
}


exports.getAllJobsFromFixer=async(req,res,next)=>{
    //esta no se si es necesaria
}