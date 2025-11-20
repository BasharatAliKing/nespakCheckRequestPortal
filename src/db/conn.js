const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connection Successful");
}).catch((e)=>{
    console.log("No Connection", e && e.message ? `- ${e.message}` : '');
})
module.exports=mongoose;