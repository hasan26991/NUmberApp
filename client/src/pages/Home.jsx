import React from 'react'
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline, Edit } from "@material-ui/icons";
import { useEffect, useState } from "react";
import axios from 'axios';

const Home = () => {
    const [newCustomer, setNewCustomer] = useState({});//state for the new customer to be added
    const [updateCustomer, setUpdateCustomer] = useState({});//state for inputs of the customer to be updated
    const [customers, setCustomers] = useState([]);//state for all customers when fetched to be displayed in the dataGrid
    const [updateMode, setUpdateMode] = useState(false);//state to display the update DIV when the update button is clicked 
    const [mobile, setMobile] = useState('');//state to save the mobile number, to verify it with verify route
    const [mobiledetails, setMobileDetails] = useState({});//store the verified moble information
    const [valid, setValid] = useState('');//state to show if the verify number is not valid
    const [validAdd, setValidAdd] = useState('');//state to show if the Add number is not valid


    //storing new customer input in newCustomer state
    const handleAddState = (e) => {
        e.preventDefault();
        setNewCustomer(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        });
    };
    //storing inputs for the customer to update
    const handleUpdateState = (e) => {
        e.preventDefault();
        setUpdateCustomer(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        });
    };

    //initiating a post request to add new customer
    const handleAdd = async () => {
        setValidAdd('');
        try {
            await axios.post('http://localhost:5000/api/customer/', newCustomer);
            getCustomers();
        } catch (error) {
            if (error.response.status === 403) { setValidAdd(error.response.data) };
        }
    };

    //initiating a PUT request to update a customer
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/customer/${updateCustomer._id}`, { name: updateCustomer.name, address: updateCustomer.address });
            getCustomers();
        } catch (error) {
            console.log(error);
        }
        setUpdateMode(false);

    };
    //Delete request to delete a user
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/customer/${id}`);
            getCustomers();
        } catch (error) {
            console.log(error);
        }
    };
    //Get request to get all customers
    const getCustomers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/customer/');
            setCustomers(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    //POST request to validate any mobile number
    const handleValidateMobile = async () => {
        setMobileDetails({});
        setValid('')
        try {
            const res = await axios.get(`http://localhost:5000/api/validate/${mobile}`);
            setMobileDetails(res.data)


        } catch (error) {
            if (error.response.status === 403) { setValid(error.response.data) };
        }
    };
    //this useeffect runs on the initial mount of this web page to fetch all users from DB
    useEffect(() => {
        getCustomers();
    }, []);

    //these are input columns for the DATAGRID
    const columns = [
        { field: "_id", headerName: "ID", width: 220 },
        { field: "name", headerName: "Name", width: 130 },
        { field: "address", headerName: "Address", width: 160, },
        { field: "mobile", headerName: "Mobile", width: 160, },
        {
            field: "action", headerName: "Action", width: 150, renderCell: (params) => {
                return (
                    <>
                        <Edit
                            style={{ color: 'green', fontSize: '30', margin: '20', cursor: 'pointer' }}

                            className="productListEdit"
                            onClick={function () {
                                setUpdateCustomer({         //this sets the clicked customer in the updateCustomer state,
                                    _id: params.row._id,    //for then we can handle Put request with new data
                                    name: params.row.name,
                                    address: params.row.address,
                                    mobile: params.row.mobile
                                });
                                setUpdateMode(true);
                            }}
                        />
                        <DeleteOutline
                            className="productListDelete"
                            style={{ color: 'red', cursor: 'pointer', margin: '30' }}
                            onClick={() => handleDelete(params.row._id)}      //this initialize a delete request with customer ID
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div style={{ margin: '15px', display: 'flex' }}>
            <div style={{ flex: '5' }}>
                <div>
                    <input name="name" type='text' placeholder="enter you name" onChange={handleAddState} />
                    <input name="address" type='text' placeholder="enter you address" onChange={handleAddState} />  {/*This is Add Customer Div*/}
                    <input name="mobile" type='text' placeholder="enter you mobile" onChange={handleAddState} />
                    <button onClick={handleAdd}>ADD</button>
                    <label style={{ color: 'red' }}>{validAdd}</label>
                </div>
                <div className="" style={{ height: '80vh' }}>      {/*This is a DATAGRID that contains all Customers*/}
                    <DataGrid
                        rows={customers}
                        disableSelectionOnClick
                        columns={columns}
                        getRowId={(row => row._id)}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                    />
                </div>
                {updateMode &&      //This is update div it is shown when update mode is on
                    <div>
                        <input name="name" type='text' placeholder={updateCustomer.name} onChange={handleUpdateState} />
                        <input name="address" type='text' placeholder={updateCustomer.address} onChange={handleUpdateState} />
                        <button onClick={handleUpdate}>UPDATE</button>
                    </div>}
            </div>
            <div style={{ flex: '3', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{/*This is Verify mobile div*/}
                <label >Enter mobile :</label>
                <input type='text' style={{}} onChange={(e) => setMobile(e.target.value)} />
                <label style={{ color: 'red' }}>{valid}</label>
                <label >Country Code:</label>
                <span style={{ color: 'green' }}>{mobiledetails?.countryCode}</span>
                <label>Country Name:</label>
                <label style={{ color: 'green' }}>{mobiledetails?.countryName}</label>
                <label>Operator Name:</label>
                <label style={{ color: 'green' }}>{mobiledetails?.operatorName}</label>
                <button onClick={handleValidateMobile}>Verify</button>
            </div>
        </div>
    )
}

export default Home