import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, UserCheck, AlertTriangle, CheckCircle2, XCircle, FileText, Lock, Eye, Building2, TrendingUp, RefreshCw } from 'lucide-react'
import { pendingFarmersData, maskCNIC, maskPhone } from '../data/mockData'

const OfficerDashboard = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('kyc') // 'kyc' | 'reference-prices' | 'disputes'
  const [pendingFarmers, setPendingFarmers] = useState(pendingFarmersData)
  const [refPrices, setRefPrices] = useState([
    { crop: 'Wheat', price: 9200, unit: '40kg', updatedBy: 'Tariq Mahmood', date: '2026-10-05' },
    { crop: 'Rice', price: 11500, unit: '40kg', updatedBy: 'Tariq Mahmood', date: '2026-10-05' },
    { crop: 'Cotton', price: 18400, unit: '40kg', updatedBy: 'Tariq Mahmood', date: '2026-10-04' },
    { crop: 'Maize', price: 4800, unit: '40kg', updatedBy: 'Tariq Mahmood', date: '2026-10-03' }
  ])

  // New Reference Price Form
  const [newPrice, setNewPrice] = useState({ crop: 'Wheat', price: '', unit: '40kg' })
  const [priceSuccess, setPriceSuccess] = useState('')
  const [showMaskedToggle, setShowMaskedToggle] = useState(false)

  // Verify / Reject Farmer
  const handleVerifyFarmer = (id, newStatus) => {
    setPendingFarmers(prev =>
      prev.map(f => f.id === id ? { ...f, status: newStatus } : f)
    )
  }

  // Publish Reference Price Action (Restricted to Market Officer)
  const handlePublishPrice = (e) => {
    e.preventDefault()
    if (!newPrice.price || isNaN(newPrice.price)) return

    const priceVal = parseInt(newPrice.price)
    setRefPrices(prev => {
      const exists = prev.find(p => p.crop.toLowerCase() === newPrice.crop.toLowerCase())
      if (exists) {
        return prev.map(p => p.crop.toLowerCase() === newPrice.crop.toLowerCase()
          ? { ...p, price: priceVal, date: '2026-10-05' } : p
        )
      }
      return [{ crop: newPrice.crop, price: priceVal, unit: newPrice.unit, updatedBy: 'Tariq Mahmood', date: '2026-10-05' }, ...prev]
    })

    setPriceSuccess(`Official Market Reference Price for ${newPrice.crop} published: Rs. ${priceVal.toLocaleString()}/40kg`)
    setNewPrice(prev => ({ ...prev, price: '' }))
    setTimeout(() => setPriceSuccess(''), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 min-h-screen bg-farm-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Officer Security Header */}
        <div className="bg-olive-400 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-rust-400/20 blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-sage-200/20 backdrop-blur flex items-center justify-center">
                  <ShieldCheck size={24} className="text-sage-200" />
                </div>
                <h1 className="font-serif text-2xl md:text-3xl font-semibold">Market Officer Control Portal</h1>
              </div>
              <p className="text-sage-200/80 text-sm max-w-xl">
                Authorized Governance Console: Verify farmer KYC credentials, publish official reference prices, and enforce market integrity.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-sage-200" />
                <span className="font-semibold text-white">Officer: {currentUser?.name || 'Tariq Mahmood'}</span>
              </div>
              <div className="text-sage-200/80">Jurisdiction: Faisalabad Central Board</div>
              <div className="text-emerald-300 font-semibold flex items-center gap-1 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Role-Based Access Level: High (Level 2)
              </div>
            </div>
          </div>
        </div>

        {/* Security Concept Callout Box */}
        <div className="bg-sage-200/40 border border-sage-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-olive-400">
            <Lock size={18} className="text-rust-400 shrink-0" />
            <div>
              <strong>SSD Security Concept Applied:</strong> Role-Based Access Control (RBAC) & PII Data Protection.
              <p className="text-xs text-olive-400/70">
                You are viewing unmasked CNIC and land registry details because your role is <strong>Market Officer</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowMaskedToggle(!showMaskedToggle)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-sage-200 hover:bg-sage-100 text-olive-400 transition-colors shrink-0"
          >
            {showMaskedToggle ? '👁️ View Unmasked (Officer Mode)' : '🔒 Test Masked Mode (Public View)'}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-sage-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('kyc')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kyc'
                ? 'border-rust-400 text-rust-400 font-semibold'
                : 'border-transparent text-olive-400/70 hover:text-olive-400'
            }`}
          >
            <UserCheck size={18} />
            Farmer KYC Approvals ({pendingFarmers.filter(f => f.status === 'PENDING_VERIFICATION').length})
          </button>

          <button
            onClick={() => setActiveTab('reference-prices')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reference-prices'
                ? 'border-rust-400 text-rust-400 font-semibold'
                : 'border-transparent text-olive-400/70 hover:text-olive-400'
            }`}
          >
            <TrendingUp size={18} />
            Publish Official Reference Prices
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'disputes'
                ? 'border-rust-400 text-rust-400 font-semibold'
                : 'border-transparent text-olive-400/70 hover:text-olive-400'
            }`}
          >
            <AlertTriangle size={18} />
            Market Disputes & Audit Logs
          </button>
        </div>

        {/* TAB 1: FARMER KYC APPROVALS */}
        {activeTab === 'kyc' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-olive-400">Pending Farmer Registrations</h2>
              <span className="text-xs bg-sage-200/60 px-3 py-1 rounded-full text-olive-400 font-medium">
                {pendingFarmers.length} Applications Total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingFarmers.map((farmer) => {
                const displayCNIC = showMaskedToggle ? maskCNIC(farmer.cnic) : farmer.cnic
                const displayPhone = showMaskedToggle ? maskPhone(farmer.phone) : farmer.phone

                return (
                  <div key={farmer.id} className="bg-white rounded-xl border border-sage-200 p-6 shadow-sm relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-olive-400">{farmer.name}</h3>
                        <p className="text-xs text-olive-400/60">{farmer.email} • {farmer.district}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        farmer.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                        farmer.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {farmer.status}
                      </span>
                    </div>

                    <div className="bg-farm-cream rounded-lg p-4 space-y-2.5 text-xs text-olive-400 mb-6 border border-sage-100">
                      <div className="flex items-center justify-between">
                        <span className="text-olive-400/60 font-medium">CNIC Number:</span>
                        <span className="font-mono font-semibold bg-white px-2 py-0.5 rounded border border-sage-200">
                          {displayCNIC}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-olive-400/60 font-medium">Phone Number:</span>
                        <span className="font-mono font-semibold bg-white px-2 py-0.5 rounded border border-sage-200">
                          {displayPhone}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-olive-400/60 font-medium">Land Registry Fard No:</span>
                        <span className="font-mono font-semibold text-rust-400">{farmer.landRecordNo}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-sage-200/50">
                        <span className="text-olive-400/60">Submitted Date:</span>
                        <span>{farmer.submittedDate}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {farmer.status === 'PENDING_VERIFICATION' ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleVerifyFarmer(farmer.id, 'VERIFIED')}
                          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={16} /> Approve Verification
                        </button>
                        <button
                          onClick={() => handleVerifyFarmer(farmer.id, 'REJECTED')}
                          className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 text-xs py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                        >
                          <XCircle size={16} /> Reject Account
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-olive-400/60 py-2 bg-sage-100 rounded-lg">
                        Status updated to <strong>{farmer.status}</strong>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 2: PUBLISH OFFICIAL REFERENCE PRICES (RESTRICTED FUNCTION) */}
        {activeTab === 'reference-prices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Publish Form */}
            <div className="bg-white rounded-xl border border-sage-200 p-6 shadow-sm h-fit">
              <h3 className="font-serif text-lg text-olive-400 mb-1">Publish Market Reference Rate</h3>
              <p className="text-xs text-olive-400/60 mb-6">
                Restricted Action: Only Market Officers can update official benchmark rates.
              </p>

              {priceSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{priceSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePublishPrice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-olive-400 mb-1">Select Crop</label>
                  <select
                    value={newPrice.crop}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, crop: e.target.value }))}
                    className="fairfarm-input text-sm"
                  >
                    <option value="Wheat">🌾 Wheat</option>
                    <option value="Rice">🍚 Rice</option>
                    <option value="Cotton">🏵️ Cotton</option>
                    <option value="Maize">🌽 Maize</option>
                    <option value="Tomatoes">🍅 Tomatoes</option>
                    <option value="Potatoes">🥔 Potatoes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-olive-400 mb-1">Official Reference Price (PKR per 40kg) *</label>
                  <input
                    type="number"
                    value={newPrice.price}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 9500"
                    className="fairfarm-input text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full fairfarm-btn-primary text-sm flex items-center justify-center gap-2 !py-3"
                >
                  <TrendingUp size={16} /> Publish Official Rate
                </button>
              </form>
            </div>

            {/* Current Reference Rates List */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-sage-200 p-6 shadow-sm">
              <h3 className="font-serif text-lg text-olive-400 mb-4">Active Market Benchmark Prices</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-sage-200 text-xs text-olive-400/60 uppercase">
                      <th className="py-3 px-4">Crop</th>
                      <th className="py-3 px-4">Official Rate</th>
                      <th className="py-3 px-4">Unit</th>
                      <th className="py-3 px-4">Published By</th>
                      <th className="py-3 px-4">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-100">
                    {refPrices.map((item, idx) => (
                      <tr key={idx} className="hover:bg-farm-cream/50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-olive-400">{item.crop}</td>
                        <td className="py-3.5 px-4 font-bold text-rust-400">Rs. {item.price.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-xs text-olive-400/70">{item.unit}</td>
                        <td className="py-3.5 px-4 text-xs text-olive-400">{item.updatedBy}</td>
                        <td className="py-3.5 px-4 text-xs text-olive-400/60">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: DISPUTES & AUDIT LOGS */}
        {activeTab === 'disputes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-sage-200 p-6 shadow-sm">
              <h3 className="font-serif text-lg text-olive-400 mb-4">Market Audit & Suspicious Activity Log</h3>

              <div className="space-y-4">
                {[
                  { id: 'disp_1', type: 'Unusually Low Bid Warning', crop: 'Cotton (Multan)', detail: 'Bid of Rs. 12,000 submitted on Rs. 18,400 benchmark', status: 'RESOLVED', time: '10 mins ago' },
                  { id: 'disp_2', type: 'KYC Document Verification Request', crop: 'Farmer Sultan Ali', detail: 'Fard ownership land number auto-validated against Punjab Board of Revenue', status: 'PENDING', time: '1 hour ago' }
                ].map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-sage-200 bg-farm-cream flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-olive-400">{item.type}</span>
                        <span className="text-xs text-rust-400 font-medium">({item.crop})</span>
                      </div>
                      <p className="text-xs text-olive-400/70">{item.detail}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-sage-200 text-olive-400 font-medium shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  )
}

export default OfficerDashboard
