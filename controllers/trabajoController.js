const model =require("../models/trabajoModel")

exports.create=async(req,res,next)=>{
    try {
        console.log("body ",req.body);
        const newjob=await model.create(req.body)
        res.status(200).json({
            status:"success",
            data:{
                data:newjob
            }
        })
    } catch (error) {
        console.log("catching");
        next(error)
    }
}

exports.getAll=async(req,res,next)=>{
    try {
        console.log("body ",req.body);
        const jobs=await model.find();
        res.status(200).json({
            status:"success",
            cantidad:jobs.length,
            data:{
                data:jobs
            }
        })
    } catch (error) {
        console.log("catching");
        next(error)
    }

}
exports.getOne=async(req,res,next)=>{
    try {
        const job = await model.findById(req.params.id).populate("user").populate("fixer")
        
        res.status(200).json({
            status:"success",
            data:{
                data:job
            }
        })
        
        
    } catch (error) {
        next(error)
    }


}
exports.update=async(req,res,next)=>{
    res.status(200).json({
        status:"no esta implementado",
        data:{
            data:null
        }
    })
}
exports.delete=async(req,res,next)=>{
    res.status(200).json({
        status:"no esta implementado",
        data:{
            data:null
        }
    })
}


    