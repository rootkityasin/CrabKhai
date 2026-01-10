'use client';

import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { ReviewMoodModal } from './ReviewMoodModal';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
        name: string;
        image: string | null;
    };
}

interface ProductReviewsProps {
    productId: string;
    reviews: Review[];
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="mt-16 border-t border-gray-100 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Customer Reviews</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-5 h-5 ${parseFloat(averageRating) >= s ? 'fill-current' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="font-bold text-gray-900">{averageRating}</span>
                        <span className="text-gray-500">({reviews.length} reviews)</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    Write a Review
                </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-8">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                                    {review.user.image ? (
                                        <img src={review.user.image} alt={review.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        review.user.name[0]
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{review.user.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex text-yellow-500">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`w-3 h-3 ${review.rating >= s ? 'fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="mt-3 text-gray-600 leading-relaxed text-sm">{review.comment}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ReviewMoodModal
                productId={productId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
