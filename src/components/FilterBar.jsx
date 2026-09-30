import { motion } from 'framer-motion'

const filters = [
  { key: 'all', label: 'All Listings' },
  { key: 'OPEN', label: 'Active Bids' },
  { key: 'ending', label: 'Ending Soon' },
  { key: 'SOLD', label: 'Sold' },
  { key: 'ENDED', label: 'Ended' },
]

const FilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap gap-2"
    >
      {filters.map((filter) => (
        <motion.button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === filter.key
              ? 'bg-olive-400 text-white shadow-md'
              : 'bg-sage-200/30 text-olive-400 hover:bg-sage-200/50'
          }`}
        >
          {filter.label}
        </motion.button>
      ))}
    </motion.div>
  )
}

export default FilterBar
