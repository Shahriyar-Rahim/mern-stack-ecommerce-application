import axios from "axios";
import React, { useState } from "react";
import { getBaseUrl } from "../../../../utils/getBaseUrl";
import { toast } from "react-toastify";
import Loading from "../../../../components/Loading";

const UploadImage = ({ name, setImage, label }) => {
  const [loader, setLoader] = useState(false);
  const [url, setUrl] = useState("");

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const uploadSingleImage = async (base64) => {
    setLoader(true);
    try {
      const res = await axios.post(`${getBaseUrl()}/upload-image`, { image: base64 });
      
      // FIXED: Accessing the nested data property from your backend response
      const actualUrl = res.data.data; 

      setUrl(actualUrl);
      setImage(actualUrl); 
      toast.success("Image uploaded successfully");
      setLoader(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoader(false);
      toast.error("Failed to upload image");
    }
  };

  const uploadImage = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const base64 = await convertBase64(files[0]);
      uploadSingleImage(base64);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <input
        onChange={uploadImage}
        type="file"
        name={name}
        id={name}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
      />

      {loader && <div className="mt-2"><Loading /></div>}

      {url && (
        <div className="mt-3">
          <p className="text-green-600 text-xs font-medium mb-2 italic">Image uploaded successfully</p>
          
          {/* RESPONSIVE THUMBNAIL */}
          <div className="relative inline-block">
            <img
              src={url}
              alt="product preview"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-md"
            />
            {/* REMOVE BUTTON */}
            <button 
              type="button"
              onClick={() => { setUrl(""); setImage(""); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-600 shadow-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;