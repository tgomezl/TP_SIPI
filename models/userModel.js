const mongoose =require("mongoose")
const validator=require("validator")
const bcrypt = require('bcryptjs');

const userSchema= new mongoose.Schema({
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
        select:false   //no hace un get de este campo
    },
    telefono:{type:String,
        select:false },
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
        default:"user"
    }
    //misreviewshechas:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    //trabajos:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Trabajo' }]

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

userSchema.virtual('isFixer').get(function() {
    return false;
});

userSchema.virtual("reviews",{
    ref:"Review",
    localField:"_id",
    foreignField:"usuario"
})

userSchema.virtual("trabajos",{
    ref:"Trabajo",
    localField:"_id",
    foreignField:"user"
})


userSchema.methods.checkPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre("save", async function(next) {
    
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password, 10)
    next()
})

const model= mongoose.model('User',userSchema)

module.exports=model;