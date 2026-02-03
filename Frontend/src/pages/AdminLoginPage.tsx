import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { APP_ROUTES } from '../constants/routes';
import authService from '../services/authService';
import { loginSchema, LoginFormData } from '../validations/authValidation';
import { Shield, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await authService.adminLogin(data);

            // Store credentials in Redux and LocalStorage (handled by slice)
            dispatch(setCredentials({
                user: response.data,
                accessToken: response.data.token
            }));

            toast.success(`Welcome back, ${response.data.name}`);
            navigate(APP_ROUTES.ADMIN_DASHBOARD);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Admin login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Dark Professional Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-900/10 blur-[120px]" />
            </div>

            <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-2xl border border-white/10 relative z-10">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4 text-white">
                        <Shield size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Admin Console
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                        Authorized Access Only
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                                Administrator Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    {...register('email')}
                                    id="email"
                                    type="email"
                                    className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="admin@occasia.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                                Secret Key
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    {...register('password')}
                                    id="password"
                                    type="password"
                                    className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-50 transform transition-all active:scale-[0.98]"
                    >
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>

                    <div className="text-center">
                        <Link
                            to={APP_ROUTES.LOGIN}
                            className="text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            Return to User Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
