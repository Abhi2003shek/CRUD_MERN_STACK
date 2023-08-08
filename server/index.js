const express = require('express');
const cors =  require('cors');
const mongoose = require('mongoose')

const app = express();
app.use(cors()); //centralised connection
app.use(express.json()); //send data over express to mongoDB

const PORT = process.env.PORT || 8080;

const Schema = mongoose.Schema({ // Structure of the database
    name : String,
    email : String,
    mobile : String,
},{
    timestamps : true //makes data available when executed
});

const UserModel = mongoose.model("user",Schema); //Creating a model

app.get("/",async(req,res)=>{
    const data = await UserModel.find({});  //reading from the user model in DB
    res.json({success : true, Data : data});
})

app.post("/create",async (req,res)=>{
    const data = await UserModel(req.body);               //send the req from front end to DB
    await data.save();
    res.send({success : true, message : "data is updated",data : data}); //response
})

app.put("/update",async(req,res)=>{          //updating the data in MongoDB
    const {_id,...rest} = req.body;
    const data = await UserModel.updateOne({_id : _id},rest);   //update the specific part of data that is required
    res.send({success : true, message : "data is updated", data : data });
})

app.delete("/delete/:id", async(req,res)=>{     //deleting the data from database
    const id = req.params.id;
    const data = await UserModel.deleteOne({_id : id});
    res.send({success : true, message : "data is deleted Successfully", data : data });
});

mongoose.connect("mongodb://127.0.0.1:27017/Dashboard") //database connection
    .then(()=>{console.log("Connected to MongoDB")})
    .catch((err)=>console.log(err));


app.listen(PORT,()=> console.log("Server is running"));
