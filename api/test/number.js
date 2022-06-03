const chai = require('chai')
const chaihttp = require('chai-http')
const server = require('../index')

//Assertion Style
chai.should();

chai.use(chaihttp);

describe('Number API', () => {
    let mochID = '';

    //Test Get All Customers
    describe('GET /api/customer', () => {
        it('it should get all customers', (done) => {
            chai.request(server)
                .get('/api/customer/')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array')
                    done();
                });
        });
        it('it should not get all customers with wrong api', (done) => {
            chai.request(server)
                .get('/api/custome')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });
    });

    //Test Add Customer
    describe('Post /api/customer', () => {
        it('it should Post a new customer', (done) => {
            const customer = {
                name: 'hasan',
                address: 'birut',
                mobile: '96171435997'
            }
            chai.request(server)
                .post('/api/customer/')
                .send(customer)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.eq('"created succesfully"')
                    done();
                });
        });

        it('it should not Post a new customer without name property', (done) => {
            const customer = {
                address: 'birut',
                mobile: '96171435997'
            }
            chai.request(server)
                .post('/api/customer/')
                .send(customer)
                .end((err, response) => {
                    response.should.have.status(400);
                    done();
                });
        });
    });

    //Test Put Customer

    describe('Put /api/customer/:id', () => {
        it('it should Put an existing customer', (done) => {
            const id = '62961bfe351ef3c5a377c705';
            const customer = {
                name: 'bob',
                address: 'saida'
            };
            chai.request(server)
                .put('/api/customer/' + id)
                .send(customer)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.eq('"updated succesfully"')
                    done();
                });
        });
        it('it should not Put customer if the id is wrong', (done) => {
            const id = '123456';
            const customer = {
                name: 'bob',
                address: 'saida'
            };
            chai.request(server)
                .put('/api/customer/' + id)
                .send(customer)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq('"could not find the user by id"')
                    done();
                });
        });
    });


    //Test Delete Customer
    describe('Delete /api/customer/:id', () => {
        it('it should Delete an existing customer', (done) => {
            const id = '6297f147cf26146973469491';
            chai.request(server)
                .delete('/api/customer/' + id)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.eq('"customer has been deleted"')
                    done();
                });
        });
        it('it should not Delete a customer if you didnt send id', (done) => {
            chai.request(server)
                .delete('/api/customer/')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });
    });


    //Test Validate Mobile Number
   
    describe('Get /api/validate/', () => {
        it('it should validate phone number and send info about it', (done) => {
            chai.request(server)
                .get('/api/validate/96171435997')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('countryName').eq('Lebanon');
                    response.body.should.have.property('countryCode').eq('+961');
                    response.body.should.have.property('operatorName');
                    done();
                });
        });
        it('it should not validate if you send a non-valid moblie number', (done) => {
            chai.request(server)
                .get('/api/validate/123')
                .end((err, response) => {
                    response.should.have.status(403);
                    response.text.should.be.eq('"your number is not valid!"')
                    done();
                });
        });
    });

});