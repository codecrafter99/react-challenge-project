import React, { Component } from 'react';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import './viewOrders.css';
import axios from 'axios';

class ViewOrders extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            order_item: "",
            quantity: "1",
            orders: [],
            orderSelected: null,
            newQuantity: 1,
            editModeEnabled: false
        }
    }
    componentDidMount() {
        fetch(`${SERVER_IP}/api/current-orders`)
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    this.setState({ orders: response.orders });
                } else {
                    console.log('Error getting orders');
                }
            });
    }

    onOrderDelete = (orderId) => {
        // send delete api call
        // call goes out, but CORS error makes it fail
        console.log("deleting " + orderId);
        axios.delete(
            `${SERVER_IP}/api/delete-order/${orderId}`
        ).then(
            res => {
                console.log(res);
                console.log(res.data);
            }
        )
    }

    onDeleteAll = () => {
        // the function deletes all of the records, but doesn't automatically refresh the screen
        axios.delete(
            `${SERVER_IP}/api/delete-all`
        ).then(
            res => {
                console.log(res);
                console.log(res.data);
            }
        )
    }

    onQuantityChange = (event) => {
        console.log("newQuantity " + event.target.value);
        this.setState({newQuantity: event.target.value});
    }

    saveOrder = (order) => {
        // call goes out, but CORS error makes it fail
        console.log(order._id);
        axios.post(`${SERVER_IP}/api/edit-order/${order._id}`, { 
            ordered_by: order.ordered_by,
            quantity: this.state.newQuantity
         })
        .then(res => {
            console.log(res);
            console.log(res.data);
        })
    }

    render() {
        return (
            <Template>
                <button onClick={() => {this.onDeleteAll()}} 
                    className="btn btn-danger">Delete All</button>
                <div className="container-fluid">
                    {this.state.orders.map(order => {
                        const createdDate = new Date(order.createdAt);
                        return (
                            <div className="row view-order-container" key={order._id}>
                                <div className="col-md-4 view-order-left-col p-3">
                                    <h2>{order.order_item}</h2>
                                    <p>Ordered by: {order.ordered_by || ''}</p>
                                </div>
                                <div className="col-md-4 d-flex view-order-middle-col">
                                    <p>Order placed at {`${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`}</p>
                                    <p>Quantity: {order.quantity}</p>
                                    <form>
                                        <label>New Qty: 
                                            <input 
                                                type="text" 
                                                value={this.state.newQuantity} 
                                                onChange={(e) => {this.onQuantityChange(e)}}
                                                name="quantity" />
                                        </label>
                                    </form>
                                    
                                 </div>
                                 <div className="col-md-4 view-order-right-col">
                                 <button 
                                    onClick={() => {this.saveOrder(order)}} 
                                    className="btn btn-success">Save</button>
                                <button 
                                    onClick={() => {this.onOrderDelete(order._id)}} 
                                    className="btn btn-danger">Delete</button>
                                 </div>
                            </div>
                        );
                    })}
                </div>
            </Template>
        );
    }
}

export default ViewOrders;
