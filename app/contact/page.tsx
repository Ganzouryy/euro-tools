export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Contact Us</h1>
        <p className="text-lg text-slate-600 mb-12 text-center">
          Have questions? We're here to help you get the tools you need.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Get In Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
                <p className="text-slate-600">support@euro-tools.com</p>
                <p className="text-sm text-slate-500">Response within 24 hours</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">WhatsApp</h3>
                <p className="text-slate-600">+20 XXX XXX XXXX</p>
                <p className="text-sm text-slate-500">Instant messaging support</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
                <p className="text-slate-600">+20 XXX XXX XXXX</p>
                <p className="text-sm text-slate-500">Mon-Sat: 9AM - 6PM (Cairo Time)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Office Location</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Main Office</h3>
                <p className="text-slate-600">
                  Cairo, Egypt<br />
                  Industrial Zone<br />
                  Office Hours: 9AM - 6PM
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Service Areas</h3>
                <ul className="text-slate-600 text-sm space-y-1">
                  <li>• Cairo & Giza</li>
                  <li>• Alexandria</li>
                  <li>• Industrial Zones (6th October, 10th Ramadan)</li>
                  <li>• Custom delivery available nationwide</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Need Immediate Assistance?</h2>
          <p className="text-slate-600 mb-4">
            For urgent tool requests or delivery inquiries, contact us via WhatsApp for fastest response.
          </p>
          <div className="flex gap-4">
            <a
              href="https://wa.me/20XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Message on WhatsApp
            </a>
            <a
              href="mailto:support@euro-tools.com"
              className="border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
