const model =require("../models/trabajoModel");
const AppError = require("../utils/AppError");
const fixermodel=require("../models/fixerModel")

exports.create=async(req,res,next)=>{
    //req.user
    try {
        console.log("body ",req.body);
        //chequeo que el fixer exista
        const fixer= await fixermodel.findById(req.body.fixer) 
        if(!fixer){
            return next(new AppError("no existe el fixer ", 401))
        }
        const data={
            "user":req.user,
            "fixer":fixer._id
        }
        const newjob=await model.create(data)
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
    try {
        const job = await model.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json({
            status:"modificado",
            data:{
                data:job
            }
        })
    } catch (error) {
        next(error)
    }
}
exports.delete=async(req,res,next)=>{
    res.status(200).json({
        status:"no esta implementado",
        data:{
            data:null
        }
    })
}

exports.aceptar=async(req,res,next)=>{
  
    try {
        let idjob=req.params.id
        
        const job = await model.findById(idjob)
        if(job.aceptadoPorFixer==true){
            res.status(200).json({
                status:"already acepted",
                data:{
                    data:job
                }
            })
        }else{

            job.aceptadoPorFixer=true
            job.estado="iniciado"
            job.fechaInicio=Date.now()
            job.fechaFinalizacion=Date.now() + 7*24*60*60*1000
            const modified=await job.save()
            res.status(200).json({
                status:"modificado",
                data:{
                    data:modified
                }
            })
        }
        

        
    } catch (error) {
        
    }
}

exports.allowFixerModify=async(req,res,next)=>{
    //sos admin o sos dueño del trabajo?
    //solo el fixer modifica el TRABAJO
    const user=req.user;
    const job=await model.findById(req.params.id)
    if(!job){
        next(new AppError("no existe el recurso", 404))
    }
    console.log(" user", user);
    if(!user.isFixer ){ 
        next(new AppError("not a fixer", 404))
    }
    if(!job.fixer==user._id){
        next(new AppError("not allowed", 404))
    }
    req.job=job;
    next()
}

exports.allowUserCreate=async(req,res,next)=>{
    //el user crea el trabajo
    try {
        if(req.user.isFixer){
            next(new AppError("solo un user puede crear un trabajo"))
        }else{
            console.log(" paso por aqui");
            next()
        }
        
    } catch (error) {
        next(error)
    }
}