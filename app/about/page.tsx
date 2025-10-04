import { Metadata } from 'next';
import Image from 'next/image';
import { Award, Leaf, Users, MapPin, Clock, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Newhill Spices | Our Story & Heritage',
  description: 'Learn about Newhill Spices journey from Kerala hills to your kitchen. Discover our commitment to quality, sustainability, and authentic spice farming.',
};

const milestones = [
  {
    year: '1985',
    title: 'Founded in Munnar',
    description: 'Started as a small family farm in the hills of Munnar, Kerala',
    icon: MapPin,
  },
  {
    year: '1995',
    title: 'Organic Certification',
    description: 'Became one of the first certified organic spice farms in Kerala',
    icon: Leaf,
  },
  {
    year: '2005',
    title: 'Direct Trade',
    description: 'Eliminated middlemen to ensure fair prices for farmers and customers',
    icon: Users,
  },
  {
    year: '2020',
    title: 'Global Expansion',
    description: 'Extended our reach to Gulf countries with premium spice exports',
    icon: Award,
  },
];

const values = [
  {
    title: 'Quality First',
    description: 'Every spice is hand-picked and quality tested for aroma, flavor, and purity',
    icon: Award,
  },
  {
    title: 'Sustainable Farming',
    description: 'We practice organic farming methods that protect the environment',
    icon: Leaf,
  },
  {
    title: 'Fair Trade',
    description: 'Direct relationships with farmers ensure fair compensation',
    icon: Heart,
  },
  {
    title: 'Fresh Delivery',
    description: 'From harvest to your doorstep in the shortest possible time',
    icon: Clock,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Story Begins in the
                <span className="text-emerald-600 block">Hills of Kerala</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                For over three decades, Newhill Spices has been cultivating the finest spices 
                in the pristine hills of Munnar. What started as a small family farm has grown 
                into a trusted source of premium spices for kitchens around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Shop Our Spices
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Visit Our Farm
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4198943/pexels-photo-4198943.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Kerala spice farm"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey Through Time
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to becoming a trusted name in premium spices
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-emerald-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div key={milestone.year} className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}>
                    <div className={`w-full max-w-md ${
                      index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'
                    }`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            {index % 2 === 0 ? (
                              <>
                                <div>
                                  <h3 className="text-xl font-semibold">{milestone.title}</h3>
                                  <p className="text-emerald-600 font-bold">{milestone.year}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <Icon className="w-6 h-6 text-emerald-600" />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <Icon className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-semibold">{milestone.title}</h3>
                                  <p className="text-emerald-600 font-bold">{milestone.year}</p>
                                </div>
                              </>
                            )}
                          </div>
                          <p className="text-gray-600">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-600 rounded-full border-4 border-white"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Newhill Spices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <img
                  src="https://i.ibb.co/yBNG9nsM/Untitled-design.jpg"
                  alt="Founder"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">PJ Chacko</h3>
                <p className="text-emerald-600 mb-3">Founder and Visionary</p>
                <p className="text-gray-600">
                  Third-generation spice farmer with over 30 years of experience in organic cultivation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <img
                  src="https://i.ibb.co/VW227WJs/Untitled-design-1.jpg"
                  alt="Quality Manager"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Ebin Jacob</h3>
                <p className="text-emerald-600 mb-3">Founder and Propretior</p>
                <p className="text-gray-600">
                  Pioneer to the development and expansion of Newhill Spices
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <img
                  src="https://i.ibb.co/vxKMs4rC/Screenshot-2024-04-22-174219.png"
                  alt="Export Manager"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Aron Eby</h3>
                <p className="text-emerald-600 mb-3">Tech Lead</p>
                <p className="text-gray-600">
                  Oversees the tech aspect of the company
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Experience the Newhill Difference
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their spice needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
            <Link href="/b2b">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                Wholesale Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}