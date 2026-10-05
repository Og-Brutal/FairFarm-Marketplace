import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Check, AlertCircle, Loader2, User, Phone, MapPin, Upload, ShieldAlert, Sprout, ShieldCheck } from 'lucide-react'
import { districts, demoUsers } from '../data/mockData'

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  
  // Login Form state
  const [loginData, setLoginData] = useState({ email: 'farmer@fairfarm.pk', password: 'password123' })
  
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
  const [selectedUser, setSelectedUser] = useState(demoUsers[0])

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateLoginForm = () => {
    const newErrors = {}
    if (!loginData.email.trim()) {
      newErrors.email = 'Email or Phone is required'
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

  // Quick Demo Account Auto-Fill
  const handleSelectDemoUser = (user) => {
    setSelectedUser(user)
    setLoginData({
      email: user.email,
      password: user.password
    })
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    let loggedInUser = selectedUser

    if (mode === 'login') {
      if (!validateLoginForm()) return
      const matched = demoUsers.find(u => u.email.toLowerCase() === loginData.email.toLowerCase())
      if (matched) {
        loggedInUser = matched
      } else {
        loggedInUser = {
          id: 'u_custom',
          name: loginData.email.split('@')[0],
          email: loginData.email,
          role: 'Farmer',
          district: 'Faisalabad',
          verificationStatus: 'VERIFIED'
        }
      }
    } else {
      if (!validateRegisterForm()) return
      loggedInUser = {
        id: 'u_new_' + Date.now(),
        name: regData.fullName,
        email: regData.phone + '@fairfarm.pk',
        role: 'Farmer',
        district: regData.district,
        verificationStatus: 'PENDING_VERIFICATION'
      }
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsLoading(false)
    setIsSuccess(true)

    setTimeout(() => {
      onLogin(loggedInUser)
      if (loggedInUser.role === 'Market Officer') {
        navigate('/officer-dashboard')
      } else {
        navigate('/marketplace')
      }
    }, 1000)
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
            Demo Sign In (Role-Based)
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
            New Farmer Registration
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
              Welcome, {selectedUser.name}!
            </h3>
            <p className="text-olive-400/60 text-sm max-w-xs mx-auto">
              Role Recognized: <strong className="text-rust-400">{selectedUser.role}</strong>.
              Redirecting to your role dashboard...
            </p>
          </motion.div>
        ) : mode === 'login' ? (
          /* LOGIN FORM WITH QUICK DEMO USER SELECTOR */
          <motion.form
            key="login-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            {/* DEMO USER QUICK SELECTOR BOX */}
            <div className="bg-sage-200/30 border border-sage-200 rounded-xl p-3.5 space-y-2">
              <p className="text-xs font-semibold text-olive-400 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-rust-400" />
                Select Demo User Role (Activity 2 Testing):
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers[0])}
                  className={`p-2 rounded-lg text-left text-xs border transition-all ${
                    loginData.email === demoUsers[0].email
                      ? 'bg-white border-rust-400 shadow-sm font-medium text-rust-400'
                      : 'bg-white/60 border-sage-200 text-olive-400 hover:bg-white'
                  }`}
                >
                  <p className="font-semibold truncate">👨‍🌾 Ahmed Khan</p>
                  <p className="text-[10px] text-olive-400/70">Role: Farmer</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers[1])}
                  className={`p-2 rounded-lg text-left text-xs border transition-all ${
                    loginData.email === demoUsers[1].email
                      ? 'bg-white border-rust-400 shadow-sm font-medium text-rust-400'
                      : 'bg-white/60 border-sage-200 text-olive-400 hover:bg-white'
                  }`}
                >
                  <p className="font-semibold truncate">🛡️ Tariq Mahmood</p>
                  <p className="text-[10px] text-olive-400/70">Role: Market Officer</p>
                </button>
              </div>
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
                  placeholder="farmer@fairfarm.pk or officer@fairfarm.pk"
                  className={`fairfarm-input pl-11 ${errors.email ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                  className={`fairfarm-input pl-11 pr-12 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-olive-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                  Recognizing Role & Logging in...
                </>
              ) : (
                `Sign In as ${selectedUser.role}`
              )}
            </motion.button>
          </motion.form>
        ) : (
          /* FARMER REGISTRATION FORM */
          <motion.form
            key="register-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="bg-rust-50 border border-rust-200 rounded-lg px-4 py-3 text-xs text-rust-800 flex items-start gap-2.5">
              <ShieldAlert size={18} className="shrink-0 text-rust-500 mt-0.5" />
              <div>
                <strong>Farmer KYC Registration (SSD Requirement):</strong>
                <p className="mt-0.5 text-rust-700/80">
                  New farmers are registered in <span className="font-semibold text-rust-900">PENDING VERIFICATION</span> status. Market Officers verify CNIC and land documents before enabling payout withdrawals.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-olive-400 mb-1">Full Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                <input
                  type="text"
                  name="fullName"
                  value={regData.fullName}
                  onChange={handleRegChange}
                  placeholder="Chaudhry Ahmed Khan"
                  className={`fairfarm-input pl-11 ${errors.fullName ? 'border-red-400' : ''}`}
                />
              </div>
            </div>

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
            </div>

            <div>
              <label className="block text-sm font-medium text-olive-400 mb-1">District / Region *</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
                <select
                  name="district"
                  value={regData.district}
                  onChange={handleRegChange}
                  className="fairfarm-input pl-11 appearance-none"
                >
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-olive-400 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={regData.password}
                  onChange={handleRegChange}
                  placeholder="Min 6 chars"
                  className="fairfarm-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-olive-400 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={regData.confirmPassword}
                  onChange={handleRegChange}
                  placeholder="Repeat password"
                  className="fairfarm-input text-xs"
                />
              </div>
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
