import { useState } from 'react';
import StarRating from '../UI/StarRating';
import Button from '../UI/Button';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Por favor, selecione uma avaliação em estrelas');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-6 border-t border-b border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Avaliação *
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size={24}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 resize-none"
            placeholder="Compartilhe sua experiência..."
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-1">
            {comment.length}/500
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          size="small"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
