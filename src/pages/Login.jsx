import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LoginForm from '../components/LoginForm'

const Login = ({ onLogin }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex"
    >
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-olive-400 relative overflow-hidden items-center justify-center">
        {/* Organic shapes */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-sage-200/10" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-sage-200/5" />
        <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-rust-400/5" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 text-center px-12"
        >
          <img
            src="/FairFarm_Logo.png"
            alt="FairFarm"
            className="w-48 h-48 object-contain mx-auto mb-8"
          />
          <h2 className="font-serif text-3xl text-sage-200 mb-4">
            Welcome Back, Farmer
          </h2>
          <p className="text-sage-200/60 max-w-sm mx-auto">
            Access your marketplace, manage your listings, and track your bids — all in one place.
          </p>

          {/* Decorative stats */}
          <div className="flex justify-center gap-8 mt-12">
            {[
              { val: '850+', label: 'Farmers' },
              { val: '2.4k', label: 'Listings' },
              { val: '₨12M', label: 'Traded' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-sage-200">{s.val}</p>
                <p className="text-xs text-sage-200/50">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-farm-cream relative">
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-olive-400/60 hover:text-olive-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img src="/FairFarm_Logo.png" alt="FairFarm" className="w-20 h-20 mx-auto" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md mb-8"
        >
          <h1 className="font-serif text-3xl text-olive-400 mb-2">Sign In</h1>
          <p className="text-olive-400/60">Access your FairFarm marketplace account</p>
        </motion.div>

        <LoginForm onLogin={onLogin} />
      </div>
    </motion.div>
  )
}

export default Login
