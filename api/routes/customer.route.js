const router = require('express').Router();
const Customer = require('../models/Customer.model')
const validate = require('../middleware/validate.middleware')
const ajvMiddlewere = require("../middleware/ajv.middlewere");
const addSchema = require("../schema/addCustomer");
const updateSchema = require("../schema/updateCustomer");

//AD NEW CUSTOMER
router.post('/', ajvMiddlewere(addSchema), validate, async (req, res) => {

    const newCustomer = new Customer(req.body);
    try {
        savedCustomer = await newCustomer.save();
        res.status(200).json('created succesfully')
    } catch (error) {
        res.status(400).json('could not save the customer');
    }
});
//UPDATE CUSTOMER BY ID
router.put('/:id', ajvMiddlewere(updateSchema), async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json('updated succesfully');
    }
    catch (error) {
        res.status(404).json('could not find the user by id');
    }
});
//DELETE CUSTOMER BY ID
router.delete('/:id', async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json("customer has been deleted");
    } catch (error) {
        res.status(404).json(error);
    }
});
//Get All CUSTOMERS
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(404).json(error);
    }
});





module.exports = router
