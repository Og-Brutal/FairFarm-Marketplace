import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { marketActivity } from '../data/mockData'

const MarketActivity = () => {
  const [prices, setPrices] = useState(marketActivity)

  // Simulate small price fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(item => {
        const fluctuation = (Math.random() - 0.5) * 100
        const newPrice = Math.round(item.price + fluctuation)
        const newChange = parseFloat((((newPrice - item.price) / item.price) * 100 + item.change).toFixed(1))
        return { ...item, price: newPrice, change: newChange }
      }))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 bg-olive-400/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <Activity size={20} className="text-rust-400" />
          <h3 className="text-sm font-semibold text-olive-400 uppercase tracking-wider">Market Activity</h3>
          <span className="text-xs text-olive-400/40">Mock data for prototype</span>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {prices.map((item, i) => (
            <motion.div
              key={item.crop}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(85,84,36,0.1)' }}
              className="bg-white rounded-xl border border-sage-100 p-4 cursor-default"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-semibold text-olive-400">{item.crop}</span>
              </div>
              <motion.p
                key={item.price}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold text-olive-400"
              >
                Rs. {item.price.toLocaleString()}
              </motion.p>
              <p className="text-xs text-olive-400/50">per {item.unit}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                item.change >= 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.change >= 0 ? '+' : ''}{item.change}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MarketActivity
