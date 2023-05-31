const mongoose = require("mongoose")
const config = require("../config.json")

module.exports=async()=>{
  try {
    await mongoose.connect(config.dbUrl).then(()=>{
        console.log("Database Connected Successfully");
    }).catch((error)=>{
        console.log(error);
    })
  } catch (error) {
    console.log(error);
  }

}