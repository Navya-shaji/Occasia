import eventHero from '../assets/event-hero.png';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService, { RegisterPayload } from '../services/authService';
import { APP_ROUTES } from '../constants/routes';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages';
import { registerSchema, RegisterFormData } from '../validations/authValidation';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            await authService.register({ ...data, role: 'USER' } as RegisterPayload);
            toast.success(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
            navigate(APP_ROUTES.VERIFY_OTP, { state: { email: data.email } });
        } catch (error: any) {
            toast.error(error.response?.data?.message || ERROR_MESSAGES.REGISTRATION_FAILED);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Content Section - Clean Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 bg-white">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account? <Link to={APP_ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        {...register('name')}
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                            </div>

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
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        {...register('password')}
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
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
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Section - Simplified */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600">
                <img
                    src={eventHero}
                    alt="Register Cover"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
                />
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <h2 className="text-4xl font-bold mb-6">Join Occasia</h2>
                    <p className="text-lg text-blue-100 max-w-md">
                        Start your journey with the world's most premium event management platform.
                    </p>
                </div>
            </div>
        </div>
    );
}
