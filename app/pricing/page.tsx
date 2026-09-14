export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Pricing & Rental Terms</h1>
        <p className="text-lg text-slate-600 mb-12 text-center max-w-2xl mx-auto">
          Transparent pricing with no hidden fees. Pay only for what you need.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Daily Rate</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">$15-50</div>
            <p className="text-slate-600 mb-4">Per tool per day</p>
            <ul className="text-sm text-slate-600 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>Best for short-term projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>Flexible return schedule</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 text-center transform scale-105">
            <div className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-2">Weekly Rate</h3>
            <div className="text-4xl font-bold mb-4">15% OFF</div>
            <p className="text-blue-100 mb-4">7+ days rental</p>
            <ul className="text-sm text-blue-50 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-white">✓</span>
                <span>Significant savings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white">✓</span>
                <span>Ideal for plant maintenance</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Monthly Rate</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">25% OFF</div>
            <p className="text-slate-600 mb-4">30+ days rental</p>
            <ul className="text-sm text-slate-600 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>Maximum value</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>Extended project support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Insurance Deposit</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">How It Works</h3>
              <p className="text-slate-600 mb-4">
                We require a refundable insurance deposit (20-40% of rental price) to protect against
                damage or loss. This deposit is fully refunded when you return the tool in good condition.
              </p>
              <p className="text-slate-600">
                Our representative inspects the tool upon return and processes your refund within 24-48 hours.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Deposit Protection</h3>
              <ul className="text-sm text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>100% refundable on clean return</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Fast processing (24-48h)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Photo-verified condition check</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Transparent dispute resolution</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Additional Fees</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Delivery</h3>
              <p className="text-slate-600 text-sm">
                <strong>Cairo Metro:</strong> Free same-day delivery<br />
                <strong>Other Cities:</strong> $10-30 depending on location
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Late Returns</h3>
              <p className="text-slate-600 text-sm">
                <strong>Grace Period:</strong> 2 hours free<br />
                <strong>Late Fee:</strong> 50% of daily rate per extra day
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
