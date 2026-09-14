export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Delivery Information</h1>
        <p className="text-lg text-slate-600 mb-12 text-center">
          Fast, reliable tool delivery across Egypt
        </p>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Delivery Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-green-300 bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Same-Day Delivery</h3>
              <p className="text-slate-600 text-sm mb-3">
                Available in Cairo metro area (Cairo, Giza, New Cairo, 6th October)
              </p>
              <div className="text-2xl font-bold text-green-600 mb-2">FREE</div>
              <p className="text-sm text-slate-600">
                Order before 2 PM for same-day delivery
              </p>
            </div>

            <div className="border border-blue-300 bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Next-Day Delivery</h3>
              <p className="text-slate-600 text-sm mb-3">
                Alexandria, Suez, Port Said, and major cities
              </p>
              <div className="text-2xl font-bold text-blue-600 mb-2">$10-30</div>
              <p className="text-sm text-slate-600">
                Based on distance and location
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Where We Deliver</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Hotels</h3>
              <p className="text-slate-600 text-sm">
                We deliver directly to your hotel reception. Please provide hotel name and your room number.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Manufacturing Plants</h3>
              <p className="text-slate-600 text-sm">
                Industrial zones, factories, and plant facilities. Provide facility name and gate number.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Construction Sites</h3>
              <p className="text-slate-600 text-sm">
                Active construction locations. GPS coordinates and site manager contact required.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Custom Locations</h3>
              <p className="text-slate-600 text-sm">
                Any other location in Egypt. Provide detailed address and Google Maps pin.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Handover Process</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Representative Arrives</h3>
                <p className="text-slate-600 text-sm">
                  Our representative will call you 15 minutes before arrival
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Tool Inspection</h3>
                <p className="text-slate-600 text-sm">
                  You'll inspect the tool condition together and confirm it's in working order
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Handover Complete</h3>
                <p className="text-slate-600 text-sm">
                  Representative confirms delivery in our system and provides WhatsApp contact for support
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Return Process</h2>
          <p className="text-slate-600 mb-4">
            Our representative will collect the tool from the same location at your specified return date and time.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Return Inspection</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Representative inspects tool condition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>If condition is good, deposit refund is processed immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>You receive refund confirmation within 24-48 hours</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Important Notes</h2>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>Please be available at the specified delivery time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>Provide accurate WhatsApp contact for coordination</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>For hotels, inform reception about tool delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">⚠</span>
              <span>For plants, provide gate pass information if required</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
