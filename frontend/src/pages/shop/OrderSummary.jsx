import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
// import { loadStripe } from '@stripe/stripe-js';
import { getBaseUrl } from "../../utils/getBaseUrl";
import axios from "axios";

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, selectedItems, totalPrice } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);

  const handleClearCart = (e) => {
    e.stopPropagation();

    Swal.fire({
      title: "Clear your cart?",
      text: "Items will be permanently removed from your bag.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "No, keep it",
      customClass: {
        popup: "rounded-2xl shadow-xl",
        confirmButton: "px-6 py-2.5 rounded-xl font-bold transition-all",
        cancelButton: "px-6 py-2.5 rounded-xl font-bold transition-all",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearCart());

        // Show success and then navigate after a brief pause
        Swal.fire({
          title: "Cleared!",
          text: "Your cart is now empty.",
          icon: "success",
          timer: 1200, // Slightly shorter for snappiness
          showConfirmButton: false,
          customClass: { popup: "rounded-2xl" },
        }).then(() => {
          navigate("/shop");
        });
      }
    });
  };

  const handleCheckout = async (e) => {
    // const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    // console.log(stripe)
    // e.preventDefault();
    try {
      const body = {
        products: products,
        userId: user?._id,
      };
      const response = await axios.post(
        `${getBaseUrl()}/api/orders/create-checkout-session`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // const result = await stripe.redirectToCheckout({
      //   sessionId: response.data.id
      // })
      const { url } = response.data;
      if (url) {
        // Direct redirect to Stripe-hosted page
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div className="space-y-5">
      {/* Price Details */}
      <div className="bg-white rounded-lg space-y-3">
        <div className="flex justify-between text-gray-500">
          <span className="text-sm">Subtotal ({selectedItems} items)</span>
          <span className="font-medium text-gray-900">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-gray-500 border-b border-dashed pb-4">
          <span className="text-sm">Shipping</span>
          <span className="text-green-600 font-medium text-sm italic">
            Will add on checkout
          </span>
        </div>

        <div className="pt-2 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              Estimated Total
            </span>
            <span className="text-3xl font-black text-gray-900 leading-none mt-1">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCheckout();
          }}
          className="w-full bg-black text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.97] shadow-lg shadow-black/10"
        >
          <span>Proceed to Checkout</span>
          <i className="ri-arrow-right-up-line"></i>
        </button>

        <button
          onClick={handleClearCart}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-100 text-gray-400 font-medium hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all duration-200"
        >
          <i className="ri-delete-bin-line"></i>
          <span className="text-sm">Clear Cart</span>
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
