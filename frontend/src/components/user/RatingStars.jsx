import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating, onRate, disabled = false, size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const starSize = sizes[size] || sizes.md;

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !disabled && onRate(star)}
          disabled={disabled}
          className={`${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
          type="button"
        >
          {star <= (rating || 0) ? (
            <FaStar className={`${starSize} text-yellow-400`} />
          ) : (
            <FaRegStar className={`${starSize} text-gray-300 hover:text-yellow-200`} />
          )}
        </button>
      ))}
    </div>
  );
};

export default RatingStars;