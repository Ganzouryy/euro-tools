export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Rental Agreement</h2>
            <p className="text-slate-600 mb-3">
              By renting tools from Euro-Tools, you agree to use the equipment responsibly and return it
              in the same condition as received, normal wear and tear excepted.
            </p>
            <p className="text-slate-600">
              All rentals require valid identification and KYC verification before dispatch.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Insurance Deposit</h2>
            <p className="text-slate-600 mb-3">
              A refundable insurance deposit is required for all rentals. The deposit amount varies by
              tool value (typically 20-40% of rental price).
            </p>
            <p className="text-slate-600">
              Deposits are refunded within 24-48 hours after tool return and condition inspection by
              our representative.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Damage & Loss Policy</h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Minor wear and tear: No deduction from deposit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Repairable damage: Repair costs deducted from deposit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Total loss or theft: Full replacement cost charged</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Late Returns</h2>
            <p className="text-slate-600">
              Tools must be returned by the agreed return date. A 2-hour grace period is provided.
              Late returns incur a fee of 50% of the daily rental rate per additional day.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Cancellation Policy</h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>48+ hours before delivery: Full refund</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>24-48 hours: 50% refund</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Less than 24 hours: No refund</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Liability</h2>
            <p className="text-slate-600">
              The renter is responsible for the safe use and storage of rented equipment. Euro-Tools
              is not liable for injuries or damages resulting from improper tool use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Payment Terms</h2>
            <p className="text-slate-600">
              Payment must be completed before tool dispatch. We accept international credit cards and
              Egyptian local payment methods. All prices are in USD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Privacy & Data</h2>
            <p className="text-slate-600">
              We collect and securely store KYC documents for verification purposes only. Your personal
              data is protected and never shared with third parties without consent.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Last updated: September 12, 2026</p>
          <p className="mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:legal@euro-tools.com" className="text-blue-600 hover:underline">
              legal@euro-tools.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
