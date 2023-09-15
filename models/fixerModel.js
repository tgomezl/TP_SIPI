const mongoose=require("mongoose")
const validator=require("validator")
const AppError=require("../utils/AppError")
const barrioModel =require("../models/barrioModel")
const tipoServicioModel=require("../models/tipoServicioModel")
const bcrypt = require('bcryptjs');
const utils=require("../utils/utiles")

const fixerSchema= new mongoose.Schema({
    nombre: {
        type:String,
        required:[true,"does not have name"]
    },
    apellido: {
        type:String,
        required:[true,"does not have lastname"]
    },
    mail:{
        type:String, 
        unique:[true,"mail is not unique"],
        lowercase: true,
        validate: [validator.isEmail," el email es invalido"],
        select:false
    },
    password:{
        type:String,
        required:[true, "no tiene password"],
        minlength: 8,
        select:false   
    },
    telefono:{
        type:String,
        select:false,
    },
    habilitado:{
        type: Boolean, 
        default:true
    },
    imagenPerfil:{
        type:String,
        default:"defaultImage.jpg"
    },
    passwordChangedAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    rol:{
        type:String,
        default:"fixer"
    },
    horario:{
        type:String
    },
    barrios:[{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Barrio' 
    }],
    tipoServicio:[{ type: mongoose.Schema.Types.ObjectId, ref: 'TipoServicio' }],
    rating:{ 
        type:Number,
        default:6.0,
    },
    cantidadReviews:{
        type:Number,
        default:1,
    }
    //misreviewsrecibidas:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    //trabajos:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Trabajo' }]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

fixerSchema.virtual('isFixer').get(function() {
    return true;
});

fixerSchema.virtual('isUser').get(function() {
    return false;
});

fixerSchema.virtual("reviews",{
    ref: "Review",
    foreignField:"fixer",
    localField: "_id",
    
})

fixerSchema.methods.checkPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

fixerSchema.methods.modifyRating = async function(fixer, calificacion) {
    console.log("el this.rating actual es", this.rating);
    const nuevorating=utils.calcRating(calificacion, this.rating, this.cantidadReviews)
    fixer.rating=nuevorating
    fixer.cantidadReviews=this.cantidadReviews+1;
    console.log("CALIFICACION MODFICIDADA");
    return fixer
    //return
};

fixerSchema.pre('save',  function(next) {
    // do stuff
    console.log("              *********************    ");
    console.log("this",this);
    if(this.barrios.length==0){
        console.log("no se guardara")
        next(new AppError("por favor especifique un barrio",401))
    }
    if(this.tipoServicio.length==0){
        console.log("no se guardara")
        next(new AppError("por favor especifique un servicio",401))
    }
    this.barrios.forEach(async element => {
        const barrio=await barrioModel.findById(element)
        console.log("el barrio es", barrio);
        if(!barrio){
            console.log("es null");
            return next(new AppError("barrio no valido",401))
        }
    });
    this.tipoServicio.forEach(async element => {
        const servicio=await tipoServicioModel.findById(element)
        console.log("el servicio es", servicio);
        if(!servicio){
            console.log("es null");
            return next(new AppError("tipo servicio no valido",401))
        }
    });
    
    console.log("              *********************    ");
    next();
});

fixerSchema.pre("save", async function(next) {
    
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 10)
    next()
})

const model= mongoose.model("Fixer", fixerSchema)

module.exports=model

