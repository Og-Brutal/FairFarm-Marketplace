import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import SplashScreen from './components/SplashScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import FarmerMarketplace from './pages/FarmerMarketplace'
import OfficerDashboard from './pages/OfficerDashboard'
import { demoUsers } from './data/mockData'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(demoUsers[0]) // Default to Ahmed Khan (Farmer)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (user) => {
    if (user) {
      setCurrentUser(user)
    }
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  if (showSplash) {
    return <SplashScreen />
  }

  const hideNavFooter = location.pathname === '/login'

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavFooter && (
        <Navbar
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            
            {/* FARMER DASHBOARD ROUTE */}
            <Route
              path="/marketplace"
              element={
                isAuthenticated ? (
                  <FarmerMarketplace isAuthenticated={isAuthenticated} currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* MARKET OFFICER DASHBOARD ROUTE */}
            <Route
              path="/officer-dashboard"
              element={
                isAuthenticated && currentUser?.role === 'Market Officer' ? (
                  <OfficerDashboard currentUser={currentUser} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  )
}

export default App
