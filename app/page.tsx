'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Award, Truck, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load the 3D component to avoid blocking initial page load
const Hero3D = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Spice particles animation placeholder */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full bg-emerald-600 opacity-20 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const featuredProducts = [
  {
    id: '1',
    name: 'Premium Cardamom',
    image: 'https://images.pexels.com/photos/4198943/pexels-photo-4198943.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'from ₹450',
    origin: 'Munnar Hills',
  },
  {
    id: '2',
    name: 'Black Pepper Whole',
    image: 'https://images.pexels.com/photos/4198935/pexels-photo-4198935.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'from ₹180',
    origin: 'Wayanad Estate',
  },
  {
    id: '3',
    name: 'Ceylon Cinnamon',
    image: 'https://images.pexels.com/photos/4198925/pexels-photo-4198925.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'from ₹120',
    origin: 'Kerala Gardens',
  },
  {
    id: '4',
    name: 'Organic Turmeric',
    image: 'https://images.pexels.com/photos/4198937/pexels-photo-4198937.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'from ₹90',
    origin: 'Certified Organic',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Dubai, UAE',
    rating: 5,
    text: 'The cardamom quality is exceptional! You can smell the freshness as soon as you open the package.',
  },
  {
    name: 'Rajesh Patel',
    location: 'Mumbai, India',
    rating: 5,
    text: 'Best spices for our restaurant. Our customers always compliment the authentic flavors.',
  },
  {
    name: 'Ahmad Al-Rashid',
    location: 'Doha, Qatar',
    rating: 5,
    text: 'Fast delivery to Gulf countries and amazing quality. Perfect for our traditional dishes.',
  },
];

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Hero3D />
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Pure Spices from
            <span className="text-emerald-600 block">Kerala Hills</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Farm-to-table freshness with authentic spices directly from Munnar estates. 
            No middlemen, just pure quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/gift-packs">
              <Button variant="outline" size="lg" className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg">
                Gift Packs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Farm Fresh</h3>
              <p className="text-gray-600">
                Directly sourced from our partner estates in Kerala's hill stations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Hand-picked and quality tested for aroma, flavor, and purity
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                Quick delivery across India and Gulf countries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our most popular spices, loved by home cooks and professional chefs alike
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.origin}</p>
                    <p className="text-lg font-bold text-emerald-600">{product.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From Farm to Your Table
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our simple 3-step process ensures you get the freshest spices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Harvest</h3>
              <p className="text-gray-600">
                We carefully harvest spices at peak maturity from our partner estates in Kerala's pristine hills
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Pack</h3>
              <p className="text-gray-600">
                Immediate processing and airtight packaging to lock in freshness, aroma, and natural oils
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Ship</h3>
              <p className="text-gray-600">
                Fast delivery to your doorstep, maintaining the cold chain for maximum freshness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <p className="font-semibold text-lg">{testimonials[currentTestimonial].name}</p>
                <p className="text-gray-600">{testimonials[currentTestimonial].location}</p>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* B2B CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16 text-white" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Wholesale & B2B Solutions
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Special pricing for restaurants, retailers, and bulk buyers. 
            Get quotes for large quantities with competitive rates.
          </p>
          <Link href="/b2b">
            <Button size="lg" variant="secondary" className="bg-white text-amber-700 hover:bg-gray-100">
              Explore B2B Solutions
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new arrivals, seasonal specials, and spice recipes
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500"
            />
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}