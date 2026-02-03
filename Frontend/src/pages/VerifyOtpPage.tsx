
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
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-pink-500/20 blur-[100px]" />
            </div>

            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-10 shadow-2xl border border-white/10 relative z-10">
                <div className="text-center">
                    <button
                        onClick={() => navigate(APP_ROUTES.REGISTER)}
                        className="flex items-center text-xs text-gray-400 hover:text-white mb-6 mx-auto transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Register
                    </button>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Verify Email
                    </h2>
                    <p className="mt-2 text-sm text-gray-300">
                        We've sent a code to <span className="font-semibold text-white">{userEmail}</span>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onVerifyOtp)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2 text-center">
                                Enter Verification Code
                            </label>
                            <input
                                {...register('otp')}
                                id="otp"
                                type="text"
                                maxLength={6}
                                autoComplete="one-time-code"
                                className="appearance-none block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-3xl tracking-[1em] font-mono transition-all duration-200 hover:bg-white/10"
                                placeholder="000000"
                                autoFocus
                            />
                            {errors.otp && <p className="mt-2 text-sm text-red-400 text-center">{errors.otp.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : 'Verify Email'}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={resendOtp}
                                disabled={resending}
                                className="font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
                            >
                                {resending ? 'Sending...' : 'Resend'}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
