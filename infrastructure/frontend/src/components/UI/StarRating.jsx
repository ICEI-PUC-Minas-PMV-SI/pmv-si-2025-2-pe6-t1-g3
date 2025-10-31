import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 18 }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={readonly ? 'cursor-default' : 'cursor-pointer'}
          aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
        >
          <FiStar
            size={size}
            className={star <= rating ? 'fill-gray-900 text-gray-900' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
