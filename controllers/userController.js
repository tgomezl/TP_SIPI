const userModel = require("../models/userModel")
const AppError =require("../utils/AppError")

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