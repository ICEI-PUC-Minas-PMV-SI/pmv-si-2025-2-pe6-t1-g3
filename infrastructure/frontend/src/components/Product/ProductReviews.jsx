import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { reviewService } from '../../services/api';
import StarRating from '../UI/StarRating';
import ReviewForm from './ReviewForm';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { toast } from 'react-toastify';

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({ total: 0, mediaNotas: 0 });
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadReviews();
    if (user) {
      checkUserCanReview();
    }
  }, [productId, user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviews(productId);
      setReviews(response.data.avaliacoes);
      setStatistics(response.data.estatisticas);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserCanReview = async () => {
    try {
      const response = await reviewService.checkPurchase(productId);
      setCanReview(response.data.comprou);
      setHasReviewed(response.data.jaAvaliou);
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
    }
  };

  const handleSubmitReview = async ({ rating, comment }) => {
    try {
      await reviewService.createReview({
        CODPROD: parseInt(productId),
        NOTA: rating,
        COMENTARIO: comment || undefined,
      });

      toast.success('Avaliação enviada com sucesso!', {
        autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000
      });

      setShowReviewForm(false);
      loadReviews();
      checkUserCanReview();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao enviar avaliação';
      toast.error(errorMessage, {
        autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000
      });
      throw error;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Avaliações
          </h3>
          {statistics.total > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(statistics.mediaNotas)} readonly size={16} />
              <span className="text-sm text-gray-600">
                {statistics.mediaNotas.toFixed(1)} ({statistics.total})
              </span>
            </div>
          )}
        </div>

        {user && canReview && !hasReviewed && !showReviewForm && (
          <Button onClick={() => setShowReviewForm(true)} size="small">
            Avaliar
          </Button>
        )}

        {user && hasReviewed && (
          <span className="text-xs text-gray-500">
            Você já avaliou
          </span>
        )}

        {user && !canReview && !hasReviewed && (
          <span className="text-xs text-gray-500">
            Compre para avaliar
          </span>
        )}
      </div>

      {showReviewForm && (
        <ReviewForm
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      <div className="space-y-6 mt-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Nenhuma avaliação ainda
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.CODAVA} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {review.PESSOA.NOME} {review.PESSOA.SOBRENOME}
                    </span>
                  </div>
                  <StarRating rating={review.NOTA} readonly size={14} />
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(review.DATAINC)}
                </span>
              </div>

              {review.COMENTARIO && (
                <p className="text-sm text-gray-700 mt-2">
                  {review.COMENTARIO}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
