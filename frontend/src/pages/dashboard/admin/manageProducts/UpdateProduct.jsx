import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Navigate, useLocation, useNavigate } from 'react-router';
import { useFetchProductbyIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';
import Loading from '../../../../components/Loading';
import ErrorComponent from '../../../../components/ErrorComponent';
import UploadImage from '../addProduct/UploadImage';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import Swal from 'sweetalert2';

const categories = [
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

const UpdateProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // 1. Define State
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    color: "",
    image: "",
  });
  const [newImage, setNewImage] = useState(null);

  // 2. RTK Query Hooks (Must be called before any conditional returns)
  const { data, isLoading, error, refetch } = useFetchProductbyIdQuery(id);
  const [updateProduct] = useUpdateProductMutation();
  const navigate = useNavigate();
  const productData = data?.data?.product || {};

  // 3. Effects
  useEffect(() => {
    if (productData && Object.keys(productData).length > 0) {
      setProduct({
        name: productData.name || "",
        category: productData.category || "",
        description: productData.description || "",
        price: productData.price || "",
        color: productData.color || "",
        image: productData.image || "",
      });
    }
  }, [productData]);

  // 4. Conditional UI Returns
  if (!user) {
    Swal.fire("Please login to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent />;

  // 5. Handlers
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (imageFile) => {
    // Assuming UploadImage returns the file or URL
    setNewImage(imageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
        ...product,
        image: newImage ? newImage : product.image,
        author: user?._id,
    }

    try {
        await updateProduct({id: id, ...updatedProduct}).unwrap();
        Swal.fire({
            icon: 'success',
            title: 'Product Updated!',
            showConfirmButton: false,
            timer: 1500
        })
        await refetch();
        navigate("/dashboard/manage-products");
    } catch (error) {
        console.error("Error updating product:", error);
    }
  }
  
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* product name */}
        <TextInput
          label="Product Name"
          name="name"
          placeholder="Ex: Diamond Earrings"
          value={product.name}
          onChange={handleOnChange}
        />

        {/* category */}
        <SelectInput
          label="Category"
          name="category"
          value={product.category}
          onChange={handleOnChange}
          options={categories}
        />

        {/* color */}
        <TextInput
          label="Color"
          name="color"
          value={product.color}
          placeholder="Ex: Gold"
          onChange={handleOnChange}
        />

        {/* price */}
        <TextInput
          label="Price"
          name="price"
          type="number"
          placeholder="50"
          value={product.price}
          onChange={handleOnChange}
        />

        {/* image upload */}
        <UploadImage
          name="image"
          id="image"
          value={newImage || product.image}
          setImage={handleImageChange}
          placeholder="Upload a product image"
        />

        {/* description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={6}
            name="description"
            id="description"
            value={product.description}
            placeholder="Write a product description"
            onChange={handleOnChange}
            className="add-product-InputCSS w-full border p-2 rounded"
          />
        </div>

        <div>
          <button
            type="submit"
            className="add-product-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;