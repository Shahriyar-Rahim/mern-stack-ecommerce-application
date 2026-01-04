import React, { useState } from "react";
import RatingStar from "../../../components/RatingStar";
import commentorImg from "../../../assets/avatar.png";
import PostAReview from "./PostAReview";

const ReviewsCard = ({ productReviews }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const reviews = productReviews || [];

  return (
    <div className="my-10 bg-white p-6 md:p-10 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-4">
          Customer Reviews ({reviews.length})
        </h3>

        {reviews.length > 0 ? (
          <div className="m-5 divide-y divide-gray-100">
            {reviews.map((review, index) => (
              <div key={index} className="py-6 flex flex-col sm:flex-row gap-4">
                {/* Avatar - Reduced size and fixed aspect ratio */}
                <div className="shrink-0">
                  <img
                    src={review?.userId?.image || commentorImg}
                    alt={review?.userId?.username}
                    className="h-12 w-12 rounded-full object-cover border border-gray-200"
                  />
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 capitalize leading-tight">
                        {review?.userId?.username}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(review?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <RatingStar rating={review?.rating} />
                  </div>

                  {/* Comment Text - Removed excessive padding, added light bg */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {review?.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-400 italic">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center md:justify-start">
        <button 
        onClick={handleOpenModal}
        className="mt-5 px-8 py-3 bg-red-500 hover:bg-red-600 transition-colors text-white rounded-full font-medium flex items-center gap-2 shadow-md">
          <i className="ri-pencil-line"></i> Write a Review
        </button>
      </div>

      {/* PostAReview Modal */}
        <PostAReview modalOpen={isModalOpen} handleCLose={handleCloseModal} />
      
    </div>
  );
};

export default ReviewsCard;
