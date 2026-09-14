export default function KYCGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">KYC Verification Guide</h1>
        <p className="text-lg text-slate-600 mb-12 text-center">
          Complete your identity verification quickly and securely
        </p>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Why Do We Need KYC?</h2>
          <p className="text-slate-600 mb-4">
            KYC (Know Your Customer) verification helps us ensure a secure rental environment for all users.
            It protects both renters and our business from fraud and unauthorized transactions.
          </p>
          <p className="text-slate-600">
            Your documents are encrypted and stored securely. We never share your personal information
            with third parties.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Accepted Documents</h2>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">1. Passport</h3>
              <p className="text-slate-600 text-sm mb-2">Valid passport from any European country</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Must be valid (not expired)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Photo must be clear and readable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>All corners visible in photo</span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">2. Egyptian Visa</h3>
              <p className="text-slate-600 text-sm mb-2">Valid entry visa to Egypt</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Must be current and valid</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Clear photo showing all details</span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">3. European Company ID</h3>
              <p className="text-slate-600 text-sm mb-2">Official company identification card</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Must show company name and your name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Valid and not expired</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Photo or scan clearly visible</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Verification Process</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Upload Your Document</h3>
                <p className="text-slate-600 text-sm">
                  Take a clear photo or scan of your chosen document and upload it through your dashboard
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">We Review It</h3>
                <p className="text-slate-600 text-sm">
                  Our team manually reviews your document within 24 business hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Get Verified</h3>
                <p className="text-slate-600 text-sm">
                  You'll receive an email notification once approved. You can then place orders immediately
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Tips for Fast Approval</h2>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>Use good lighting when taking photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>Ensure all text is readable and not blurry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>Include all four corners of the document</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>Avoid glare or shadows on the document</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>File size under 10MB (JPEG or PNG format)</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Common Rejection Reasons</h2>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-red-600">✗</span>
              <span>Blurry or low-quality images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600">✗</span>
              <span>Expired documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600">✗</span>
              <span>Partial document (corners cut off)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600">✗</span>
              <span>Wrong document type uploaded</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600">✗</span>
              <span>Document not in supported language</span>
            </li>
          </ul>
          <p className="text-sm text-slate-500 mt-4">
            If your document is rejected, you'll receive an email with specific reasons and can resubmit.
          </p>
        </div>
      </div>
    </div>
  )
}
