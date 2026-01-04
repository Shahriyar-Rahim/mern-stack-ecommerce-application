import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Helper to save state to localStorage
const saveToLocalStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const initialState = JSON.parse(localStorage.getItem("cart")) || {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
};


const calculateCartTotals = (products) => {
  const selectedItems = products.reduce(
    (total, product) => total + product.quantity,
    0
  );
  const totalPrice = products.reduce(
    (total, product) => total + product.quantity * product.price,
    0
  );

  return { selectedItems, totalPrice };
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExists = state.products.find(
        (product) => product._id === action.payload._id
      );
      // console.log(isExists)
      if (!isExists) {
        state.products.push({ ...action.payload, quantity: 1 });
        toast.success("Product added to cart");
      } else {
        toast.warn("Product already exists in the cart!");
      }
      const totals = calculateCartTotals(state.products);
      state.selectedItems = totals.selectedItems;
      state.totalPrice = totals.totalPrice;

      // add local storage sync
      saveToLocalStorage(state);
    },
    quantityUpdate: (state, action) => {
      const product = state.products.find(
        (item) => item._id === action.payload.id
      );
      if (product) {
        if (action.payload.type === "increment") {
          product.quantity += 1;
        } else if (
          action.payload.type === "decrement" &&
          product.quantity > 1
        ) {
          product.quantity -= 1;
        }
      }
      const totals = calculateCartTotals(state.products);
      state.selectedItems = totals.selectedItems;
      state.totalPrice = totals.totalPrice;

      // add local storage sync
      saveToLocalStorage(state);
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload.id
      );
      const totals = calculateCartTotals(state.products);
      state.selectedItems = totals.selectedItems;
      state.totalPrice = totals.totalPrice;

      // add local storage sync
      saveToLocalStorage(state);
    },
    clearCart: (state) => {
        Object.assign(state, initialState);

        // add local storage sync
        saveToLocalStorage(state);
    }
  },
});

export const { addToCart, quantityUpdate, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
