//NPM I MONGOOSE@5
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');
//ESTA ES LOCAL
//const DB  = "mongodb://localhost:27017/TPSIPI"

//ESTA ESTA EN ATLAS:
const DB  = "mongodb+srv://user_dos_user_dos:user_dos_user_dos@cluster0.fjizn37.mongodb.net/"

mongoose.connect(DB,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
).then(()=>{
  console.log("    *****  conectado a la bbdd")
  //console.log("variable process", process);
}).catch(e=>{ 
    console.log(e.message)
})

const port=3000
app.listen(port,()=>{
  
    console.log("a la espera!!!")
})


