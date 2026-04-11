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
                comment: comment.trim()
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-indigo-500/10 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Share Your Experience</h3>
                    <p className="text-blue-100 text-sm font-medium mt-1">Reviewing: {serviceName}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="flex flex-col items-center mb-10">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Tap to Rate</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-1 transition-transform transform hover:scale-125 focus:outline-none"
                                >
                                    <Star
                                        size={48}
                                        className={`transition-colors duration-300 ${
                                            (hover || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-200'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="mt-4 text-yellow-600 font-black text-sm uppercase tracking-tighter">
                                {['Terrible', 'Bad', 'Okay', 'Good', 'Exceptional'][rating - 1]}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Detailed Feedback</label>
                        <textarea
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-gray-700 focus:outline-none focus:border-blue-500 min-h-[140px] transition-colors text-lg font-medium"
                            placeholder="What did you love about the service? How was the provider?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={500}
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{comment.length}/500</span>
                            {comment.length < 10 && comment.length > 0 && (
                                <span className="text-[10px] text-red-400 font-bold uppercase">Min 10 chars</span>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-tight hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-tight hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Post Review</span>
                                    <Send size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
