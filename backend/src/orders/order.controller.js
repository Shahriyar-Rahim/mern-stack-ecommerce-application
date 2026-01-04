import { response } from "express";
import baseUrl from "../utils/baseUrl.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import stripe, { Stripe } from "stripe";
import Order from "./order.model.js";
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

const makePaymentRequest = async (req, res) => {
  const { products, userId } = req.body;

  if(!products || !userId) {
    return errorResponse(res, 400, "Missing required fields");
  }

  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));
    const session = await stripeClient.checkout.sessions.create({
      line_items: lineItems,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: { userId },
    });
    // response.json({ id: session.id });
    // return res.redirect(303, session.url);
    return res.status(200).json({ 
      id: session.id, 
      url: session.url  // The frontend will use this for window.location.href
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to make payment request", error);
  }
};

const confirmPaymentRequest = async (req, res) => {
    const { session_id } = req.body;
    // console.log(req.body)
    try {
        const session = await stripeClient.checkout.sessions.retrieve(session_id, {
            expand: ['line_items', 'payment_intent'],
        });
        const paymentIntentId = session.payment_intent.id;
        let order = await Order.findOne({ orderId: paymentIntentId });
        if(!order) {
            const lineItems = session.line_items.data.map((item) => ({
                productId: item.price.product,
                quantity: item.quantity,
            }));
            const amount = session.amount_total / 100;
            order = new Order({
                orderId: paymentIntentId,
                products: lineItems,
                amount: amount,
                email: session.customer_details.email,
                userId: session.metadata.userId,
                status: session.payment_intent.status === "succeeded" ? "pending" : "failed",
            });
            await order.save();
        }
        return successResponse(res, 200, "Successfully confirmed payment", order);
    } catch (error) {
        return errorResponse(res, 500, "Failed to confirm payment", error);
    }
}

const getOrdersByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        if(!email) {
            return errorResponse(res, 400, "Missing required fields");
        }
        const orders = await Order.find({ email }).sort({ createdAt: -1 });
        if(orders.length === 0 || !orders) {
            return errorResponse(res, 404, "No orders found");
        }
        return successResponse(res, 200, "Successfully got orders by email", orders);
    } catch (error) {
        return errorResponse(res, 500, "Failed to get orders by email", error);
    }
    
}

const getOrdersByOrderId = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(!order) {
            return errorResponse(res, 404, "Order not found");
        }
        return successResponse(res, 200, "Successfully got order by orderId", order);
    } catch (error) {
        return errorResponse(res, 500, "Failed to get orders by orderId", error);
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        if(orders.length === 0 || !orders) {
            return errorResponse(res, 404, "No orders found");
        }
        return successResponse(res, 200, "Successfully got all orders", orders);
    } catch (error) {
        return errorResponse(res, 500, "Failed to get all orders", error);
    }
}

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const {status} = req.body;

    if (!id || id === "undefined") {
        return errorResponse(res, 400, "Invalid or missing Order ID");
    }

    if(!status) {
        return errorResponse(res, 400, "Missing required fields");
    }
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, {
            new: true,
            runValidators: true
        });
        if(!updatedOrder) {
            return errorResponse(res, 404, "Order not found");
        }
        return successResponse(res, 200, "Successfully updated order status", updatedOrder);
    } catch (error) {
        return errorResponse(res, 500, "Failed to update order status", error);
    }
}

const deleteOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if(!deletedOrder) {
            return errorResponse(res, 404, "Order not found");
        }
        return successResponse(res, 200, "Successfully deleted order", deletedOrder);
    } catch (error) {
       return errorResponse(res, 500, "Failed to delete order", error); 
    }
}

export { makePaymentRequest, confirmPaymentRequest, getOrdersByEmail, getOrdersByOrderId, getAllOrders, updateOrderStatus, deleteOrderById };
