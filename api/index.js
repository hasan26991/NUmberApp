const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const validateRoute = require('./routes/validate.route');
const customerRoute = require('./routes/customer.route');
const cors = require('cors')

dotenv.config();
app.use(express.json());
app.use(cors());

//Connection to database
mongoose.connect(process.env.MONGO_URL)
    .then(console.log('Connected To Mongo'))
    .catch(err => console.log(err));

//Routes
app.use('/api/validate', validateRoute)
app.use('/api/customer', customerRoute)

//listning to request on port 5000
app.listen('5000', () => {
    console.log('backend is running');
})


module.exports = app;
