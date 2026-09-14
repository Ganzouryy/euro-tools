export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Help Center</h1>
        <p className="text-lg text-slate-600 mb-12 text-center">
          Find answers to common questions about renting tools with Euro-Tools
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">How do I rent a tool?</h2>
            <p className="text-slate-600">
              1. Create an account and complete KYC verification<br />
              2. Browse our catalog and add tools to cart<br />
              3. Select rental dates and delivery location<br />
              4. Complete payment (rental fee + insurance deposit)<br />
              5. We deliver to your location in Egypt
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">What is KYC verification?</h2>
            <p className="text-slate-600">
              KYC (Know Your Customer) is a security measure to verify your identity. You'll need to upload
              one of: Passport, Egyptian Visa, or European Company ID. Verification usually takes 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">How does the insurance deposit work?</h2>
            <p className="text-slate-600">
              We hold a refundable deposit (20-40% of rental price) to protect against damage or loss.
              When you return the tool in good condition, our representative inspects it and processes
              your full refund within 24-48 hours.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Where do you deliver?</h2>
            <p className="text-slate-600">
              We deliver to hotels, manufacturing plants, and any location across Egypt. Same-day delivery
              is available in Cairo metro area. Other cities may take 1-2 days depending on location.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">What if I need a tool not in your catalog?</h2>
            <p className="text-slate-600">
              Submit a custom tool request! Tell us what you need, and we'll source it from trusted
              suppliers within 24-48 hours. You'll receive a custom quote before we proceed.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">What payment methods do you accept?</h2>
            <p className="text-slate-600">
              We accept international credit cards (Visa, Mastercard) and Egyptian local payment methods
              (Vodafone Cash, bank cards). All prices are in USD.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Can I extend my rental period?</h2>
            <p className="text-slate-600">
              Yes! Contact us via WhatsApp or email before your rental end date. We'll check availability
              and process the extension with adjusted pricing.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">What happens if a tool is damaged?</h2>
            <p className="text-slate-600">
              Minor wear and tear is expected and won't affect your deposit. For repairable damage,
              repair costs are deducted from your deposit. For total loss or theft, full replacement
              cost applies.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">How do I return a tool?</h2>
            <p className="text-slate-600">
              Our representative will collect the tool from your location at the agreed return date.
              They'll inspect the condition and confirm the return. Your deposit refund is processed
              automatically within 24-48 hours.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Still Have Questions?</h2>
          <p className="text-slate-600 mb-6">
            Our support team is here to help you with any questions or concerns.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
