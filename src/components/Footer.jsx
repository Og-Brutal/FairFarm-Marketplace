import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sprout, Shield, FileText, Users, ShoppingBasket, TrendingUp, BarChart3 } from 'lucide-react'

const Footer = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative mt-20">
      {/* Organic wave top */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%] overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L48 108C96 96 192 72 288 60C384 48 480 48 576 54C672 60 768 72 864 78C960 84 1056 84 1152 78C1248 72 1344 60 1392 54L1440 48V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="#555424"
          />
        </svg>
      </div>

      <div className="bg-olive-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/FairFarm_Logo.png" alt="FairFarm" className="w-12 h-12 object-contain" />
                <span className="font-serif text-2xl text-sage-200">FairFarm</span>
              </div>
              <p className="text-sage-200/70 text-sm leading-relaxed">
                Farmer Marketplace with Price Transparency. Connecting verified farmers directly with buyers for fair, transparent trade.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold text-sage-200 mb-4 flex items-center gap-2">
                <ShoppingBasket size={16} /> Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/marketplace" className="text-sage-200/60 hover:text-sage-200 transition-colors text-sm">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-sage-200/60 hover:text-sage-200 transition-colors text-sm">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('price-transparency')} className="text-sage-200/60 hover:text-sage-200 transition-colors text-sm">
                    Price Transparency
                  </button>
                </li>
              </ul>
            </div>

            {/* For Users */}
            <div>
              <h4 className="font-semibold text-sage-200 mb-4 flex items-center gap-2">
                <Users size={16} /> For Users
              </h4>
              <ul className="space-y-3">
                <li><span className="text-sage-200/60 text-sm">For Farmers</span></li>
                <li><span className="text-sage-200/60 text-sm">For Buyers</span></li>
                <li><span className="text-sage-200/60 text-sm">Market Officers</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-sage-200 mb-4 flex items-center gap-2">
                <Shield size={16} /> Trust & Safety
              </h4>
              <ul className="space-y-3">
                <li><span className="text-sage-200/60 text-sm">Security</span></li>
                <li><span className="text-sage-200/60 text-sm">Privacy Policy</span></li>
                <li><span className="text-sage-200/60 text-sm">Terms of Service</span></li>
              </ul>
            </div>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-sage-200/20 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-sage-200/50 text-sm">
              © 2026 FairFarm. All rights reserved.
            </p>
            <p className="text-sage-200/40 text-xs">
              Phase 1 — Frontend Prototype
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
