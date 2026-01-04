import express from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "./product.controller.js";
import { get } from "mongoose";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";


const router = express.Router();

// create a product
router.post("/create-product", verifyToken, verifyAdmin, createProduct);

// get all products
router.get("/", getAllProducts);

// get single product
router.get("/:id", getSingleProduct);

// update product by admin
router.patch("/update-product/:id", verifyToken, verifyAdmin, updateProduct);

// delete product by admin
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;