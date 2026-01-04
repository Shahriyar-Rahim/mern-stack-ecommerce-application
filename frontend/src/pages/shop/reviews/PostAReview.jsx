import React, { useState } from "react";
import ErrorComponent from "../../../components/ErrorComponent";
import { useLocation, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useFetchProductbyIdQuery } from "../../../redux/features/products/productsApi";
import { useCreateReviewMutation } from "../../../redux/features/reviews/reviewsApi";
import { toast } from "react-toastify";

const PostAReview = ({ modalOpen, handleCLose, isError }) => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { refetch } = useFetchProductbyIdQuery(id, {
    skip: !id,
  });

  const handleRating = (value) => {
    setRating(value);
  };

  const handleResetAndClose = () => {
    setRating(0); // Reset stars
    setComment(""); // Clear text
    handleCLose(); // Close the modal
  };
  const navigate = useNavigate();
  const location = useLocation();

  const [createReview] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      return toast.warn("Please select a rating star!");
    }
    if (!comment.trim()) {
      return toast.warn("Please write a comment!");
    }
    // if(!user){
    //   return toast.warn("Please login to post a review!");
    // }
    if(!user){
      toast.warn("Please login to post a review!");

      setTimeout(() => {
        navigate("/login", {state: {from: location}});
      }, 1500);

      return;
    }
    

    // console.log("Clicked");
    const newReview = {
      comment: comment,
      rating: rating,
      userId: user?._id,
      productId: id,
    };
    try {
      const response = await createReview(newReview).unwrap();
      // give an alert here
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
      refetch();
      handleCLose();
    } catch (error) {
      // give an alert here
      toast.error(error?.data?.message || "Failed to create review");
      toast.error("Failed to create review");
      setRating(0);
      setComment("");
      handleCLose();
    }
  };

  if (isError) return <ErrorComponent />;
  return (
    <div
      className={`fixed inset-0 ${
        modalOpen ? "block" : "hidden"
      } bg-black/90 flex items-center justify-center z-40 px-2`}
    >
      <div className="bg-white p-6 rounded-md shadow-lg w-96 z-50">
        <h2 className="text-lg font-bold mb-4">Post a Review</h2>

        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              onClick={() => handleRating(star)}
              key={star}
              className="cursor-pointer text-yellow-500 text-xl"
            >
              {rating >= star ? (
                <i className="ri-star-fill"></i>
              ) : (
                <i className="ri-star-line"></i>
              )}
            </span>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full border border-gray-300 p-2 rounded-md mb-4"
          placeholder="Write your comment here..."
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleResetAndClose}
            className="px-4 py-2 bg-gray-300 rounded-md flex items-center gap-2"
          >
            <i className="ri-close-line"></i> Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"
          >
            <i className="ri-check-line"></i> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostAReview;
