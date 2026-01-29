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
        <div className="poise-grid">
            <div
                className="poise-image-section"
                style={{ backgroundImage: `url(${eventHero})` }}
            >
                <div className="poise-brand-overlay fade-in">
                    <div className="poise-brand-text">OCCASIA</div>
                    <div className="text-[10px] uppercase tracking-[0.8em] mt-2 opacity-80 text-white pl-1">
                        Admin Control Panel
                    </div>
                </div>
                <div className="poise-image-overlay" style={{ background: 'rgba(0,0,0,0.5)' }} />
            </div>

            <div className="poise-content-section">
                <div className="poise-form-container fade-in">
                    <h1 className="poise-title font-serif">Admin Access</h1>
                    <p className="poise-subtitle">
                        Secure administrative portal for event management oversight.
                        Authorized personnel only.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="poise-input-group">
                            <label className="poise-label">Admin Email</label>
                            <input {...register('email')} className="poise-input" placeholder="admin@occasia.com" />
                            {errors.email && <p className="poise-error">{errors.email.message}</p>}
                        </div>

                        <div className="poise-input-group">
                            <label className="poise-label">Admin Password</label>
                            <input {...register('password')} type="password" className="poise-input" placeholder="••••••••" />
                            {errors.password && <p className="poise-error">{errors.password.message}</p>}
                        </div>

                        <div className="flex justify-end mb-6">
                            <button type="button" className="poise-link">
                                Contact System Administrator
                            </button>
                        </div>

                        <button disabled={loading} type="submit" className="poise-btn">
                            {loading ? 'Authenticating...' : 'Admin Sign In'}
                        </button>

                        <div className="poise-footer-link">
                            <button
                                type="button"
                                onClick={() => navigate(APP_ROUTES.LOGIN)}
                                className="poise-link"
                            >
                                User Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
