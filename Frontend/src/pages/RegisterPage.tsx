
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
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-pink-500/20 blur-[100px]" />
            </div>

            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-10 shadow-2xl border border-white/10 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Join Occasia today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    {...register('name')}
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm hover:bg-white/10"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    {...register('email')}
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm hover:bg-white/10"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    {...register('password')}
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm hover:bg-white/10"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
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
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to={APP_ROUTES.LOGIN} className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
