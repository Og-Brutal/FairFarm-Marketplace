import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Check, AlertCircle, Loader2, User, Phone, MapPin, Upload, ShieldAlert, Sprout } from 'lucide-react'
import { districts } from '../data/mockData'

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  
  // Login Form state
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  
  // Farmer Public Registration state
  const [regData, setRegData] = useState({
    fullName: '',
    phone: '',
    district: districts[0] || 'Faisalabad',
    password: '',
    confirmPassword: '',
    docFileName: '',
  })
  
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateLoginForm = () => {
    const newErrors = {}
    if (!loginData.email.trim()) {
      newErrors.email = 'Email or Phone is required'
    } else if (!validateEmail(loginData.email) && loginData.email.length < 10) {
      newErrors.email = 'Please enter a valid email or 11-digit phone number'
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required'
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegisterForm = () => {
    const newErrors = {}
    if (!regData.fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!regData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (regData.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Enter a valid Pakistani phone number (e.g. 03001234567)'
    }
    if (!regData.password) {
      newErrors.password = 'Password is required'
    } else if (regData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (regData.password !== regData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleRegChange = (e) => {
    const { name, value } = e.target
    setRegData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setRegData(prev => ({ ...prev, docFileName: file.name }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (mode === 'login') {
      if (!validateLoginForm()) return
    } else {
      if (!validateRegisterForm()) return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1400))
    setIsLoading(false)
    setIsSuccess(true)

    setTimeout(() => {
      onLogin()
      navigate('/marketplace')
    }, 1200)
  }

  return (
    <div className="w-full max-w-md">
      {/* Mode Switcher Tabs */}
      {!isSuccess && (
        <div className="flex bg-sage-200/40 p-1 rounded-xl mb-6 border border-sage-200">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrors({}); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-olive-400 shadow-sm font-semibold'
                : 'text-olive-400/70 hover:text-olive-400'
            }`}
          >
            Farmer Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrors({}); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-rust-400 shadow-sm font-semibold'
                : 'text-olive-400/70 hover:text-olive-400'
            }`}
          >
            <Sprout size={15} />
            Register as Farmer
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage-200 flex items-center justify-center"
            >
              <Check size={36} className="text-olive-400" />
            </motion.div>
            <h3 className="font-serif text-2xl text-olive-400 mb-2">
              {mode === 'register' ? 'Registration Complete!' : 'Welcome back, Farmer!'}
            </h3>
            <p className="text-olive-400/60 text-sm max-w-xs mx-auto">
              {mode === 'register'
                ? 'Your farmer account has been created with status PENDING VERIFICATION by Market Officer. Entering marketplace...'
                : 'Redirecting to your farmer marketplace...'}
            </p>
          </motion.div>
        ) : mode === 'login' ? (
          /* LOGIN FORM */
          <motion.form
            key="login-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <div className="bg-sage-200/30 border border-sage-200 rounded-lg px-4 py-3">
              <p className="text-xs text-olive-400/80">
                <strong>Farmer Portal:</strong> Sign in with your registered email or phone to view live crop bids and post listings.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-olive-400 mb-1">Email or Phone Number</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                <input
                  type="text"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="farmer@example.com or 03001234567"
                  className={`fairfarm-input pl-11 ${errors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-olive-400 mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  className={`fairfarm-input pl-11 pr-12 ${errors.password ? 'border-red-400 focus:ring-red-200' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-olive-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-300 text-olive-400 focus:ring-sage-200"
                />
                <span className="text-sm text-olive-400/70">Remember me</span>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              className="w-full fairfarm-btn-primary flex items-center justify-center gap-2 !py-3 text-base disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In as Farmer'
              )}
            </motion.button>
          </motion.form>
        ) : (
          /* FARMER PUBLIC REGISTRATION FORM */
          <motion.form
            key="register-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {/* SSD Verification Notice */}
            <div className="bg-rust-50 border border-rust-200 rounded-lg px-4 py-3 text-xs text-rust-800 flex items-start gap-2.5">
              <ShieldAlert size={18} className="shrink-0 text-rust-500 mt-0.5" />
              <div>
                <strong>Public Farmer Registration (KYC Flow):</strong>
                <p className="mt-0.5 text-rust-700/80">
                  New farmers are registered with status <span className="font-semibold text-rust-900">PENDING VERIFICATION</span>. Market Officers review land/ID records before verifying.
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-olive-400 mb-1">Full Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                <input
                  type="text"
                  name="fullName"
                  value={regData.fullName}
                  onChange={handleRegChange}
                  placeholder="e.g. Chaudhry Ahmed Khan"
                  className={`fairfarm-input pl-11 ${errors.fullName ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-olive-400 mb-1">Phone Number (SMS OTP) *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                <input
                  type="text"
                  name="phone"
                  value={regData.phone}
                  onChange={handleRegChange}
                  placeholder="0300-1234567"
                  className={`fairfarm-input pl-11 ${errors.phone ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-olive-400 mb-1">District / Region *</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                <select
                  name="district"
                  value={regData.district}
                  onChange={handleRegChange}
                  className="fairfarm-input pl-11 appearance-none cursor-pointer"
                >
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-olive-400 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={regData.password}
                  onChange={handleRegChange}
                  placeholder="Min 6 characters"
                  className={`fairfarm-input ${errors.password ? 'border-red-400' : ''}`}
                />
                {errors.password && <p className="text-red-500 text-[11px] mt-0.5">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-olive-400 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={regData.confirmPassword}
                  onChange={handleRegChange}
                  placeholder="Repeat password"
                  className={`fairfarm-input ${errors.confirmPassword ? 'border-red-400' : ''}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Document Upload for KYC */}
            <div>
              <label className="block text-xs font-medium text-olive-400 mb-1">
                Land Ownership Document / CNIC Proof (Optional for Demo)
              </label>
              <label className="border-2 border-dashed border-sage-200 rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:border-rust-400 bg-white transition-colors">
                <Upload size={16} className="text-olive-400/60" />
                <span className="text-xs text-olive-400/70 truncate max-w-[200px]">
                  {regData.docFileName || 'Click to select CNIC or Fard document'}
                </span>
                <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              className="w-full fairfarm-btn-primary flex items-center justify-center gap-2 !py-3 text-base disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Farmer Account...
                </>
              ) : (
                'Submit Farmer Registration'
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LoginForm
