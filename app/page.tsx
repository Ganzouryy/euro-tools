import Link from 'next/link'
import { ArrowRight, Shield, Clock, Wrench, CheckCircle } from 'lucide-react'
import ChatbotWidget from '@/components/ChatbotWidget'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">Euro-Tools</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/catalog" className="text-slate-700 hover:text-blue-600 transition">
                Browse Tools
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-blue-600 transition">
                How It Works
              </Link>
              <Link href="/auth/login" className="text-slate-700 hover:text-blue-600 transition">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Professional Tools for
            <span className="text-blue-600"> European Engineers</span> in Egypt
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Stop paying excess baggage fees. Rent high-quality mechanical and electrical tools locally.
            Trusted by engineers from Siemens, ABB, and leading manufacturing plants across Egypt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              Browse Tools <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/custom-request"
              className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition"
            >
              Request Custom Tool
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white border-y py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">Fully Insured</h3>
              <p className="text-sm text-slate-600">Refundable deposit protection</p>
            </div>
            <div>
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">Same-Day Delivery</h3>
              <p className="text-sm text-slate-600">Direct to your hotel or plant</p>
            </div>
            <div>
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">KYC Verified</h3>
              <p className="text-sm text-slate-600">Secure identity verification</p>
            </div>
            <div>
              <Wrench className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">500+ Tools</h3>
              <p className="text-sm text-slate-600">Professional grade equipment</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600">Get the tools you need in four simple steps</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Browse & Select', desc: 'Search our catalog or request a custom tool' },
            { step: '02', title: 'Verify Identity', desc: 'Quick KYC with passport or company ID' },
            { step: '03', title: 'Secure Payment', desc: 'Pay rental fee + refundable deposit' },
            { step: '04', title: 'Get Delivered', desc: 'Direct delivery to your location in Egypt' },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="text-6xl font-bold text-blue-100 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join European engineers who trust Euro-Tools for their equipment needs in Egypt
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="h-6 w-6 text-blue-500" />
                <span className="text-white font-bold text-lg">Euro-Tools</span>
              </div>
              <p className="text-sm">Professional tool rental for European engineers in Egypt</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/catalog" className="hover:text-white">Browse Tools</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/custom-request" className="hover:text-white">Custom Request</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/kyc-guide" className="hover:text-white">KYC Guide</Link></li>
                <li><Link href="/delivery" className="hover:text-white">Delivery Info</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; 2026 Euro-Tools. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  )
}
