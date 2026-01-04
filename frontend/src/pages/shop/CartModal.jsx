import React from "react";
import OrderSummary from "./OrderSummary";
import { useDispatch } from "react-redux";
import { quantityUpdate, removeFromCart } from "../../redux/features/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";

const CartModal = ({ products, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleUpdateQuantity = (type, id) => {
    dispatch(quantityUpdate({ type, id }));
  };

  const handleRemoveFromCart = (e, id) => {
    e.preventDefault();
    dispatch(removeFromCart({ id }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-1000"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 md:w-[450px] w-full bg-white h-full shadow-2xl z-1001 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
              <div>
                <h4 className="text-2xl font-bold text-gray-800">Your Cart</h4>
                <p className="text-sm text-gray-500">{products.length} items</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-gray-50 p-6 rounded-full mb-4">
                     <i className="ri-shopping-cart-2-line text-4xl text-gray-300"></i>
                  </div>
                  <p className="text-gray-500 font-medium">Your cart is feeling a bit light.</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 text-primary font-semibold hover:underline"
                  >
                    <Link to="/shop">Continue Shopping</Link>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {products.map((product, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={product?._id || index}
                      className="flex gap-4 items-center group"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-gray-100 border">
                        <img
                          src={product?.image}
                          alt={product?.name}
                          className="size-20 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 truncate w-40">
                          {product?.name || "Product Name"}
                        </h5>
                        <p className="text-primary font-bold mt-1">${product?.price}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Toggles */}
                          <div className="flex items-center border rounded-lg bg-gray-50">
                            <button
                              onClick={() => handleUpdateQuantity("decrement", product?._id)}
                              className="px-2 py-1 hover:text-primary transition-colors"
                            >
                              <i className="ri-subtract-line"></i>
                            </button>
                            <span className="px-3 text-sm font-medium w-8 text-center">
                              {product?.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity("increment", product?._id)}
                              className="px-2 py-1 hover:text-primary transition-colors"
                            >
                              <i className="ri-add-line"></i>
                            </button>
                          </div>

                          <button
                            onClick={(e) => handleRemoveFromCart(e, product?._id)}
                            className="text-xs text-red-400 hover:text-red-600 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {products.length > 0 && (
              <div className="border-t p-6 bg-gray-50">
                <OrderSummary />
                <button className="w-full mt-4 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all active:scale-[0.98]">
                    Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;