const model = require("../models/reviewModel")
const AppError = require("../utils/AppError")
const trbajoModel=require("../models/trabajoModel")


exports.create=async(req,res,next)=>{

    try {
       
        const data={
            "descripcion":req.body.descripcion,
            "calificacion":req.body.calificacion,
            "usuario":req.user.id,
            "fixer":req.fixerid,
            "trabajo":req.body.trabajo
            
        }
        const review = await model.create(data)
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
        console.log("body ",req.body);
        let reviews = model.find()
        if(req.params.id){
            console.log(" viene con param");
            console.log("reviews de un fixer");
            reviews.where("fixer").equals(req.params.id);
            //OJO XQ VA A CHOCAR CUANDO EN VEZ DE FIXER QUIERA PONER USER
        }
    
        reviews=await reviews
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
    //NESTED
    
    try {
        const review = await model.findById(req.params.id).populate("usuario").populate("fixer").populate("trabajo")
        
        
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

exports.update=async(req,res,next)=>{
    //modificar descripcion,calificaion,imagenes
    try {
        const review=req.review;
        console.log("review  antes", review);
        review.descripcion=req.body.descripcion
        console.log("review  despues", review);
        await review.save()
        res.status(200).json({mensaje:"ok"})
    } catch (error) {
        next(error)
    }
}
exports.allowUserModify=async(req,res,next)=>{
    //req.user
    try {
        const user=req.user;
        if(user.isFixer){
            return next(new AppError("un fixer no puede modificar una review",401))
        }
        const review =await model.findById(req.params.id)
        
        console.log("review  antes", review);
        review.descripcion=req.body.descripcion
        console.log("review  despues", review);
        const modificada= await review.save()
        res.status(200).json({
            mensaje:"modificada",
            data:{review:modificada}
        })
    } catch (error) {
        next(error)
    }
}


exports.allowUserCreate=async(req,res,next)=>{
    //se fija si el id del job lo tiene a el como user
    //req.user
    try {
        const trabajo= await trbajoModel.findById(req.body.trabajo)
        
        //console.log("suer", user);
        //console.log(trabajo.user,req.user._id);
       
        if(trabajo.user!=req.user.id){
            return next(new AppError("no tiene permiso de creacion",401))
        }else{
            if(trabajo.estado!=="finalizado"){
                next(new AppError("el trabajo todavia esta en curso",401))
            }
            req.fixerid=trabajo.fixer
            next()

        }
    } catch (error) {
        next(error)
    }
}
