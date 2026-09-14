export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">About Euro-Tools</h1>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 mb-4">
            Euro-Tools was founded to solve a critical problem faced by European engineers and technicians
            traveling to Egypt for manufacturing plant maintenance: excessive baggage fees for professional tools.
          </p>
          <p className="text-slate-600">
            We provide a trusted, insured tool rental platform that allows professionals to access high-quality
            equipment locally, eliminating travel hassles and reducing costs.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Why Choose Us</h2>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Professional-grade tools from trusted brands (Siemens, ABB, Bosch)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Same-day delivery to hotels and manufacturing plants across Egypt</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Fully insured with refundable deposit protection</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Secure KYC-verified platform for business safety</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Custom tool sourcing within 24-48 hours</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
          <p className="text-slate-600 mb-4">
            Have questions? Our team is here to help you find the right tools for your project.
          </p>
          <p className="text-slate-700">
            <strong>Email:</strong> support@euro-tools.com<br />
            <strong>WhatsApp:</strong> +20 XXX XXX XXXX
          </p>
        </div>
      </div>
    </div>
  )
}
