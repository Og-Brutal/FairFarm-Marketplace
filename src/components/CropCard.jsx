import { motion } from 'framer-motion'
import { MapPin, Scale, Tag, Gavel } from 'lucide-react'
import Countdown from './Countdown'

const statusColors = {
  OPEN: 'bg-green-100 text-green-700',
  ENDED: 'bg-neutral-200 text-neutral-600',
  SOLD: 'bg-rust-50 text-rust-400',
}

const CropCard = ({ listing, onClick, onStatusChange }) => {
  const handleCountdownEnd = () => {
    if (onStatusChange) {
      onStatusChange(listing.id, 'ENDED')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
        y: { duration: 0.25 },
      }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
      onClick={() => onClick && onClick(listing)}
      className="bg-white rounded-xl border border-sage-100 overflow-hidden cursor-pointer group hover:shadow-md hover:border-sage-200"
    >
      {/* Top bar with crop emoji and status */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{listing.image}</div>
          <div>
            <h3 className="font-semibold text-lg text-olive-400 group-hover:text-rust-400 transition-colors">
              {listing.crop}
            </h3>
            <p className="text-xs text-olive-400/50">{listing.variety}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[listing.biddingStatus] || statusColors.OPEN}`}>
          {listing.biddingStatus}
        </span>
      </div>

      {/* Details */}
      <div className="px-5 pb-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-olive-400/70">
            <Scale size={14} className="text-sage-300" />
            <span>{listing.quantity.toLocaleString()} {listing.unit}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-olive-400/70">
            <MapPin size={14} className="text-sage-300" />
            <span>{listing.district}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-olive-400/70">
            <Tag size={14} className="text-sage-300" />
            <span>{listing.quality}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-olive-400/70">
            <Gavel size={14} className="text-sage-300" />
            <span>{listing.totalBids} bids</span>
          </div>
        </div>

        {/* Price section */}
        <div className="pt-3 border-t border-sage-100/50">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-olive-400/50 mb-0.5">Min Price</p>
              <p className="text-lg font-bold text-olive-400">
                Rs. {listing.minPrice.toLocaleString()}
                <span className="text-xs font-normal text-olive-400/50"> /{listing.priceUnit}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-olive-400/50 mb-0.5">Ref. Price</p>
              <p className="text-sm font-semibold text-rust-400">
                Rs. {listing.referencePrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Countdown / Time */}
        {listing.biddingStatus === 'OPEN' && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-olive-400/50">Ends in</span>
            <Countdown endTime={listing.endTime} onEnd={handleCountdownEnd} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CropCard
