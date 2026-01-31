import eventHero from '../assets/event-hero.png';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { APP_ROUTES } from '../constants/routes';
import authService from '../services/authService';
import { loginSchema, LoginFormData } from '../validations/authValidation';

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await authService.adminLogin(data);

            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);

            toast.success(`Welcome, Admin ${response.data.name}`);
            navigate(APP_ROUTES.ADMIN_DASHBOARD);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-900 overflow-hidden">
            {/* Image Section - Dark Authority */}
            <div className="hidden lg:block relative overflow-hidden group">
                <img
                    src={eventHero}
                    alt="Control Center"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 scale-110 group-hover:scale-100 transition-transform duration-[5000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/40 to-transparent" />

                <div className="absolute top-12 left-12 space-y-2 animate-in fade-in slide-in-from-left duration-1000">
                    <div className="flex items-center space-x-3 text-white italic">
                        <div className="w-12 h-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                            <span className="font-serif text-2xl font-bold">O</span>
                        </div>
                        <span className="text-4xl font-serif tracking-[.4em] font-light">OCCASIA</span>
                    </div>
                </div>

                <div className="absolute bottom-12 left-12 right-12 p-10 bg-black/60 backdrop-blur-2xl rounded-[3rem] border border-white/5 space-y-4">
                    <div className="inline-block px-4 py-1.5 bg-indigo-500 rounded-full text-[8px] font-black uppercase tracking-[0.3em] text-white mb-2">Authority Portal</div>
                    <h3 className="text-3xl font-bold text-white tracking-tight">Executive Management Oversight</h3>
                    <p className="text-white/40 text-sm leading-relaxed max-w-sm font-medium">Secure access to Occasia's core operational systems. Authorized personnel only. Your access is heavily audited.</p>
                </div>
            </div>

            {/* Content Section - High Contrast Professional */}
            <div className="relative flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-20 bg-slate-950">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />

                <div className="max-w-md w-full mx-auto space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[.4em]">Secure Login</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">Admin Console</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">Enter your administrative credentials to manage the platform ecosystem.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <div className="group space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-indigo-400 transition-colors">Encrypted Email</label>
                                <input
                                    {...register('email')}
                                    className="w-full bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 text-sm font-medium text-white placeholder:text-slate-700 focus:bg-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                                    placeholder="admin@occasia.com"
                                />
                                {errors.email && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-2">{errors.email.message}</p>}
                            </div>

                            <div className="group space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-indigo-400 transition-colors">System Password</label>
                                    <button type="button" className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider hover:text-indigo-300 transition-colors opacity-50">Support</button>
                                </div>
                                <input
                                    {...register('password')}
                                    type="password"
                                    className="w-full bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 text-sm font-medium text-white placeholder:text-slate-700 focus:bg-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-2">{errors.password.message}</p>}
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-white text-slate-950 p-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-indigo-600/10 disabled:opacity-50"
                        >
                            {loading ? 'Decrypting Access...' : 'Authenticate Admin Access'}
                        </button>

                        <div className="space-y-4 pt-8 border-t border-slate-800/50 text-center">
                            <button
                                type="button"
                                onClick={() => navigate(APP_ROUTES.LOGIN)}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-400 transition-colors block w-full"
                            >
                                Return to User Terminal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
