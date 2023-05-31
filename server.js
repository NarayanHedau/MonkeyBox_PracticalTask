const express = require("express")
const database = require("./helper/database")
const bodyParser = require("body-parser")
const app = express()
const routes = require("./routes/googleAPI.routes")
const config = require("./config.json")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


database()
app.use("/api", routes)
const port =config.server.port;



app.listen(port, ()=>{
    console.log(`Server running on ${port} port `);
})