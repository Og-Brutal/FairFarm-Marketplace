import { motion } from 'framer-motion'
import { X, MapPin, Scale, Tag, Gavel, Calendar, TrendingUp } from 'lucide-react'
import Countdown from './Countdown'

const CropModal = ({ listing, onClose }) => {
  if (!listing) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-sage-100">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{listing.image}</span>
            <div>
              <h2 className="font-serif text-2xl text-olive-400">{listing.crop}</h2>
              <p className="text-sm text-olive-400/50">{listing.variety}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-sage-200/30 transition-colors text-olive-400/60 hover:text-olive-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status and countdown */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
              listing.biddingStatus === 'OPEN' ? 'bg-green-100 text-green-700' :
              listing.biddingStatus === 'SOLD' ? 'bg-rust-50 text-rust-400' :
              'bg-neutral-200 text-neutral-600'
            }`}>
              {listing.biddingStatus}
            </span>
            {listing.biddingStatus === 'OPEN' && (
              <Countdown endTime={listing.endTime} />
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-farm-cream rounded-xl p-4">
              <div className="flex items-center gap-2 text-olive-400/50 mb-1">
                <Scale size={14} /> <span className="text-xs">Quantity</span>
              </div>
              <p className="font-semibold text-olive-400">{listing.quantity.toLocaleString()} {listing.unit}</p>
            </div>
            <div className="bg-farm-cream rounded-xl p-4">
              <div className="flex items-center gap-2 text-olive-400/50 mb-1">
                <Tag size={14} /> <span className="text-xs">Quality</span>
              </div>
              <p className="font-semibold text-olive-400">{listing.quality}</p>
            </div>
            <div className="bg-farm-cream rounded-xl p-4">
              <div className="flex items-center gap-2 text-olive-400/50 mb-1">
                <MapPin size={14} /> <span className="text-xs">District</span>
              </div>
              <p className="font-semibold text-olive-400">{listing.district}</p>
            </div>
            <div className="bg-farm-cream rounded-xl p-4">
              <div className="flex items-center gap-2 text-olive-400/50 mb-1">
                <Gavel size={14} /> <span className="text-xs">Total Bids</span>
              </div>
              <p className="font-semibold text-olive-400">{listing.totalBids}</p>
            </div>
          </div>

          {/* Price info */}
          <div className="bg-olive-400/5 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-olive-400 mb-3">Pricing</h4>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-olive-400/50">Minimum Price</p>
                <p className="text-2xl font-bold text-olive-400">
                  Rs. {listing.minPrice.toLocaleString()}
                  <span className="text-sm font-normal text-olive-400/50"> /{listing.priceUnit}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-olive-400/50">Reference Price</p>
                <p className="text-xl font-bold text-rust-400">
                  Rs. {listing.referencePrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Listed date */}
          <div className="flex items-center gap-2 text-sm text-olive-400/50">
            <Calendar size={14} />
            Listed on {listing.listedDate}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CropModal
