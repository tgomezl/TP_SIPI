const express=require("express")
const app = express();

const userRouter =require("./routes/userRouter")
const reviewRouter= require("./routes/reviewRouter")
const fixerRouter= require("./routes/fixerRouter")
const adminRouter= require("./routes/adminRouter")
const trabajoRouter=require("./routes/trabajoRouter")
const authController= require("./controllers/authController")

const AppError =require("./utils/AppError")
app.use(express.json());

app.use((req, res, next) => {
  console.log('running midelware 👋');
  next();
});

app.post("/api/v1/login", authController.login)
app.post("/api/v1/createadmin", authController.createAdmin)
app.post("/api/v1/newuser", authController.createUser )
app.post("/api/v1/newfixer", authController.createFixer )

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/trabajos', trabajoRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/fixers', fixerRouter);
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
      mensaje:'Something broke!',
      errormessage:err.message,
      stacktrace: err.stack,
    });
});

module.exports = app;