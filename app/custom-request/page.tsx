import Link from 'next/link'

export default function CustomRequestPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Custom Tool Request</h1>
        <p className="text-lg text-slate-600 mb-8">
          Can't find the tool you need? We'll source it for you within 24-48 hours.
        </p>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">How It Works</h2>
          <div className="space-y-4 text-slate-600">
            <div className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="font-semibold text-slate-900">Submit Your Request</h3>
                <p>Tell us exactly what tool you need with specifications and intended use</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="font-semibold text-slate-900">We Source It</h3>
                <p>Our team locates the tool from trusted suppliers across Egypt</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="font-semibold text-slate-900">Get Your Quote</h3>
                <p>Receive a custom rental price within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</span>
              <div>
                <h3 className="font-semibold text-slate-900">Approve & Rent</h3>
                <p>Once approved, we'll deliver it to your location</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-slate-700 mb-6">
            To submit a custom tool request, please create an account or log in to your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Account
            </Link>
            <Link
              href="/auth/login"
              className="border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
