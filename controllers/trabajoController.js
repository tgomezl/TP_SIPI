const model =require("../models/trabajoModel");
const AppError = require("../utils/AppError");
const fixermodel=require("../models/fixerModel")
const sendMail =require("../utils/mail")

const multer=require("multer")
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "public/img/trabajos")
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split("/")[1]
        cb(null,`trabajo-${req.user.id}-${file.originalname}`)
    }
})

const filter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")) cb(null, true)
    cb(new AppError("no es una imagen",400), false)
 }

const upload=multer({
    storage,
    filter

})





exports.uploadPhotosTrabajo=upload.fields([
    {name:"portada", maxCount:1}, //se tiene que llamar asi
    {name:"image", maxCount:3}//se tiene que llamar asi
])
//solo 4 fotos por trabajo

exports.create=async(req,res,next)=>{
    //req.user
    try {
        console.log("------------------createjob");
        console.log("body ",req.body);
        //chequeo que el fixer exista
        const fixer= await fixermodel.findById(req.body.fixer)
        .select('+mail') 
        .select("+telefono")
  
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
        //const nombreuser=req.user.nombre
        //const apellidouser=req.user.apellido
        
        const mensajeparaeluser=`has iniciado un nuevo trabajo con el FIXER
        nombre fixer: ${fixer.nombre } ,apellido: ${fixer.apellido} 
        telefono :${ fixer.telefono},  mail:${ fixer.mail }.
        ponte en contacto con el!!


        *************************
        TRABAJO INICIADO
        *************************
        titulo= ${ newjob.titulo}
        job ID=${ newjob._id} 
        *************************
        `; 

        console.log("mail del user es", req.user.mail);

        //send email to user:
        const options={
            "email": req.user.mail,
            "subject":"HAS INICIADO UN NUEVO TRABAJO",
            "message":mensajeparaeluser,
        }
        
        console.log("por enviar mail");
        //console.log("options",options);
        await sendemailtoUser(options)
        console.log("email enviado");
       

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
        console.log("------------------get all jobs");
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
        console.log("------------------get one job");
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
   
        
        console.log("------------------update job");
        if(req.files){
            console.log(" vino con mas de un file");
            //console.log("cantidad ",req.files.length);
            console.log("es un array",req.files);
            console.log(" * ");
            console.log("portada es",req.files.portada )
            console.log("images es",req.files.image )
            if(req.files.portada){
                req.body.imagenPortada=req.files.portada[0].filename
                console.log("---->",req.body.imagenPortada);
            }
            if(req.files.image){
                const arrayimagenes=req.files.image.map((el)=>{return el.filename})
                req.body.imagenes=arrayimagenes
                console.log("---->",req.body.imagenes);
            }
        }
        //que pasa si el body viene vacio??nada
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
        console.log("------------------aceptar job");
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
                job.estado="aceptado"
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
        console.log("error in catch");
        next(error)
    }
}

exports.allowFixerModify=async(req,res,next)=>{
    //sos admin o sos dueño del trabajo?
    //solo el fixer dueño del trbajo modifica el TRABAJO
    console.log("------------------allowFixerModify");
    const user=req.user;
    const job=await model.findById(req.params.id)
    if(!job){
        next(new AppError("no existe el recurso", 404))
    }
    console.log("encontre al user");
    //console.log(" user", user);
    if(!user.isFixer ){ 
        next(new AppError("not a fixer", 404))
    }
    console.log("   * * * * * * * ");
    console.log("   * * * * * * * ");
    console.log("esto que da?",job.fixer==user._id);
    console.log("esto que da?",job.fixer!==user._id);
    console.log("   * * * * * * * ");
    console.log("   * * * * * * * ");
    if(job.fixer!==user._id){
        next(new AppError("not allowed to modify this resource", 404))
    }
    console.log(" este trabajo le pertenece!!!");
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

const sendemailtoUser=async (opciones)=>{

    await sendMail(opciones)
    //from user to fixer:
    //por ahora el user no recibe mail
}


exports.enviaremaildeprueba=async(req,res,next)=>{
    try {
        console.log(" ------------------enviadno mail de prueba");
        const options={
            "email": "algunacuenta@email",
            "subject":"NUEVO TRABAJO INICIADO EN LA APP",
            "message":"soy el cuerpo del mensaje",
        }
        await sendMail(options)
        res.send("enviado")
    } catch (error) {
        console.log(" no se pudo enviar");
        next(error)
    }
    
}