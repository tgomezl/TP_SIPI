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
            "fixer":fixer._id,
            "titulo":req.body.titulo,
            "descripcion":req.body.descripcion
        }
        const newjob=await model.create(data)
        //sendemailtouser

        //sendemailtofixer

        res.status(200).json({
            status:"success",
            data:{
                data:newjob
            }
        })
        //ACA SE PODRIA ENVIAR NOTIFICACION AL FIXER
    } catch (error) {
        console.log("catching");
        next(error)
    }
}

exports.getAll=async(req,res,next)=>{
    try {
        console.log("body ",req.body);
        let jobs= model.find();
        if(req.params.id){
            console.log(" viene con param");
            console.log("trabajos de un fixer");
            jobs.where("fixer").equals(req.params.id);
            //OJO XQ VA A CHOCAR CUANDO EN VEZ DE FIXER QUIERA PONER USER
        }
        
        jobs= await jobs
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
        const job = await model.findById(req.params.id).populate("user").populate("fixer").populate("review")
        
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
        const aceptar=req.body.aceptar
        if(!aceptar){
            return next( new AppError("debe indicar si lo acepta o no",401))
        }
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
            if(job.visto){
                //fue visto y rechazado
                res.status(200).json({
                    status:"already declined",
                    data:{
                        data:job
                    }
                })
            }
            if(aceptar=="no"){
                job.aceptadoPorFixer=false
                job.estado="rechazado"
            }else{
                job.aceptadoPorFixer=true
                job.estado="iniciado"
                job.fechaInicio=Date.now()
            }
            job.visto=true
            //job.fechaFinalizacion=Date.now() + 7*24*60*60*1000
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