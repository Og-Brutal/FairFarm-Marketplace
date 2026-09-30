import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, BarChart3, ShoppingBasket, TrendingUp, Package, User } from 'lucide-react'
import { cropListings as initialListings, farmerStats } from '../data/mockData'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import CropCard from '../components/CropCard'
import CropModal from '../components/CropModal'
import AddCropModal from '../components/AddCropModal'

const FarmerMarketplace = ({ isAuthenticated }) => {
  const [listings, setListings] = useState(initialListings)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedListing, setSelectedListing] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Compute stats from current listings
  const stats = useMemo(() => {
    const active = listings.filter(l => l.biddingStatus === 'OPEN').length
    const sold = listings.filter(l => l.biddingStatus === 'SOLD').length
    const totalBids = listings.reduce((sum, l) => sum + l.totalBids, 0)
    return [
      { icon: Package, label: 'Total Listings', value: listings.length, color: 'bg-sage-200/50' },
      { icon: ShoppingBasket, label: 'Active', value: active, color: 'bg-green-100' },
      { icon: BarChart3, label: 'Total Bids', value: totalBids, color: 'bg-rust-50' },
      { icon: TrendingUp, label: 'Sold', value: sold, color: 'bg-farm-wheat' },
    ]
  }, [listings])

  // Filter and search
  const filteredListings = useMemo(() => {
    let result = listings

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(l =>
        l.crop.toLowerCase().includes(q) ||
        l.district.toLowerCase().includes(q) ||
        l.quality.toLowerCase().includes(q)
      )
    }

    // Filter
    if (activeFilter === 'OPEN') {
      result = result.filter(l => l.biddingStatus === 'OPEN')
    } else if (activeFilter === 'SOLD') {
      result = result.filter(l => l.biddingStatus === 'SOLD')
    } else if (activeFilter === 'ENDED') {
      result = result.filter(l => l.biddingStatus === 'ENDED')
    } else if (activeFilter === 'ending') {
      result = result.filter(l =>
        l.biddingStatus === 'OPEN' &&
        l.endTime - Date.now() < 2 * 60 * 60 * 1000
      )
    }

    return result
  }, [listings, searchQuery, activeFilter])

  const handleAddCrop = (newListing) => {
    setListings(prev => [newListing, ...prev])
  }

  const handleStatusChange = (id, newStatus) => {
    setListings(prev =>
      prev.map(l => l.id === id ? { ...l, biddingStatus: newStatus } : l)
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-24 pb-16 min-h-screen bg-farm-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Verification Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-amber-900 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">
                Farmer Account Status: <span className="underline decoration-amber-400">PENDING VERIFICATION</span>
              </p>
              <p className="text-xs text-amber-800/70">
                Land Ownership & CNIC documents submitted. Pending Market Officer approval for high-value payouts.
              </p>
            </div>
          </div>
          <span className="text-xs bg-amber-200/60 px-3 py-1 rounded-full font-medium shrink-0 self-start sm:self-auto">
            SSD KYC Active
          </span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img src="/FairFarm_Logo.png" alt="" className="w-10 h-10" />
              <h1 className="font-serif text-3xl md:text-4xl text-olive-400">Farmer Marketplace</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-olive-400/60">
              <User size={14} />
              <span>Logged in as: <strong className="text-olive-400">Farmer</strong></span>
              <span className="text-olive-400/30">|</span>
              <span className="text-rust-400 font-medium">Verified Session</span>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            className="fairfarm-btn-primary flex items-center gap-2 self-start md:self-auto shadow-md"
          >
            <Plus size={18} /> Add Crop Listing
          </motion.button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-xl border border-sage-100 p-4 flex items-center gap-4 shadow-sm hover:shadow transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={22} className="text-olive-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-olive-400">{stat.value}</p>
                <p className="text-xs text-olive-400/50">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="sm:w-80">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Results count */}
        <p className="text-sm text-olive-400/50 mb-4">
          Showing {filteredListings.length} of {listings.length} listings
          {searchQuery && <span> matching "{searchQuery}"</span>}
        </p>

        {/* Crop Grid */}
        <motion.div
          layout
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredListings.length > 0 ? (
              filteredListings.map(listing => (
                <CropCard
                  key={listing.id}
                  listing={listing}
                  onClick={setSelectedListing}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-16"
              >
                <p className="text-4xl mb-4">🌾</p>
                <p className="text-olive-400/60 font-medium">No listings found</p>
                <p className="text-sm text-olive-400/40 mt-1">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedListing && (
          <CropModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <AddCropModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddCrop}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FarmerMarketplace
