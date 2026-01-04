import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import { createReview, getTotalReviews, getUsersReviews } from "./review.controller.js";

const router = express.Router();

// post review
router.post('/create-review', createReview); //add token verify

// review counts
router.get('/total-reviews', getTotalReviews);

// get review data for user
router.get('/:userId', getUsersReviews);


export default router;