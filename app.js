const express=require("express")
const app = express();

const userRouter =require("./routes/userRouter")
const reviewRouter= require("./routes/reviewRouter")
const fixerRouter= require("./routes/fixerRouter")
const adminRouter= require("./routes/adminRouter")
const trabajoRouter=require("./routes/trabajoRouter")

app.use(express.json());
app.use((req, res, next) => {
  console.log('running midelware 👋');
  next();
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/fixers', fixerRouter);
app.use('/api/v1/trabajos', trabajoRouter);
app.use('/api/v1/admins', adminRouter);
//imagen
//trabajo


//router para bad request

app.use((err, req, res, next)=> {
    console.error(err.stack);
    console.log(" ");
    console.log(err.message);
    res.status(500).send('Something broke!');
});

module.exports = app;