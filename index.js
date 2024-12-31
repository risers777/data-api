const express = require('express');
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const helmet = require('helmet');
const compression = require('compression');
const ratelimit = require('express-rate-limit');



// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres'
// });
const sequelize = new Sequelize(process.env.DATABASE_URL, {
   // host: DBServerName,
    dialect: "postgres",   
    port: 5432,
  });

const SensorData = sequelize.define('sensor-data', {
     serial: { 
        type: DataTypes.STRING,
        allowNull: false
     }, 
     name: {
        type: DataTypes.STRING,
        allowNull: false
     }, 
     temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
     }

})

const limiter = ratelimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100 //limit each IP to 10 requests per windowMs
});

const app = express();  
app.use(helmet()); 
app.use(compression());
app.use(limiter);
app.use(express.json()); 

app.get('/data', async (req, res) => {
const allData = await SensorData.findAll();
res.status(200).send(allData) 
return;
});

app.post('/data', async (req, res) => { 
    let data = req.body; 
    const sensorData = await SensorData.create(data); 
    res.status(201).send(data); 
    return; 
    })

app.listen({ port: 8080}, () => {
    try {
        sequelize.authenticate();
        console.log('Connected to database')
       // sequelize.sync({alter: true})
       // console.log('connect to the database')
    } catch (error) {
        console.log('could not connect to the db', error);  
    }
    console.log('server is running');
    });