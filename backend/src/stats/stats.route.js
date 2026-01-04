import express from "express";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import User from "../users/user.model.js";
import Order from "../orders/order.model.js";
import Reviews from "../reviews/review.model.js";
import Products from "../products/product.model.js";

const router = express.Router();

// user stats
router.get("/user-stats/:email", async(req, res) => {
    const { email } = req.params;
    if(!email) {
        return errorResponse(res, 400, "Missing required email");
    }
    try {
        const user = await User.findOne({email: email});
        if(!user) {
            return errorResponse(res, 404, "User not found");
        }
        // total payments
        const totalPayments = await Order.aggregate([
            {
                $match: {
                    email: email
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$amount"
                    }
                }
            }
        ]);
        
        const totalPaymentsAmount = totalPayments.length > 0 ? totalPayments[0].totalAmount : 0;
        
        // total reviews
        const totalReviews = await Reviews.countDocuments({userId: user._id});
        
        const purchasedProductsIds = await Order.distinct("products.productId", {email: email});
        
        const totalPurchasedProducts = purchasedProductsIds.length;

        return successResponse(res, 200, "Successfully got user stats", {
            totalPayments: Number(totalPaymentsAmount.toFixed(2)),
            totalReviews,
            totalPurchasedProducts
        });
    } catch (error) {
        return errorResponse(res, 500, "Failed to get user stats", error);
    }
});

// admin stats
router.get("/admin-stats", async (req, res) => {
    // count total  orders
    const totalOrders = await Order.countDocuments();

    // couunt total products
    const totalProducts = await Products.countDocuments();

    // total reviews
    const totalReviews = await Reviews.countDocuments();

    // count total users
    const totalUsers = await User.countDocuments();

    // const total earnings by summing the 'amount' of all orders
    const totalEarningsResults = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalEarnings: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    const totalEarnings = totalEarningsResults.length > 0 ? totalEarningsResults[0].totalEarnings : 0;

    // calculate monthly earnings bt summing the 'amount' of all orders grouped by month
    const monthlyEarningsResults = await Order.aggregate([
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                monthlyEarnings: {
                    $sum: "$amount"
                }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    // format the monthly earnings data for easier consuption on the frontend
    const monthlyEarnings = monthlyEarningsResults.map((entry) => ({
        month: entry._id.month,
        year: entry._id.year,
        earnings: entry.monthlyEarnings
    }));

    // send aggregated data
    res.status(200).send({
        totalOrders,
        totalProducts,
        totalReviews,
        totalUsers,
        totalEarnings,
        monthlyEarnings
    });
})

export default router