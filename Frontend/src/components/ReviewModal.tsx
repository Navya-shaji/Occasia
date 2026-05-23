import React, { useState } from 'react';
import { X, Star, Send, Loader2 } from 'lucide-react';
import reviewService from '../services/reviewService';
import toast from 'react-hot-toast';

interface ReviewModalProps {
    bookingId: string;
    serviceId: string;
    serviceName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReviewModal({ bookingId, serviceId, serviceName, onClose, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (comment.trim().length < 10) {
            toast.error('Comment must be at least 10 characters long');
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewService.createReview({
                booking: bookingId,
                service: serviceId,
                rating,
                comment: comment.trim(),
            });
            toast.success('Review submitted successfully!');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Exceptional'];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl"
                style={{ background: '#1a1a1a', border: '1px solid rgba(232, 213, 176, 0.15)' }}
            >
                {/* Header */}
                <div
                    className="px-8 py-6 relative"
                    style={{ background: 'rgba(232, 213, 176, 0.06)', borderBottom: '1px solid rgba(232, 213, 176, 0.1)' }}
                >
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 transition-colors"
                        style={{ color: '#666' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                    >
                        <X size={22} />
                    </button>
                    <h3 className="text-xl font-black tracking-tight" style={{ color: '#f5ede0' }}>Share Your Experience</h3>
                    <p className="text-sm mt-1" style={{ color: '#888' }}>Reviewing: {serviceName}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center mb-8">
                        <label className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#555' }}>
                            Tap to Rate
                        </label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                                >
                                    <Star
                                        size={40}
                                        style={{
                                            color: (hover || rating) >= star ? '#e8d5b0' : '#333',
                                            fill: (hover || rating) >= star ? '#e8d5b0' : 'none',
                                            transition: 'color 0.2s, fill 0.2s',
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="mt-3 text-sm font-bold uppercase tracking-wide" style={{ color: '#e8d5b0' }}>
                                {ratingLabels[rating - 1]}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: '#555' }}>
                            Detailed Feedback
                        </label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl text-sm min-h-[120px] resize-none outline-none transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e8d5b0',
                            }}
                            placeholder="What did you love about the service? How was the provider?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={500}
                            onFocus={e => (e.target.style.borderColor = 'rgba(232, 213, 176, 0.3)')}
                            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                        <div className="flex justify-between mt-1.5">
                            <span className="text-xs" style={{ color: '#444' }}>{comment.length}/500</span>
                            {comment.length < 10 && comment.length > 0 && (
                                <span className="text-xs" style={{ color: '#ff6b6b' }}>Min 10 chars</span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#888',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                            style={{ background: '#e8d5b0', color: '#111111' }}
                            onMouseEnter={e => !isSubmitting && (e.currentTarget.style.background = '#f0e0c0')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Post Review</span>
                                    <Send size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
