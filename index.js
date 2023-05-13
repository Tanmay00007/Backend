const express = require('express');
const cors = require('cors');
const helmet =require('helmet')
const connectDB =  require('./Config/Db_config');
require('dotenv').config()
const userRoutes = require('./Routes/UserRoute')
const port = process.env.REACT_APP_PORT;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
connectDB();

app.use('/api/v1',userRoutes);
app.get("/", (req, res) => {
    res.json({ message: "Hello from Parking Movers" });
  });

app.listen(port , ()=>{
    console.log(`Server is running on ${port} ...`);
})