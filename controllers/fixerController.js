const model =require("../models/fixerModel")
const utiles=require("../utils/utiles")
const barriomodel=require("../models/barrioModel")
const tiposerviciomodel=require("../models/tipoServicioModel")
const AppError = require("../utils/AppError")

const multer=require("multer")
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "public/img/fixers")
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split("/")[1]
        cb(null,`fixer-${req.user.id}-${file.originalname}`)
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

exports.uploadFixerPhoto =upload.single("photo");

exports.create=async(req,res,next)=>{
    try {
        console.log("------------------create fixer");
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
        
        console.log("------------------get all fixer");
        const fixers=await model.find().populate("barrios").populate("tipoServicio").sort({"rating":-1}).limit(20)
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
        console.log("------------------get one fixer");
        let id=req.params.id
        if(req.me){
            id=req.me
        }
        const fixer = await model.findById(id).populate("reviews")
        .populate("barrios")
        .populate("tipoServicio")
        .populate("trabajos")
        res.status(200).json({
            status:"success",
            data:{
                data:fixer
            }
        })
    } catch (error) {
        console.log(error.message);
        console.log("dentro de catch");
        next(error)
    }


}

exports.FixersPorZona=async(req,res,next)=>{
    try {
        console.log("------------------FixersPorZona");
        const zona=req.body.zona.toLowerCase();
        
        console.log("zona",zona);

        /*
        const barrios =await barriomodel.find()
        .where("nombre").equals(zona)
        .populate("fixers")
        .sort("fixers.rating")
        */
        const algo=await model.aggregate([
            {$match: {} },
            {$lookup: 
                        {
                            from: "tiposervicios",
                            localField: "tipoServicio",
                            foreignField: "_id",
                    as: "tipoServicio"
                        }
            },
            {$lookup: 
                        {
                            from: "barrios",
                            localField: "barrios",
                            foreignField: "_id",
                    as: "barrios"
                        }
            },
            {$match: {"barrios.nombre":zona} },
            { $project: { "mail": 0, "passwordChangedAt": 0, "password":0,"telefono":0} }, 
            {$sort:{"rating":1}}
            ])
    
        
        
       
        res.status(200).json({
            data:algo
        })
    } catch (error) {
        next(error)
    }
}


/*
exports.FixersPorJob=async(req,res,next)=>{
    try {
        const job=req.body.especialidad.toUpperCase()
        console.log("job", job);
        let especialidad= await tiposerviciomodel.find()
        .where("nombre").equals(job)
        .populate("fixers",{_id:1, nombre:1, apellido:1, rating:1})
        .sort("fixers.rating")
        res.status(200).json({
            data:especialidad
        })
    } catch (error) {
        next(error)
    }
}
*/
exports.FixersPorJobZona=async(req,res,next)=>{
    try {

        console.log("------------------FixersPorJobZona");
        console.log(req.body);
        if(!req.body.zona && !req.body.especialidad) return next(new AppError("sin zona ni especialidad",401))
        const zona=req.body.zona.toLowerCase() 
        const especialidad=req.body.especialidad.toUpperCase() 
        console.log({zona, especialidad});
        const algo=await model.aggregate([
            {$match: {} },
            {$lookup: 
                        {
                            from: "tiposervicios",
                            localField: "tipoServicio",
                            foreignField: "_id",
                    as: "tipoServicio"
                        }
            },
            {$match: {"tipoServicio.nombre":especialidad} },
            {$lookup: 
                        {
                            from: "barrios",
                            localField: "barrios",
                            foreignField: "_id",
                    as: "barrios"
                        }
            },
            {$match: {"barrios.nombre":zona} },
            { $project: { "mail": 0, "passwordChangedAt": 0, "password":0,"telefono":0} }, 
            {$sort:{"rating":1}}
            ])
    
            res.status(200).json({
                data:algo
            })
    } catch (error) {
        next(error)
    }
   
}

exports.updateOne=async(req,res,next)=>{
    res.send("no implemetando todavia")
}

exports.deleteOne=async(req,res,next)=>{
    res.send("no implemetando todavia")
}

exports.updateMe=async(req,res,next)=>{
    //este metodo solo lo ejecuta el propio fixer
    //campos que puede actualizar son nombre,apellido, telefono,  
    //agregar o quitarimagen, agregar o quitar servicio
    //agregar o quitar barrio va en otro endpoint
    try {
        console.log("--------------------updateMe")
        console.log("req.user", req.user);
        //modificar los campos que no se pueden 
        const newbody=utiles.filterObj(req.body, ["nombre","apellido","telefono","descripcion"])
        
        //req.user
        const user=req.user
        for (let clave in newbody){
            console.log(newbody[clave]);
            user[clave]=newbody[clave]
        }
        if(req.file){
            user.imagenPerfil=req.file.filename
        }
        const usermodified=await user.save()
        res.status(200).json({
            status:"success",
            data:usermodified
        })
    
   
    } catch (error) {
        next(error)
    }
}


exports.bestfixers=async(req,res,next)=>{
    try {
        req.best=true
        next()
    } catch (error) {
        next(error)
    }
}



exports.pruebas=async(req,res,next)=>{
    try {
        const fixer= await model.findById(req.body.id)
        await fixer.modifyRating()
        res.send("OK")
    } catch (error) {
        next(error)
    }
}
