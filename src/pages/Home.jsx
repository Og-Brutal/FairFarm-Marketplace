import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import MarketActivity from '../components/MarketActivity'
import HowItWorks from '../components/HowItWorks'
import PriceChart from '../components/PriceChart'

const Home = ({ isAuthenticated }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero isAuthenticated={isAuthenticated} />
      <MarketActivity />
      <HowItWorks />
      <PriceChart />
    </motion.div>
  )
}

export default Home
