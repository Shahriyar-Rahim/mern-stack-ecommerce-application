import React from "react";
import { useParams } from "react-router";
import { useFetchProductbyIdQuery, useFetchAllProductsQuery } from "../../../redux/features/products/productsApi";
import Loading from "../../../components/Loading";
import ErrorComponent from "../../../components/ErrorComponent";
import RatingStar from "../../../components/RatingStar";
import ReviewsCard from "../reviews/ReviewsCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/features/cart/cartSlice";
import ProductsCards from "../../shop/ProductsCards"; 

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // 1. Fetch the specific product details
  const {
    data: { data: productDetails } = {},
    isLoading,
    isError,
  } = useFetchProductbyIdQuery(id);

  const { product, reviews } = productDetails || {};

  // 2. Fetch products in the same category for "Related Products"
  // Only runs if product category exists
  const { data: { products: allProducts } = {} } = useFetchAllProductsQuery({
    category: product?.category,
    minPrice: 0,
    maxPrice: 5000,
  }, { skip: !product?.category });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorComponent onRetry={() => window.location.reload()} />;

  // Filter out the current product so it doesn't recommend itself
  const relatedProducts = allProducts
    ?.filter((p) => p._id !== id)
    .slice(0, 4);

  const handleAddToCart = (p) => {
    dispatch(addToCart(p));
  };

  return (
    <section className="section__container mt-6 md:mt-12 mb-20 px-4">
      {/* Product Top Section */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-20 items-center md:items-start justify-center">
        
        {/* LEFT: Image Section with restricted size for mobile */}
        <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[450px]">
          <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#f9f9f9] border border-gray-100 shadow-sm flex items-center justify-center cursor-zoom-in">
            <img
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-contain p-6 md:p-8 transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </div>
        </div>

        {/* RIGHT: Details Section */}
        <div className="w-full md:w-1/2 max-w-[500px] text-center md:text-left">
          <span className="inline-block text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">
            {product?.category}
          </span>
          
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-2">
            {product?.name}
          </h1>
          
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <RatingStar rating={product?.rating} />
            <span className="text-xs text-gray-400">({reviews?.length || 0} reviews)</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">${product?.price}</span>
            {product?.oldPrice && (
              <s className="text-lg text-gray-400 font-light">${product?.oldPrice}</s>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6 mb-6">
            <p className="text-gray-600 leading-relaxed italic text-sm md:text-base">
              {product?.description}
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
            <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">Color:</span>
            <span className="text-gray-600 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs capitalize">
              {product?.color}
            </span>
          </div>

          <button
            onClick={() => handleAddToCart(product)}
            className="w-full md:w-auto px-10 py-3 md:py-4 bg-primary hover:bg-black text-white font-bold rounded-lg transition-all duration-300 shadow-xl shadow-primary/20 text-sm md:text-base"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-gray-100 pt-12">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl md:text-2xl font-bold text-gray-900">Related Products</h3>
             <span className="text-sm text-primary font-medium cursor-pointer hover:underline">View all</span>
          </div>
          
          {/* Grid: 2 columns on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((item) => (
              <ProductsCards key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS SECTION */}
      <div className="mt-24 max-w-4xl mx-auto border-t border-gray-100 pt-12">
        <h3 className="text-xl md:text-2xl font-bold mb-10 text-center md:text-left text-gray-900">Reviews & Feedback</h3>
        <ReviewsCard productReviews={reviews} />
      </div>
    </section>
  );
};

export default Product;