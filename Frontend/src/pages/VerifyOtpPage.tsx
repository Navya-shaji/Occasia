import eventHero from '../assets/event-hero.png';
import { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
            navigate('/');
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
        <div className="min-h-screen flex bg-white">
            {/* Content Section - Clean Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 bg-white">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <div>
                        <button
                            onClick={() => navigate(APP_ROUTES.REGISTER)}
                            className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Register
                        </button>
                        <h2 className="text-3xl font-bold text-gray-900">Verify your email</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We've sent a 6-digit verification code to <span className="font-semibold text-gray-900">{userEmail}</span>.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onVerifyOtp)}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    {...register('otp')}
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    className="appearance-none block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest font-mono"
                                    placeholder="000000"
                                    autoFocus
                                />
                                {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    disabled={resending}
                                    className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
                                >
                                    {resending ? 'Sending...' : 'Resend'}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Section - Simplified */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600">
                <img
                    src={eventHero}
                    alt="Verify Cover"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
                />
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <h2 className="text-4xl font-bold mb-6">Security Check</h2>
                    <p className="text-lg text-blue-100 max-w-md">
                        Protecting your account is our top priority. Please verify your identity to continue.
                    </p>
                </div>
            </div>
        </div>
    );
}
