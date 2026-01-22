const express = require("express");
const cors = require('cors');

require('dotenv').config();
const connectDB = require("./config/db");

//routes
const locationRoutes = require("./routes/locationRoutes");
const userRoutes = require("./routes/userRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseAdmissionRoutes  = require("./routes/courseAdmissionRoutes")



const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors());

app.use("/location",locationRoutes);
app.use("/user",userRoutes);
app.use("/college",collegeRoutes);
app.use("/course",courseRoutes);
app.use("/application",applicationRoutes);
app.use("/admin",adminRoutes);
app.use("/admissionCourse",courseAdmissionRoutes)


connectDB()

app.listen(process.env.PORT,()=>{
    console.log(`SERVER RUNNING ON THE PORT ${process.env.PORT}`);
    
})