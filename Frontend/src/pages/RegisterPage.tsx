
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCredentials } from '../store/slices/authSlice';
import authService, { RegisterPayload } from '../services/authService';
import { APP_ROUTES } from '../constants/routes';
import { ERROR_MESSAGES } from '../constants/messages';
import { registerSchema, RegisterFormData } from '../validations/authValidation';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            const response = await authService.register({ ...data, role: 'USER' } as RegisterPayload);

            // Save user data and token for immediate login
            if (response.token) {
                dispatch(setCredentials({
                    user: {
                        _id: response.id,
                        name: response.name,
                        email: response.email,
                        role: response.role,
                        isVerified: true,
                        isBlocked: false
                    },
                    accessToken: response.token
                }));
            }

            toast.success('Registration successful! Welcome to Occasia.');
            navigate(APP_ROUTES.HOME);
        } catch (error: any) {
            toast.error(error.response?.data?.message || ERROR_MESSAGES.REGISTRATION_FAILED);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: '#0d0d0d' }}>
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-15" style={{ background: '#e8d5b0' }} />
                <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-8" style={{ background: '#c9b99a' }} />
            </div>

            <div className="max-w-md w-full space-y-8 backdrop-blur-lg rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10" style={{ background: 'rgba(26,26,26,0.85)', border: '1px solid rgba(232, 213, 176, 0.12)' }}>
                <div className="text-center">
                    <div className="text-2xl font-black tracking-widest mb-2" style={{ color: '#e8d5b0' }}>OCCASIA</div>
                    <h2 className="text-2xl font-bold" style={{ color: '#f5ede0' }}>
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: '#888' }}>
                        Join Occasia today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: '#999' }}>
                                Full Name
                            </label>
                            <input
                                {...register('name')}
                                id="name"
                                type="text"
                                autoComplete="name"
                                className="appearance-none block w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5ede0' }}
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#999' }}>
                                Email address
                            </label>
                            <input
                                {...register('email')}
                                id="email"
                                type="email"
                                autoComplete="email"
                                className="appearance-none block w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5ede0' }}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#999' }}>
                                Password
                            </label>
                            <input
                                {...register('password')}
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                className="appearance-none block w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5ede0' }}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: '#e8d5b0', color: '#111111' }}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" style={{ color: '#111' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm" style={{ color: '#666' }}>
                        Already have an account?{' '}
                        <Link to={APP_ROUTES.LOGIN} className="font-semibold transition-colors" style={{ color: '#e8d5b0' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
