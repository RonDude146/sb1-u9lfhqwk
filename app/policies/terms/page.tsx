import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Newhill Spices',
  description: 'Terms and conditions for using Newhill Spices website and services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  By accessing and using the Newhill Spices website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                2. Use License
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Permission is granted to temporarily download one copy of the materials on Newhill Spices' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                3. Account Registration
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  To access certain features of our service, you must register for an account. When you register, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                4. Product Information and Pricing
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We strive to provide accurate product information and pricing. However:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Product images are for illustration purposes and may vary from actual products</li>
                  <li>We reserve the right to correct pricing errors</li>
                  <li>Prices are subject to change without notice</li>
                  <li>All prices are inclusive of applicable taxes unless stated otherwise</li>
                  <li>Product availability is subject to stock levels</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                5. Orders and Payment
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  By placing an order, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate billing and shipping information</li>
                  <li>Pay all charges incurred by your account</li>
                  <li>Accept that order confirmation does not guarantee product availability</li>
                  <li>Understand that we may cancel orders for various reasons</li>
                </ul>
                <p>
                  Payment must be received before order processing. We accept major credit cards, debit cards, and other payment methods as displayed during checkout.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                6. Shipping and Delivery
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We ship to India and select Gulf countries. Shipping terms include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Risk of loss passes to you upon delivery to the carrier</li>
                  <li>Additional customs duties may apply for international orders</li>
                  <li>We are not responsible for delays caused by customs or force majeure</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                7. Returns and Refunds
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Our return policy allows returns within 30 days of delivery for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unopened products in original packaging</li>
                  <li>Products damaged during shipping</li>
                  <li>Products that don't match the description</li>
                </ul>
                <p>
                  Refunds will be processed to the original payment method within 5-7 business days after we receive the returned items.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                8. Prohibited Uses
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  You may not use our service:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                9. Disclaimer
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  The materials on Newhill Spices' website are provided on an 'as is' basis. Newhill Spices makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                10. Limitations
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  In no event shall Newhill Spices or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Newhill Spices' website, even if Newhill Spices or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                11. Governing Law
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in Kerala, India.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                12. Contact Information
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> legal@newhillspices.com</p>
                  <p><strong>Phone:</strong> +91-9876543210</p>
                  <p><strong>Address:</strong> Newhill Spices Estate, Munnar Hills, Kerala 685612, India</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}