import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
    const categories = [
        { name: 'Venues', icon: '🏛️', count: '50+' },
        { name: 'Catering', icon: '🍽️', count: '30+' },
        { name: 'Photography', icon: '📸', count: '40+' },
        { name: 'Decoration', icon: '🎨', count: '25+' },
        { name: 'Entertainment', icon: '🎵', count: '35+' },
        { name: 'Transportation', icon: '🚗', count: '20+' },
    ];

    const features = [
        {
            icon: <Calendar size={28} />,
            title: 'Easy Booking',
            desc: 'Book services instantly with our simple booking system',
        },
        {
            icon: <Star size={28} />,
            title: 'Verified Services',
            desc: 'All service providers are verified and trusted',
        },
        {
            icon: <Users size={28} />,
            title: 'Expert Support',
            desc: 'Get help from our team throughout your journey',
        },
    ];

    return (
        <div className="min-h-screen" style={{ background: '#111111' }}>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
                {/* Background blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20"
                        style={{ background: 'radial-gradient(circle, #e8d5b0 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10"
                        style={{ background: 'radial-gradient(circle, #c9b99a 0%, transparent 70%)' }}
                    />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center pt-24">
                    {/* Badge */}
                    <div
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
                        style={{
                            background: 'rgba(232, 213, 176, 0.1)',
                            border: '1px solid rgba(232, 213, 176, 0.2)',
                            color: '#e8d5b0',
                        }}
                    >
                        <Sparkles size={14} />
                        <span>Event exploration made simple</span>
                    </div>

                    <h1
                        className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                        style={{ color: '#f5ede0', letterSpacing: '-0.03em' }}
                    >
                        Plan Your
                        <br />
                        <span style={{ color: '#e8d5b0' }}>Perfect Event</span>
                    </h1>

                    <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#a89070' }}>
                        Discover, book, and track events seamlessly with calendar integration and personalized event curation
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/services"
                            className="inline-flex items-center px-8 py-4 rounded-full font-bold text-base transition-all group"
                            style={{ background: '#e8d5b0', color: '#111111' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f0e0c0')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                        >
                            Browse Services
                            <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-4 rounded-full font-bold text-base transition-all"
                            style={{
                                background: 'rgba(232, 213, 176, 0.08)',
                                border: '1px solid rgba(232, 213, 176, 0.2)',
                                color: '#e8d5b0',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(232, 213, 176, 0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(232, 213, 176, 0.08)';
                            }}
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                        {[
                            { value: '200+', label: 'Services' },
                            { value: '5K+', label: 'Happy Clients' },
                            { value: '4.9', label: 'Avg Rating' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-black mb-1" style={{ color: '#e8d5b0' }}>{stat.value}</div>
                                <div className="text-sm" style={{ color: '#666' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6" style={{ background: '#0d0d0d' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#f5ede0' }}>
                            Why Choose Occasia
                        </h2>
                        <p className="text-base" style={{ color: '#666' }}>Everything you need to plan the perfect event</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="p-8 rounded-2xl transition-all duration-300"
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(232, 213, 176, 0.2)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
                                }}
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                    style={{ background: 'rgba(232, 213, 176, 0.1)', color: '#e8d5b0' }}
                                >
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: '#f5ede0' }}>{f.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 px-6" style={{ background: '#111111' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#f5ede0' }}>
                            Browse by Category
                        </h2>
                        <p className="text-base" style={{ color: '#666' }}>Find exactly what you need for your event</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/services?category=${category.name}`}
                                className="group p-6 rounded-2xl transition-all duration-300 flex items-center space-x-4"
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(232, 213, 176, 0.25)';
                                    (e.currentTarget as HTMLAnchorElement).style.background = '#222';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
                                    (e.currentTarget as HTMLAnchorElement).style.background = '#1a1a1a';
                                }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                    style={{ background: 'rgba(232, 213, 176, 0.08)' }}
                                >
                                    {category.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base" style={{ color: '#f5ede0' }}>{category.name}</h3>
                                    <p className="text-xs mt-0.5" style={{ color: '#666' }}>{category.count} services</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6" style={{ background: '#0d0d0d' }}>
                <div className="max-w-3xl mx-auto text-center">
                    <div
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
                        style={{
                            background: 'rgba(232, 213, 176, 0.1)',
                            border: '1px solid rgba(232, 213, 176, 0.2)',
                            color: '#e8d5b0',
                        }}
                    >
                        <Sparkles size={14} />
                        <span>Join thousands of happy customers</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: '#f5ede0', letterSpacing: '-0.02em' }}>
                        Ready to Plan Your Event?
                    </h2>
                    <p className="text-lg mb-10" style={{ color: '#888' }}>
                        Trusted by thousands who made their special moments unforgettable
                    </p>
                    <Link
                        to="/services"
                        className="inline-flex items-center px-10 py-4 rounded-full font-bold text-base transition-all group"
                        style={{ background: '#e8d5b0', color: '#111111' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f0e0c0')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                    >
                        Get Started Now
                        <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
