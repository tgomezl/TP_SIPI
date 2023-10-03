const express=require("express")
const app = express();

const cookieParser = require("cookie-parser");

app.use(cookieParser());
const cors=require("cors")

app.use(cors({
  origin:["http://localhost:3006"],
  credentials:true
  }
))

app.use((req,res,next)=>{
  console.log(" ");
  console.log(" ");
  console.log("             ***********************");
  console.log("la url es", req.url)
  console.log("el body recibido es", req.body)
  console.log("            **************************");
  console.log(" ");
  next()
})

const userRouter =require("./routes/userRouter")
const reviewRouter= require("./routes/reviewRouter")
const fixerRouter= require("./routes/fixerRouter")
const adminRouter= require("./routes/adminRouter")
const trabajoRouter=require("./routes/trabajoRouter")
const imageRouter=require("./routes/imageRouter")

const authController= require("./controllers/authController")


const AppError =require("./utils/AppError")

app.use(express.json());
app.use("/fotos",express.static('public/img'));


app.get("/sendfiles", (req, res, next) => {
   //console.log(req.params);
   console.log("imagename", req.params.imagename);
   console.log("dirname---->", __dirname);
   //DIRNAME ES ESTO
          // D:\UADE\3ER AÑO\2do CUATRI\CURSOS 2023\TP DE SIPI\TP GRUPAL SIPI\TP SIPI NODE\TP_SIPI
          //no me sirve porque es una ruta absoluta
   const rutaabsoluta=__dirname+"/public/img"+"/dos.jpg"
   const rutarel="./public/img"+"/dos.jpg"
   //ruta rel no funciona "path must be absolute or specify root to res.sendFile",
   console.log("ruta", rutaabsoluta);
    res.sendFile(rutaabsoluta)
})
app.use((req, res, next) => {
  console.log(JSON.stringify(req.headers));
  //cookies???
  if(req.cookies){
    console.log("vino con cookies");
    console.log(req.cookies);
    
    console.log(          "        token",req.cookies.token);
    console.log("values",Object.values(req.cookies));
  }else{
    console.log("no vino con cookies");
  }
  
  console.log('running midelware 👋');
  next();
});

//app.post("/api/v1/MODIFICARLASPASS", authController.MODIFICARLASPASS)


app.post("/api/v1/login", authController.login)
app.post("/api/v1/logout", authController.logout)
app.post("/api/v1/createadmin", authController.createAdmin)
app.post("/api/v1/newuser", authController.createUser )
app.post("/api/v1/newfixer", authController.createFixer )

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/trabajos', trabajoRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/fixers', fixerRouter);
app.use('/api/v1/images', imageRouter);
//imagen
//trabajo

app.all("*",(req,res,next)=>{
  //new app error
  next(new AppError(`${req.originalUrl} no esta definida`, 404))
})

//router para bad request

app.use((err, req, res, next)=> {
    console.error(err.stack);
    console.log(" ");
    console.log(err.message);
    res.status(500).json({
      mensaje:' Something broke! ',
      errormessage:err.message,
      stacktrace: err.stack,
    });
});

module.exports = app;