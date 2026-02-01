import eventHero from '../assets/event-hero.png';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { APP_ROUTES } from '../constants/routes';
import authService from '../services/authService';
import { loginSchema, LoginFormData } from '../validations/authValidation';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await authService.login(data);

            // Store simple auth state
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);

            toast.success(`Welcome back, ${response.data.name}`);
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Image Section - Simplified */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600">
                <img
                    src={eventHero}
                    alt="Login Cover"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
                />
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <h2 className="text-4xl font-bold mb-6">Welcome Back to Occasia</h2>
                    <p className="text-lg text-blue-100 max-w-md">
                        Log in to manage your events, view your bookings, and explore premium services.
                    </p>
                </div>
            </div>

            {/* Content Section - Clean Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 bg-white">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or <Link to={APP_ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-500">create a new account</Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        {...register('email')}
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <input
                                        {...register('password')}
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to={APP_ROUTES.ADMIN_LOGIN}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Admin Access
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
