const userModel = require("../models/userModel")
const AppError =require("../utils/AppError")
const utiles=require("../utils/utiles")

exports.createUser=async(req,res,next)=>{
    try {
        console.log("body ",req.body);
        const newuser=await userModel.create(req.body)
        res.status(200).json({
            status:"success",
            data:{
                data:newuser
            }
        })
    } catch (error) {
        console.log("catching");
        next(error)
    }
}

exports.setMe=async(req,res,next)=>{
    try {

        req.me=req.user.id
        next()
    } catch (error) {
        console.log("catching");
        next(error)
    }
}

exports.getAllUsers=async(req,res,next)=>{

    try {
        const users=await userModel.find();
        res.status(200).json({
            status:"success",
            cantidad:users.length,
            data:{
                data:users
            }
        })
    } catch (error) {
        next(error)
    }
    

}


exports.getUser=async(req,res,next)=>{

    try {
        let id=req.params.id
        if(req.me){
            id=req.me
        }
        console.log(" GET USER");
        console.log( "el id", id );
        const user=await userModel.findById(id).populate("reviews").populate("trabajos");
        if(user){
            res.status(200).json({
                status:"success",
                data:{
                    data:user
                }
            })
        }
        
    } catch (error) {
        res.status(400).json({
            status:"no encontrado",
            data:{
                data:null
            }
        })
    }

}

exports.updateUser=async(req,res,next)=>{
    //este metodo lo usa el admin
    try {
        const user=await userModel.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            })
        if(!user){
            next(new AppError("no encontrado",401))
        }
        if(user){
            res.status(200).json({
                status:"success",
                data:{
                    data:user
                }
            })
        }
    } catch (error) {
        next(error)
    }
    

}

exports.deleteUser=async(req,res,next)=>{
    res.status(200).json({
        message:"deleteUser not implemented yet"
    })

}

exports.setRol=async(req,res,next)=>{
    //creo que esta demas
    //ver el craeetuser!!! y el rol alli
    console.log(req.body);

    next()
}

exports.modifyBody=async(req,res,next)=>{
    //filter
    req.body={
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono
    };

    next()
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
