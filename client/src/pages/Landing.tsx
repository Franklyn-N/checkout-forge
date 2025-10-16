import { Link } from 'react-router-dom';
import { Zap, CheckCircle, TrendingUp, Users, Shield, Rocket } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CheckoutForge</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-blue-200 hover:text-white transition-colors font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <Rocket className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-200">Comprehensive checkout platform</span>
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            The Complete Checkout
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              & Payment Platform
            </span>
          </h1>

          <p className="text-xl text-blue-200 mb-10 max-w-3xl mx-auto">
            Build powerful checkout experiences with A/B testing, affiliate management, sales
            funnels, and comprehensive analytics all in one platform.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl shadow-blue-500/25"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-white/20"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Customizable Checkouts</h3>
            <p className="text-blue-200">
              Build beautiful, conversion-optimized checkout pages with our template library. Fully
              customizable to match your brand.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">A/B Testing</h3>
            <p className="text-blue-200">
              Optimize conversion rates with built-in A/B testing. Test different layouts, copy, and
              pricing strategies effortlessly.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Affiliate Management</h3>
            <p className="text-blue-200">
              Manage your entire affiliate program with commission tracking, payouts, and
              performance analytics.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Sales Funnels</h3>
            <p className="text-blue-200">
              Create multi-step funnels with upsells, downsells, and order bumps to maximize revenue
              per customer.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Secure & Compliant</h3>
            <p className="text-blue-200">
              Built with security in mind. PCI compliant with secure payment processing and data
              encryption.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
              <Rocket className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Full API Access</h3>
            <p className="text-blue-200">
              Complete REST API with 37+ endpoints. Build custom integrations and automate your
              workflows.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Checkout?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using CheckoutForge to increase conversions and revenue.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
          >
            Get Started for Free
          </Link>
        </div>

        <div className="mt-20 text-center text-blue-300 text-sm">
          <p>CheckoutForge v1.0.0 - Powered by Supabase</p>
          <p className="mt-2">Complete OpenAPI documentation available</p>
        </div>
      </div>
    </div>
  );
}
