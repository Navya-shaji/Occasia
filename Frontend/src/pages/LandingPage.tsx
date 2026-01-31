import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

export default function LandingPage() {
    const categories = [
        { name: 'Venues', icon: '🏛️', count: '50+', color: 'bg-blue-50 text-blue-600' },
        { name: 'Catering', icon: '🍽️', count: '30+', color: 'bg-orange-50 text-orange-600' },
        { name: 'Photography', icon: '📸', count: '40+', color: 'bg-purple-50 text-purple-600' },
        { name: 'Decoration', icon: '🎨', count: '25+', color: 'bg-pink-50 text-pink-600' },
        { name: 'Entertainment', icon: '🎵', count: '35+', color: 'bg-green-50 text-green-600' },
        { name: 'Transportation', icon: '🚗', count: '20+', color: 'bg-indigo-50 text-indigo-600' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Plan Your Perfect Event
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Find and book the best venues, catering, photography, and more for your special occasions
                        </p>
                        <Link
                            to="/services"
                            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            Browse Services
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                            <p className="text-gray-600">Book services instantly with our simple booking system</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="text-purple-600" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Verified Services</h3>
                            <p className="text-gray-600">All service providers are verified and trusted</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                            <p className="text-gray-600">Get help from our team throughout your journey</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/services?category=${category.name}`}
                                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                            >
                                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                                <p className="text-gray-600">{category.count} services available</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Event?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of happy customers who trusted us with their special moments
                    </p>
                    <Link
                        to="/services"
                        className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                    >
                        Get Started Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
