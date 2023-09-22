const mongoose =require("mongoose")
const trabajomodel=require("../models/trabajoModel")
const fixermodel=require("../models/fixerModel")
const utils=require("../utils/utiles")

const validator= require("validator")
const AppError = require("../utils/AppError")

const reviewSchema= mongoose.Schema({
    descripcion:{
        type:String,
        required:[true, "no tiene descripcion"]
    },
    calificacion:{
        type:Number,
        required:[true, "no tiene calificacion"],
        min:1,
        max:10
    },
    usuario:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' ,
        required:[true,"necesita un user"]
    },
    fixer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Fixer',
        required:[true,"necesita un fixer"] 
    },
    trabajo:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Trabajo',
        required:[true,"necesita un trabajo"] 
    },
    imagenes:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
    },
})

//chequear que el trabajo exista y modificar el rating del fixer
reviewSchema.pre("save", async function(next) {
    
    const trabajo = await trabajomodel.findById(this.trabajo)
    if(!trabajo){
        return next(new AppError("no such work in pre",401))
        
    }
    console.log("modificando el rating del fixer");
    const fixer = await fixermodel.findById(this.fixer)
    console.log("fixer", fixer);
    const ratingactual=fixer.rating
    let cantidadReviewsactual=fixer.cantidadReviews 
    if(!cantidadReviewsactual){
        cantidadReviewsactual= 1
    }
    //fixer=fixer.modifyRating(fixer,this.calificacion)
    
    const newrating=utils.modifyRating(this.calificacion, ratingactual, cantidadReviewsactual)
    fixer.rating=newrating
    fixer.cantidadReviews=cantidadReviewsactual+1
    await fixer.save()
    
    next()
})

reviewSchema.index({ usuario:1, trabajo:1},{unique:true})

const Model=mongoose.model('Review', reviewSchema )

module.exports=Model;