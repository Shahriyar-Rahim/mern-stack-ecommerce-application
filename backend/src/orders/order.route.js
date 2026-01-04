import express from "express";
import { confirmPaymentRequest, deleteOrderById, getAllOrders, getOrdersByEmail, getOrdersByOrderId, makePaymentRequest, updateOrderStatus } from "./order.controller.js";

const router = express.Router();

// create checkout session
router.post('/create-checkout-session', makePaymentRequest);

// confirm payment
router.post('/confirm-payment', confirmPaymentRequest);

//get order by email
router.get('/:email', getOrdersByEmail);

// get orders by orderId
router.get('/order/:id', getOrdersByOrderId);

// get all orders only admin
router.get("/", getAllOrders);

// update order status admin only
router.patch('/update-order-status/:id', updateOrderStatus);

// delete order admin only
router.delete('/delete-order/:id', deleteOrderById);


export default router;