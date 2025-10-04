'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about#story' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ],
  products: [
    { name: 'All Spices', href: '/products' },
    { name: 'Organic Collection', href: '/products?category=organic' },
    { name: 'Gift Packs', href: '/products?category=gift-packs' },
    { name: 'Bulk Orders', href: '/b2b' },
    { name: 'New Arrivals', href: '/products?sort=newest' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Track Order', href: '/orders' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/policies/privacy' },
    { name: 'Terms of Service', href: '/policies/terms' },
    { name: 'Cookie Policy', href: '/policies/cookies' },
    { name: 'Refund Policy', href: '/policies/refunds' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/newhillspices', icon: '📘' },
  { name: 'Instagram', href: 'https://instagram.com/newhillspices', icon: '📷' },
  { name: 'Twitter', href: 'https://twitter.com/newhillspices', icon: '🐦' },
  { name: 'YouTube', href: 'https://youtube.com/newhillspices', icon: '📺' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/newhillspices', icon: '💼' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        toast({
          title: 'Successfully subscribed!',
          description: 'Thank you for subscribing to our newsletter.',
        });
        setEmail('');
      } else {
        const data = await response.json();
        toast({
          title: 'Subscription failed',
          description: data.error || 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Subscription failed',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Stay Connected with Newhill Spices
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get the latest updates on new arrivals, exclusive offers, and spice recipes 
            delivered straight to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
            <Button 
              type="submit" 
              disabled={isSubscribing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>

        <Separator className="mb-12 bg-gray-700" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">NH</span>
              </div>
              <span className="font-serif text-xl font-bold">Newhill Spices</span>
            </Link>
            <p className="text-gray-300 text-sm mb-4">
              Premium spices from Kerala's hills, bringing authentic flavors to your kitchen 
              since 1985.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 Munnar Hills, Kerala 685612, India</p>
              <p>📞 +91-9876543210</p>
              <p>✉️ hello@newhillspices.com</p>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8 bg-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-300 mb-4 md:mb-0">
            © {new Date().getFullYear()} Newhill Spices. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title={social.name}
              >
                <span className="text-xl">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Certifications & Trust Badges */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>🌿</span>
              <span>Organic Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔒</span>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🚚</span>
              <span>Free Shipping Over ₹1000</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>↩️</span>
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⭐</span>
              <span>4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}