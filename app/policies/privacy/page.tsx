import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Newhill Spices',
  description: 'Learn how Newhill Spices collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <p>
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us. This may include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with our support team</li>
                </ul>

                <h3 className="font-semibold text-lg mt-6">Automatically Collected Information</h3>
                <p>
                  When you visit our website, we automatically collect certain information about your device, 
                  including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and browser type</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website and search terms</li>
                  <li>Device information and operating system</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Provide customer support</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                3. Information Sharing
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted partners who help us operate our business (payment processors, shipping companies, etc.)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                4. Data Security
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing</li>
                  <li>Regular security audits</li>
                  <li>Access controls and authentication</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                5. Your Rights
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                  <li>Lodge a complaint with supervisory authorities</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at privacy@newhillspices.com
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                6. Cookies and Tracking
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                7. International Transfers
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                8. Children's Privacy
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                9. Changes to This Policy
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                10. Contact Us
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>If you have any questions about this privacy policy, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> privacy@newhillspices.com</p>
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