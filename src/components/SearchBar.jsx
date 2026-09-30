import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

const SearchBar = ({ value, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search crops..."
        className="fairfarm-input pl-11 pr-10"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-olive-400 transition-colors"
        >
          <X size={16} />
        </motion.button>
      )}
    </motion.div>
  )
}

export default SearchBar
