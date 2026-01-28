import eventHero from '../assets/event-hero.png';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
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
        <div className="poise-grid">
            {/* Image Section */}
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

            {/* Content Section */}
            <div className="poise-content-section">
                <div className="poise-form-container fade-in">
                    <h1 className="poise-title font-serif">Host or Attend</h1>
                    <p className="poise-subtitle">
                        From grand galas to intimate gatherings.
                        Occasia provides the tools to manage, discover, and experience extraordinary events.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="poise-input-group">
                            <label className="poise-label">Full Name</label>
                            <input {...register('name')} className="poise-input" placeholder="e.g. Julian Montgomery" />
                            {errors.name && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.name.message}</p>}
                        </div>

                        <div className="poise-input-group">
                            <label className="poise-label">Email Address</label>
                            <input {...register('email')} className="poise-input" placeholder="julian@ocasia-events.com" />
                            {errors.email && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.email.message}</p>}
                        </div>

                        <div className="poise-input-group">
                            <label className="poise-label">Password</label>
                            <input {...register('password')} type="password" className="poise-input" placeholder="••••••••" />
                            {errors.password && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.password.message}</p>}
                        </div>

                        <button disabled={loading} type="submit" className="poise-btn">
                            {loading ? 'Setting up stage...' : 'Register for Occasia'}
                        </button>

                        <div className="poise-footer-link">
                            <button
                                type="button"
                                onClick={() => navigate(APP_ROUTES.LOGIN)}
                                className="poise-link"
                            >
                                Already joined? Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
