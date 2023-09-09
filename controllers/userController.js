const userModel = require("../models/userModel")

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
        console.log(" GET USER");
        console.log( "el id", req.params.id );
        const user=await userModel.findById(req.params.id);
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
    res.status(200).json({
        message:" getAllUsers not implemented yet"
    })

}

exports.deleteUser=async(req,res,next)=>{
    res.status(200).json({
        message:"deleteUser not implemented yet"
    })

}

exports.setRol=async(req,res,next)=>{
    req.body.rol="user"
    next()
}