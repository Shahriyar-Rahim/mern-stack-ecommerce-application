import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import UploadImage from "./UploadImage";
import axios from "axios";
import { useAddProductMutation } from "../../../../redux/features/products/productsApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const categoris = [
  { label: "Select Category", value: "" },
  { label: "Accessories", value: "accessories" },
  { label: "Dress", value: "dress" },
  { label: "Jewellery", value: "jewellery" },
  { label: "Cosmetics", value: "cosmetics" },
  { label: "Electronics", value: "electronics" },
  { label: "Shoes", value: "shoes" },
  { label: "Clothing", value: "clothing" },
  { label: "Others", value: "others" },
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);
    if(!user){
        Swal.fire("Please login to access this page");
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    color: "",
  });

  const [image , setImage] = useState("");
  const [AddProduct, {isLoading, error}] = useAddProductMutation();

  const handleOnChnage = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!product.name || !product.category || !product.price || !product.color || !image || !product.description ){
      return toast.error("Please fill all the fields");
    }
    try {
        await AddProduct({...product, image, author: user?._id}).unwrap();
        Swal.fire({
            icon: 'success',
            title: 'Product Added!',
            showConfirmButton: false,
            timer: 1500
        })
        setProduct({name: "", category: "", description: "", price: "", color: ""});
        setImage("");
    } catch (error) {
        console.error("Error adding product:", error);
        
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className=" text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Product Name"
          type="text"
          name="name"
          placeholder="Ex: Nike Air Max 90"
          value={product.name}
          onChange={handleOnChnage}
        />
        <SelectInput
          label="Category"
          name="category"
          value={product.category}
          onChange={handleOnChnage}
          options={categoris}
        />
        <TextInput
          label="Price"
          type="number"
          name="price"
          placeholder="Ex: 200"
          value={product.price}
          onChange={handleOnChnage}
        />
        <TextInput
          label="Color"
          type="text"
          name="color"
          placeholder="Ex: Black"
          value={product.color}
          onChange={handleOnChnage}
        />

        {/* image upload */}
        <UploadImage
        label="image"
        name="image"
        id="image"
        value={ e => setImage(e.target.value)}
        placeholder="Upload Image"
        setImage={setImage}
        />

        {/* description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleOnChnage}
            rows="4"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* submit buton */}
        <div>
          <button type="submit" className="add-product-btn">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
