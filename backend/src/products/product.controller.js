import Reviews from "../reviews/review.model.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import Products from "./product.model.js";

// create a product(only admin)
const createProduct = async (req, res) => {
  try {
    const newProduct = new Products({ ...req.body });
    const savedProduct = await newProduct.save();

    // calculate average rating
    const reviews = await Reviews.find({ productId: savedProduct._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      savedProduct.rating = averageRating;
      await savedProduct.save();
    }
    return successResponse(
      res,
      201,
      "Product created successfully",
      savedProduct
    );
  } catch (error) {
    return errorResponse(res, 500, "Failed to create product", error);
  }
};

// getAllProducts
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      color,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (color && color !== "all") {
      filter.color = color;
    }
    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }
    // const skip = (parseInt(page) - 1) * parseInt(limit);
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    const products = await Products.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "name username email")
      ;

    return successResponse(res, 200, "Successfully got all products", {
      products,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to get all products", error);
  }
};

// get single product
const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Products.findById(id).populate("author", "username email");
        if(!product){
            return errorResponse(res, 404, "Product not found");
        }
        const reviews = await Reviews.find({ productId: id }).populate("userId", "username email ");
        return successResponse(res, 200, "Successfully got single product", { product, reviews });
    } catch (error) {
        return errorResponse(res, 500, "Failed to get single product", error);
    }
}

// update product
const updateProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const updatedProduct = await Products.findByIdAndUpdate(productId, {...req.body}, { new: true });
        if(!updatedProduct){
            return errorResponse(res, 404, "Product not found");
        }
        return successResponse(res, 200, "Successfully updated product", updatedProduct);
    } catch (error) {
        return errorResponse(res, 500, "Failed to update product", error);
    }
}

// delete product by id
const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await Products.findByIdAndDelete(productId);
        if(!deletedProduct){
            return errorResponse(res, 404, "Product not found");
        }
        await Reviews.deleteMany({ productId });
        return successResponse(res, 200, "Successfully deleted product");
    } catch (error) {
        return errorResponse(res, 500, "Failed to delete product", error);
    }
}

export { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct };