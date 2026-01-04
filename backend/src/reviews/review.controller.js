import Products from "../products/product.model.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import Reviews from "./review.model.js";

// create review
const createReview = async (req, res) => {
    try {
        const {comment, rating, userId, productId} = req.body;
        if(!userId){
            return errorResponse(res, 403, "Unauthorized access");
        }
        if(!comment || rating === undefined || !userId || !productId){
            return errorResponse(res, 400, "Missing required fields");
        }
        const existingREview = await Reviews.findOne({userId, productId});
        // console.log(existingREview)
        if (existingREview) {
            existingREview.comment = comment;
            existingREview.rating = rating;
            await existingREview.save();
        } else {
            const newReview = new Reviews({comment,rating, userId, productId});
            await newReview.save();
        }

        // average rating
        const reviews = await Reviews.find({productId});
        if(reviews.length > 0){
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            const product = await Products.findById(productId);
            if(!product){
                return errorResponse(res, 404, "Product not found");
            }
            product.rating = averageRating;
            await product.save({validateBeforeSave: false});
        }
        return successResponse(res, 201, "Review created successfully", reviews);
    } catch (error) {
        return errorResponse(res, 500, "Failed to create review", error);
    }
};

// get review data for user
const getUsersReviews = async (req, res) => {
    const { userId } = req.params;
    try {
        if(!userId) {
            return errorResponse(res, 400, "Missing required fields");
        }
        const reviews = await Reviews.find({userId: userId}).sort({createdAt: -1});
        if(reviews.length === 0){
            return errorResponse(res, 404, "No reviews found");
        }
        return successResponse(res, 200, "Successfully got user reviews", reviews);
    } catch (error) {
        return errorResponse(res, 500, "Failed to get user reviews", error);
    }
}

// getTotalReviews
const getTotalReviews = async (req, res) => {
    try {
        const totalReviews = await Reviews.countDocuments({});
        return successResponse(res, 200, "Successfully got total reviews", totalReviews);
    } catch (error) {
        return errorResponse(res, 500, "Failed to get total reviews", error);
    }
}

export { createReview, getUsersReviews, getTotalReviews };