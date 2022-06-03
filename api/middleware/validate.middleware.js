const axios = require('axios')
const dotenv = require('dotenv');

dotenv.config();

const validate = async (req, res, next) => {
    const response = await axios.get(
        `https://api.apilayer.com/number_verification/validate?number=${req.body.mobile}`,
        { headers: { apikey: process.env.API_KEY } }
    );

    parsedRes = JSON.parse(JSON.stringify(response.data));

    if (parsedRes.valid) {
        return next();
    } else {
        return res.status(403).json('your number is not valid')
    }
}



module.exports = validate;