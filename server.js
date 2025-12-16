const express = require("express");
const cors = require('cors')

require('dotenv').config();
const connectDB = require("./config/db");

//routes
const locationRoutes = require("./routes/locationRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/location",locationRoutes)

connectDB()

app.listen(process.env.PORT,()=>{
    console.log(`SERVER RUNNING ON THE PORT ${process.env.PORT}`);
    
})