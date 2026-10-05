import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User, ShieldCheck } from 'lucide-react'

const Navbar = ({ isAuthenticated, currentUser, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.pathname === '/marketplace') {
      setActiveNav('marketplace')
    } else if (location.pathname === '/officer-dashboard') {
      setActiveNav('officer-dashboard')
    } else if (location.pathname === '/') {
      const handleScrollActive = () => {
        const howItWorks = document.getElementById('how-it-works')
        const priceTrans = document.getElementById('price-transparency')
        const scrollY = window.scrollY

        if (priceTrans && scrollY >= priceTrans.offsetTop - 220) {
          setActiveNav('price-transparency')
        } else if (howItWorks && scrollY >= howItWorks.offsetTop - 220) {
          setActiveNav('how-it-works')
        } else {
          setActiveNav('home')
        }
      }
      handleScrollActive()
      window.addEventListener('scroll', handleScrollActive)
      return () => window.removeEventListener('scroll', handleScrollActive)
    }
  }, [location.pathname])

  const handleNavClick = (sectionId) => {
    setIsMobileOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Dynamic nav links based on recognized role
  const isOfficer = currentUser?.role === 'Market Officer'

  const navLinks = [
    { id: 'home', label: 'Home', path: '/', type: 'link' },
    { id: 'how-it-works', label: 'How It Works', sectionId: 'how-it-works', type: 'scroll' },
    { id: 'price-transparency', label: 'Price Transparency', sectionId: 'price-transparency', type: 'scroll' },
    ...(isAuthenticated
      ? isOfficer
        ? [{ id: 'officer-dashboard', label: 'Officer Dashboard', path: '/officer-dashboard', type: 'link' }]
        : [{ id: 'marketplace', label: 'Farmer Marketplace', path: '/marketplace', type: 'link' }]
      : []
    ),
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-sage-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" onClick={() => setActiveNav('home')} className="flex items-center gap-2 group">
              <img
                src="/FairFarm_Logo.png"
                alt="FairFarm"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <span className="font-serif text-xl md:text-2xl text-olive-400 group-hover:text-rust-400 transition-colors">
                FairFarm
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.id} className="relative py-1">
                  {link.type === 'link' ? (
                    <Link
                      to={link.path}
                      onClick={() => setActiveNav(link.id)}
                      className={`relative text-sm font-medium transition-colors hover:text-rust-400 ${
                        activeNav === link.id ? 'text-rust-400 font-semibold' : 'text-olive-400'
                      }`}
                    >
                      {link.label}
                      {activeNav === link.id && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rust-400 rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveNav(link.id)
                        handleNavClick(link.sectionId)
                      }}
                      className={`relative text-sm font-medium transition-colors hover:text-rust-400 ${
                        activeNav === link.id ? 'text-rust-400 font-semibold' : 'text-olive-400'
                      }`}
                    >
                      {link.label}
                      {activeNav === link.id && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rust-400 rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-olive-400 bg-sage-200/40 px-3 py-1.5 rounded-full border border-sage-200">
                    <div className="w-6 h-6 rounded-full bg-rust-400 text-white flex items-center justify-center text-xs">
                      {isOfficer ? <ShieldCheck size={14} /> : <User size={14} />}
                    </div>
                    <span className="font-semibold">{currentUser?.name || (isOfficer ? 'Tariq Mahmood' : 'Ahmed Khan')}</span>
                    <span className="text-[11px] bg-white px-2 py-0.5 rounded text-rust-400 font-medium">
                      {currentUser?.role || 'Farmer'}
                    </span>
                  </div>
                  <button
                    onClick={() => { onLogout(); navigate('/'); setActiveNav('home'); }}
                    className="text-sm text-rust-400 hover:text-rust-500 transition-colors flex items-center gap-1 font-medium"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="fairfarm-btn-primary text-sm !px-5 !py-2.5"
                >
                  Sign In (Demo Roles)
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-olive-400 hover:text-rust-400 transition-colors"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-72 z-50 bg-white shadow-xl md:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <img src="/FairFarm_Logo.png" alt="FairFarm" className="w-8 h-8" />
                  <span className="font-serif text-lg text-olive-400">FairFarm</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-olive-400 hover:text-rust-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {link.type === 'link' ? (
                      <Link
                        to={link.path}
                        onClick={() => { setIsMobileOpen(false); setActiveNav(link.id); }}
                        className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                          activeNav === link.id
                            ? 'bg-sage-200/30 text-rust-400 font-semibold'
                            : 'text-olive-400 hover:bg-sage-200/20'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveNav(link.id)
                          handleNavClick(link.sectionId)
                        }}
                        className={`block w-full text-left py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                          activeNav === link.id
                            ? 'bg-sage-200/30 text-rust-400 font-semibold'
                            : 'text-olive-400 hover:bg-sage-200/20'
                        }`}
                      >
                        {link.label}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-sage-100">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4">
                      <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center">
                        <User size={18} className="text-olive-400" />
                      </div>
                      <div>
                        <p className="font-medium text-olive-400">{currentUser?.name || 'Ahmed Khan'}</p>
                        <p className="text-xs text-rust-400 font-medium">{currentUser?.role || 'Farmer'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { onLogout(); navigate('/'); setActiveNav('home'); setIsMobileOpen(false); }}
                      className="w-full fairfarm-btn-outline text-sm flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="block w-full fairfarm-btn-primary text-center text-sm"
                  >
                    Sign In (Demo Roles)
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
