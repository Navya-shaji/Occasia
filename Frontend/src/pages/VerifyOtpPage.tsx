import eventHero from '../assets/event-hero.png';
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { APP_ROUTES } from '../constants/routes';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages';
import { otpSchema, OtpFormData } from '../validations/authValidation';

export default function VerifyOtpPage() {
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = location.state?.email;

    useEffect(() => {
        if (!userEmail) {
            navigate(APP_ROUTES.REGISTER);
        }
    }, [userEmail, navigate]);

    const { register, handleSubmit, formState: { errors } } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema)
    });

    const onVerifyOtp = async (data: OtpFormData) => {
        setLoading(true);
        try {
            const response = await authService.verifyOtp({ email: userEmail, otp: data.otp });

            // Auto login after verification
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);

            toast.success(SUCCESS_MESSAGES.VERIFICATION_SUCCESS);
            navigate(APP_ROUTES.DASHBOARD);
        } catch (error: any) {
            toast.error(error.response?.data?.message || ERROR_MESSAGES.INVALID_OTP);
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setResending(true);
        try {
            await authService.resendOtp({ email: userEmail });
            toast.success(SUCCESS_MESSAGES.OTP_RESENT);
        } catch (error: any) {
            toast.error(error.response?.data?.message || ERROR_MESSAGES.DEFAULT_ERROR);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="poise-grid">
            {/* Image Section */}
            <div
                className="poise-image-section"
                style={{ backgroundImage: `url(${eventHero})` }}
            >
                <div className="poise-brand-overlay fade-in">
                    <div className="poise-brand-text">OCCASIA</div>
                    <div className="text-[10px] uppercase tracking-[0.8em] mt-2 opacity-80 text-white pl-1">
                        Premium Event Management
                    </div>
                </div>
                <div className="poise-image-overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            </div>

            {/* Content Section */}
            <div className="poise-content-section">
                <div className="poise-form-container fade-in">
                    <h1 className="poise-title font-serif">Security</h1>
                    <p className="poise-subtitle">
                        For your security, we've sent a 6-digit confirmation code to: <br />
                        <span className="font-semibold text-black">{userEmail}</span>
                    </p>

                    <form onSubmit={handleSubmit(onVerifyOtp)}>
                        <div className="poise-input-group">
                            <label className="poise-label">Verification Code</label>
                            <input
                                {...register('otp')}
                                className="poise-input text-center text-4xl font-serif tracking-[0.4em]"
                                placeholder="000000"
                                maxLength={6}
                                autoFocus
                            />
                            {errors.otp && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.otp.message}</p>}
                        </div>

                        <button disabled={loading} type="submit" className="poise-btn">
                            {loading ? 'Verifying...' : 'Verify Account'}
                        </button>

                        <div className="poise-footer-link">
                            <button
                                type="button"
                                onClick={resendOtp}
                                disabled={resending}
                                className="poise-link"
                            >
                                {resending ? 'Sending...' : "Didn't receive a code? Resend"}
                            </button>
                        </div>

                        <div className="poise-footer-link mt-2">
                            <button
                                type="button"
                                onClick={() => navigate(APP_ROUTES.REGISTER)}
                                className="poise-link opacity-50"
                            >
                                Use a different email
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
