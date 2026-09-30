import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'
import { priceHistoryData } from '../data/mockData'

const crops = Object.keys(priceHistoryData)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-sage-100 px-4 py-3">
        <p className="text-sm font-medium text-olive-400">{label}</p>
        <p className="text-lg font-bold text-rust-400">
          Rs. {payload[0].value.toLocaleString()}
        </p>
        <p className="text-xs text-olive-400/50">per 40kg</p>
      </div>
    )
  }
  return null
}

const PriceChart = () => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat')
  const data = priceHistoryData[selectedCrop]
  const latestPrice = data[data.length - 1].price
  const previousPrice = data[data.length - 2].price
  const changePercent = (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(1)

  return (
    <section id="price-transparency" className="py-20 md:py-28 bg-farm-cream relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-semibold text-rust-400 uppercase tracking-wider mb-3">Transparency</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-olive-400 mb-4">
            Price History & Trends
          </h2>
          <p className="text-olive-400/60 max-w-2xl mx-auto">
            Track reference prices across major crops. Market officers publish verified prices to help farmers make informed decisions.
          </p>
          <p className="text-xs text-olive-400/40 mt-2">Mock data for Phase 1 prototype</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-sage-100 shadow-sm p-6 md:p-8"
        >
          {/* Crop selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {crops.map((crop) => (
                  <motion.button
                    key={crop}
                    onClick={() => setSelectedCrop(crop)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCrop === crop
                        ? 'bg-olive-400 text-white shadow-md'
                        : 'bg-sage-200/30 text-olive-400 hover:bg-sage-200/50'
                    }`}
                  >
                    {crop}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-olive-400">
                  Rs. {latestPrice.toLocaleString()}
                </p>
                <div className={`flex items-center gap-1 text-sm font-medium justify-end ${
                  changePercent >= 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  <TrendingUp size={14} />
                  {changePercent >= 0 ? '+' : ''}{changePercent}% from last month
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#853D25" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#853D25" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D1E2C4" strokeOpacity={0.5} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#555424', fontSize: 13 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#555424', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  domain={['dataMin - 500', 'dataMax + 500']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#853D25"
                  strokeWidth={3}
                  fill="url(#priceGradient)"
                  dot={{ fill: '#853D25', strokeWidth: 2, r: 5, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#853D25', stroke: '#fff', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PriceChart
