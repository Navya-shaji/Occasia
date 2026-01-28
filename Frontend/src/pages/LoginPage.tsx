import eventHero from '../assets/event-hero.png';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
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
            navigate(APP_ROUTES.DASHBOARD);
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
                        Premium Event Management
                    </div>
                </div>
                <div className="poise-image-overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
            </div>

            <div className="poise-content-section">
                <div className="poise-form-container fade-in">
                    <h1 className="poise-title font-serif">Welcome Back</h1>
                    <p className="poise-subtitle">
                        Sign in to continue your curated event management journey.
                        Your aesthetic, perfectly preserved.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="poise-input-group">
                            <label className="poise-label">Email Address</label>
                            <input {...register('email')} className="poise-input" placeholder="mikayla@poise.com" />
                            {errors.email && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.email.message}</p>}
                        </div>

                        <div className="poise-input-group">
                            <label className="poise-label">Password</label>
                            <input {...register('password')} type="password" className="poise-input" placeholder="••••••••" />
                            {errors.password && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.password.message}</p>}
                        </div>

                        <div className="flex justify-end mb-6">
                            <button type="button" className="poise-link">
                                Forgot Password?
                            </button>
                        </div>

                        <button disabled={loading} type="submit" className="poise-btn">
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        <div className="poise-footer-link">
                            <button
                                type="button"
                                onClick={() => navigate(APP_ROUTES.REGISTER)}
                                className="poise-link"
                            >
                                Not a member? Join OCCASIA
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
