import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Users, ShieldCheck, BarChart3 } from 'lucide-react'

const Hero = ({ isAuthenticated }) => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const stats = [
    { icon: BarChart3, label: 'Active Listings', value: '2,400+' },
    { icon: Users, label: 'Verified Farmers', value: '850+' },
    { icon: ShieldCheck, label: 'Transparent Prices', value: '100%' },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background organic shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-sage-200/30 blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-sage-200/20 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-farm-wheat/30 blur-2xl" />
        {/* Subtle field pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sage-200/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-sage-200/40 text-olive-400 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-rust-400 rounded-full animate-pulse" />
              Pakistan's Farmer Marketplace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl text-olive-400 leading-tight mb-6"
            >
              Fair Prices.{' '}
              <span className="text-rust-400">Direct Markets.</span>{' '}
              Stronger Farmers.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg text-olive-400/70 leading-relaxed mb-8 max-w-lg"
            >
              FairFarm connects verified farmers directly with buyers through transparent market pricing. List your crops, receive sealed bids, and get fair value for your harvest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              {isAuthenticated ? (
                <Link
                  to="/marketplace"
                  className="fairfarm-btn-primary flex items-center gap-2 text-base"
                >
                  Enter Marketplace <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="fairfarm-btn-primary flex items-center gap-2 text-base"
                >
                  Farmer Sign In / Register <ArrowRight size={18} />
                </Link>
              )}
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="fairfarm-btn-outline text-base"
              >
                How It Works
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-sage-200"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sage-200/50 flex items-center justify-center">
                    <stat.icon size={20} className="text-olive-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-olive-400">{stat.value}</p>
                    <p className="text-xs text-olive-400/50">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block flex items-center justify-center"
          >
            {/* Logo floating */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex justify-center"
            >
              <img
                src="/FairFarm_Logo.png"
                alt="FairFarm"
                className="w-80 h-80 object-contain drop-shadow-xl"
              />
            </motion.div>

            {/* Verified badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="absolute top-8 right-8 bg-white rounded-xl shadow-lg border border-sage-100 px-4 py-3 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sage-200/50 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-olive-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-olive-400">Verified Farmer</p>
                  <p className="text-[10px] text-olive-400/50">Trusted Marketplace</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
