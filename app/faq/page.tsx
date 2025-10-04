'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const faqData = {
  general: [
    {
      question: 'What makes Newhill Spices different from other spice brands?',
      answer: 'We source directly from our own farms in Kerala hills, ensuring freshness and quality. Our spices are hand-picked, organically grown, and processed without any artificial additives. We eliminate middlemen to provide you with the best prices and freshest products.',
    },
    {
      question: 'Are your spices organic and certified?',
      answer: 'Yes, all our spices are organically grown and certified. We follow strict organic farming practices and our products are certified by recognized organic certification bodies in India.',
    },
    {
      question: 'How do you ensure the freshness of spices?',
      answer: 'We harvest spices at peak maturity and process them immediately. Our spices are packed in airtight containers and shipped directly from our processing facility to maintain maximum freshness and aroma.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to India and Gulf countries (Qatar, UAE, Saudi Arabia, Oman). We use reliable shipping partners to ensure your spices reach you in perfect condition.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unopened products. If you\'re not satisfied with your purchase, you can return it for a full refund. For quality issues, we also accept returns of opened products.',
    },
  ],
  orders: [
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can track your order on our website or directly on the courier\'s website.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. For Gulf countries, we support local payment methods like Dibsy (Qatar), Telr (UAE), Moyasar (Saudi), and OmanNet (Oman).',
    },
    {
      question: 'How long does shipping take?',
      answer: 'For India: 2-5 business days. For Gulf countries: 5-7 business days. Express shipping options are available for faster delivery.',
    },
    {
      question: 'Do you offer Cash on Delivery (COD)?',
      answer: 'Yes, COD is available for orders within India. A small COD fee may apply depending on the order value and location.',
    },
    {
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. Please contact our support team immediately if you need to make changes.',
    },
  ],
  products: [
    {
      question: 'How should I store the spices?',
      answer: 'Store spices in a cool, dry place away from direct sunlight. Keep them in airtight containers to maintain freshness and aroma. Whole spices last longer than ground spices.',
    },
    {
      question: 'What is the shelf life of your spices?',
      answer: 'Whole spices: 2-3 years, Ground spices: 1-2 years. Each product has a "best before" date printed on the package. Our spices are packed fresh and have maximum shelf life.',
    },
    {
      question: 'Do you provide information about the origin of spices?',
      answer: 'Yes, each product comes with detailed information about its origin, harvest date, and lot number. You can trace your spices back to the specific farm and batch.',
    },
    {
      question: 'Are your spices tested for quality and purity?',
      answer: 'Absolutely. All our spices undergo rigorous quality testing for purity, moisture content, and contamination. We provide certificates of analysis upon request.',
    },
    {
      question: 'Do you offer sample packs?',
      answer: 'Yes, we offer sample packs for bulk buyers and first-time customers. This allows you to test the quality before making a larger purchase.',
    },
  ],
  b2b: [
    {
      question: 'How do I apply for a B2B account?',
      answer: 'You can apply for a B2B account by filling out our wholesale application form. You\'ll need to provide your business details, GST number, and trade references. Approval typically takes 2-3 business days.',
    },
    {
      question: 'What are the minimum order quantities for wholesale?',
      answer: 'Minimum order quantities vary by product. Generally, it\'s 10kg for most spices. Bulk discounts are available for larger quantities.',
    },
    {
      question: 'Do you offer custom packaging for B2B orders?',
      answer: 'Yes, we offer custom packaging solutions for bulk orders. This includes private labeling, custom packaging sizes, and branded packaging options.',
    },
    {
      question: 'What payment terms do you offer for B2B customers?',
      answer: 'We offer flexible payment terms for approved B2B customers, including net 30 payment terms for established accounts. New accounts typically require advance payment.',
    },
    {
      question: 'Do you provide certificates for export?',
      answer: 'Yes, we provide all necessary export certificates including phytosanitary certificates, certificates of origin, and quality certificates required for international trade.',
    },
  ],
};

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('general');

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filterFAQs = (faqs: typeof faqData.general) => {
    if (!searchTerm) return faqs;
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-emerald-100 mb-8">
            Find answers to common questions about our products and services
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="b2b">B2B</TabsTrigger>
          </TabsList>

          {Object.entries(faqData).map(([category, faqs]) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {filterFAQs(faqs).map((faq, index) => {
                  const itemId = `${category}-${index}`;
                  const isExpanded = expandedItems.includes(itemId);
                  
                  return (
                    <Card key={itemId} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleExpanded(itemId)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                
                {filterFAQs(faqs).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No FAQs found matching your search.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Contact Support
                  </Button>
                </Link>
                <Button variant="outline">
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}