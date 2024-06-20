import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useParams, Link } from 'react-router-dom';
import checkAuth from '../auth/checkAuth';

function ViewMenu() {
    const user = useSelector(state => state.auth.user);
    const [menuItems, setMenuItems] = useState([]);
    const { restaurantId } = useParams();
    const [counts, setCounts] = useState({});

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = () => {
        console.log(restaurantId);
        axios.get(`http://localhost:8000/restaurants/${restaurantId}/menu/`, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            setMenuItems(response.data);
            console.log(response.data)
            const initialCounts = response.data.reduce((acc, menuItem) => {
                acc[menuItem.id] = 1;
                return acc;
            }, {});
            setCounts(initialCounts);
        })
        .catch(error => {
            console.error('Error fetching menu items:', error);
        });
    };

    const deleteMenuItem = (menuId) => {
        axios.delete(`http://localhost:8000/restaurants/${restaurantId}/menu/${menuId}/`, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(() => {
            setMenuItems(menuItems.filter(menu => menu.id !== menuId));
            alert("Menu item removed successfully");
        })
        .catch(error => {
            console.error('Error deleting menu item:', error);
        });
    };

    const increment = (id) => {
        setCounts(prevCounts => ({
            ...prevCounts,
            [id]: (prevCounts[id] || 0) + 1
        }));
    };

    const decrement = (id) => {
        setCounts(prevCounts => ({
            ...prevCounts,
            [id]: (prevCounts[id] || 0) > 1 ? (prevCounts[id] || 0) - 1 : 1
        }));
    };

    const calculateTotalPrice = () => {
        return menuItems.reduce((total, menuItem) => {
            const count = counts[menuItem.id] || 0;
            return total + (menuItem.price * count);
        }, 0);
    };

    const AddToCart = (item) => {
        const cartData = {
            restaurantName: item.restaurantName,
            user: user.userId,
            Image_url: item.Image_url,
            name: item.name,
            count: counts[item.id] || 0,
            sumTotal: calculateTotalPrice()
        };

        axios.post('http://localhost:8000/add_cart_item/', cartData)
        .then(response => {
            alert("Item added to cart");
        })
        .catch(error => {
            console.error('Error creating booking:', error);
        });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-12'>
                    {user.userId === 2 ? (
                        <div>
                            <Link to='/home' className="btn btn-secondary m-1 float-right">Home</Link>
                            <h2>Menu Items</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Dish</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuItems.map(menu => (
                                        <tr key={menu.id}>
                                            <img src={menu.Image_url} style={{width:"65px", height:"70px"}} alt="Dish" />
                                            <td>{menu.name}</td>
                                            <td>{menu.description}</td>
                                            <td>{menu.price}</td>
                                            <td>
                                                <button onClick={() => deleteMenuItem(menu.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="col-12">
                            <Link to='/home' className="btn btn-secondary m-1 float-right">Home</Link>
                            <div className="d-flex flex-wrap">
                                {menuItems.map((menu) => (
                                    <div key={menu.id} className="card bg-warning m-2" style={{ width: '200px', height: 'auto' }}>
                                        <img className="card-img-top" src={menu.Image_url} style={{ height: '200px', objectFit: 'cover' }} alt="menu poster" />
                                        <div className="card-body">
                                            <h5 className="card-title">{menu.name}</h5>
                                            <p className="card-text">{menu.description}</p>
                                            <div className="input-group d-flex justify-content-center mb-3">
                                                <div className="input-group-prepend">
                                                    <button className="btn btn-primary btn-sm" style={{ height: "30px" }} onClick={() => decrement(menu.id)}>-</button>
                                                </div>
                                                <h2 className="bg-light" style={{ width: "35px", height: "30px", textAlign:"center", fontSize:"24px" }}>{counts[menu.id] || 0}</h2>
                                                <div className="input-group-append">
                                                    <button className="btn btn-primary btn-sm" style={{ height: "30px" }} onClick={() => increment(menu.id)}>+</button>
                                                </div>
                                                <button className="btn btn-primary btn-sm" onClick={() => AddToCart(menu)}>Add To Cart</button>
                                            </div>
                                            <div className='d-flex justify-content-center'>
                                                <h6 className="card-text">{calculateTotalPrice()}</h6>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default checkAuth(ViewMenu);
