import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import checkAuth from '../auth/checkAuth';
import OrderConfirmation from './orderConf';

function CartList() {
    const user = useSelector(state => state.auth.user);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentLoading, setPaymentLoading] = useState(false);  
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({});

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        calculateTotalAmount();
    }, [cartItems]);

    const fetchCartItems = () => {
        axios.get(`http://localhost:8000/cart_list/${user.userId}/`, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            setCartItems(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching menu items:', error);
        });
    };

    const calculateTotalAmount = () => {
        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.sumTotal), 0);
        setTotalAmount(total);
    }; 

    const deleteMenuItem = (itemId) => {
        axios.delete(`http://localhost:8000/delete_cart_item/${itemId}`, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(() => {
            fetchCartItems();
            alert("Menu item removed successfully");
        })
        .catch(error => {
            console.error('Error deleting menu item:', error);
        });
    };

    const handlePayment = () => {
        setPaymentLoading(true); // Set loading state while payment is being processed
    
        axios.post('http://localhost:8000/initiate-payment/', {
            amount: totalAmount * 100, // Razorpay expects amount in paisa
            currency: 'INR', // Change to appropriate currency code
            orderId: `${user.userId}`, // Use a unique order ID
            description: `Booking for ${user.userName}`,
        }).then(response => {
            const { data } = response;
    
            const options = {
                key: 'rzp_test_B5RfVeU9FgSHpO', // Replace with your Razorpay key
                amount: data.amount,
                currency: data.currency,
                order_id: data.id,
                name: 'Bite Planet',
                description: 'Food delivery',
                handler: function(response) {
                    // Handle payment success
                    console.log(response);
                    if (response.razorpay_order_id) {
                        registerBookings();
                    }
    
                    axios.delete(`http://localhost:8000/clear_cart/${user.userId}/`, {
                        headers: { 'Authorization': `Token ${user.token}` }
                    })
                    .then(() => {
                        setCartItems([]); // Clear the cart items in the frontend
                    })
                    .catch(error => {
                        console.error('Error clearing cart:', error);
                        alert('Payment successful but failed to clear cart');
                    });
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '1234567890'
                },
                theme: {
                    color: '#3399cc'
                }
            };
    
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        }).catch(error => {
            console.error('Error initiating payment:', error);
            // Handle error
        }).finally(() => {
            setPaymentLoading(false); 
        });
    
        // Booking handling
        const registerBookings = () => {
            cartItems.forEach(item => {
                const bookingData = {
                    booking_id: Math.random().toString(36).substr(2, 8),
                    user: user.userId,
                    restaurantName: item.restaurantName,
                    booking_date: new Date().toISOString().split('T')[0],
                    count: item.count,
                    sumTotal: item.sumTotal,
                    name: item.name,
                    Image_url: item.Image_url,
                };
    
                axios.post('http://localhost:8000/create-booking/', bookingData)
                .then(response => {
                    setShowConfirmation(true);
                    setBookingDetails({
                        bookingId: response.data.booking_id,
                        totalAmount: totalAmount
                    });
                    generateEmail(response.data.booking_id);
                    console.log('Booking successful:', response.data);
                })
                .catch(error => {
                    console.error('Error creating booking:', error);
                });
    
                const generateEmail = (bookingId) => {
                    axios.post('http://localhost:8000/generate-qr-code/', {
                        "DishName": item.name,
                        "RestaurantName": item.restaurantName,
                        "Amount": item.sumTotal,
                        "Quantity": item.count,
                        "receiptId": bookingId,
                        "bookingDate": new Date().toISOString().split('T')[0],
                        "email": user.userEmail
                    })
                    .then(response => {
                        console.log('Email sent successfully:', response);
                    })
                    .catch(error => {
                        console.error('Error generating email:', error);
                    });       
                };
            });
        };
    };

    return (
        <div className='container-fluid'>
            {showConfirmation ? (
                <OrderConfirmation
                    bookingId={bookingDetails.bookingId}
                    name={bookingDetails.name}
                    totalAmount={bookingDetails.totalAmount}
                />
            ) : (
                <div className='row'>
                    <div className='col-12'>
                        <div>
                            <Link to='/home' className="btn btn-secondary m-1 float-right">Home</Link>
                            <h2>Cart contents</h2>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Dish</th>
                                    <th>Name</th>
                                    <th>Restaurant</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(menu => (
                                    <tr key={menu.id}>
                                        <img src={menu.Image_url} style={{width:"65px", height:"70px"}} alt="Dish" />
                                        <td>{menu.name}</td>
                                        <td>{menu.restaurantName}</td>
                                        <td>{menu.count}</td>
                                        <td>{menu.sumTotal}</td>
                                        <td>
                                            <button className='btn btn-primary btn-sm' onClick={() => deleteMenuItem(menu.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <hr />
                        <div className='d-flex'>
                            <h4 className='d-inline bg-warning border border-rounded'>Amount Payable: {totalAmount}</h4>
                            <button className='btn btn-primary ml-auto' onClick={handlePayment}>
                                {paymentLoading ? 'Processing Payment...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default checkAuth(CartList);
