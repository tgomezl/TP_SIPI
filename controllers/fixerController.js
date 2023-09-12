const model =require("../models/fixerModel")
const utiles=require("../utils/utiles")

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
        let id=req.params.id
        if(req.me){
            id=req.me
        }
        const fixer = await model.findById(id).populate("reviews");
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

exports.setTopFixersZona=async(req,res,next)=>{

    try {
        req.filtro={} //aca va el filtro!!!
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
        console.log("updateMe")
        console.log("req.user", req.user);
        //modificar los campos que no se pueden 
        const newbody=utiles.filterObj(req.body, ["nombre","apellido","telefono"])
        
        //req.user
        const user=req.user
        for (let clave in newbody){
            console.log(newbody[clave]);
            user[clave]=newbody[clave]
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

