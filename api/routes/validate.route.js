const router = require('express').Router();
const axios = require('axios')
const dotenv = require('dotenv');

dotenv.config();


router.get('/:mobile', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.apilayer.com/number_verification/validate?number=${req.params.mobile}`,
            { headers: { apikey: process.env.API_KEY } }
        );

        parsedRes = JSON.parse(JSON.stringify(response.data));
        if (parsedRes.valid) {
            res.status(200).json(
                {
                    countryCode: parsedRes.country_prefix,
                    countryName: parsedRes.country_name,
                    operatorName: parsedRes.carrier
                }
            );
        }
        else {
            res.status(403).json('your number is not valid!')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
