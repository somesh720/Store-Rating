import React, { useState } from 'react';

const StoreCard = ({ store, onRatingSubmit }) => {
  const [selectedRating, setSelectedRating] = useState(store.user_rating || '');
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedRating) {
      alert('Please select a rating');
      return;
    }
    
    setLoading(true);
    try {
      await onRatingSubmit(selectedRating);
    } finally {
      setLoading(false);
    }
  };

  // Generate star display for average rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push('★');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  return (
    <article className="border border-gray-300 bg-gray-50 p-5 rounded shadow-[2px_2px_0px_#ddd] hover:bg-white hover:border-gray-400 transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-blue-800">{store.name}</h2>
          <p className="text-gray-700">{store.address}</p>
          
          {/* Store Rating Display */}
          <div className="mt-2 flex items-center">
            <span className="text-yellow-500 mr-2 text-lg">
              {renderStars(store.average_rating)}
            </span>
            <span className="text-sm text-gray-600">
              ({store.total_ratings} ratings) - {store.average_rating} avg
            </span>
          </div>

          {/* Rating Selector */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-gray-500">Your Rating:</span>
            <select
              className="border-gray-400 text-sm rounded-sm py-1"
              value={selectedRating}
              onChange={handleRatingChange}
              disabled={loading}
            >
              <option value="">Select Rating...</option>
              <option value="5">5 Stars - Excellent</option>
              <option value="4">4 Stars - Very Good</option>
              <option value="3">3 Stars - Average</option>
              <option value="2">2 Stars - Poor</option>
              <option value="1">1 Star - Terrible</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            className="bg-[#7B7B7B] hover:brightness-110 text-white px-6 py-2 rounded-sm font-bold text-sm border-b-4 border-[#555555] active:translate-y-0.5 transition-all w-full md:w-auto"
          >
            Edit Details
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedRating}
            className="bg-[#4A90E2] hover:brightness-110 text-white px-6 py-2 rounded-sm font-bold text-sm border-b-4 border-[#357ABD] active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default StoreCard;