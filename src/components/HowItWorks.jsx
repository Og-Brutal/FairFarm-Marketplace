import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Wheat, Gavel, Trophy, Truck } from 'lucide-react'

const steps = [
  {
    num: '01',
    title: 'Farmer Lists Crop',
    desc: 'Verified farmers list their harvest with quantity, quality, and minimum acceptable price.',
    icon: Wheat,
    color: 'bg-sage-200',
    iconColor: 'text-olive-400',
  },
  {
    num: '02',
    title: 'Buyers Place Sealed Bids',
    desc: 'Registered buyers submit confidential bids. No buyer sees another\'s offer — ensuring fairness.',
    icon: Gavel,
    color: 'bg-rust-50',
    iconColor: 'text-rust-400',
  },
  {
    num: '03',
    title: 'Highest Valid Bid Wins',
    desc: 'When bidding ends, the highest bid meeting the minimum price wins automatically.',
    icon: Trophy,
    color: 'bg-farm-wheat',
    iconColor: 'text-olive-400',
  },
  {
    num: '04',
    title: 'Order & Delivery',
    desc: 'Winning bid becomes an order. Transport providers handle pickup and delivery tracking.',
    icon: Truck,
    color: 'bg-sage-200',
    iconColor: 'text-olive-400',
  },
]

const HowItWorks = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-sage-200/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-farm-wheat/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-rust-400 uppercase tracking-wider mb-3">The Journey</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-olive-400 mb-4">
            How FairFarm Works
          </h2>
          <p className="text-olive-400/60 max-w-2xl mx-auto">
            From listing to delivery — a transparent process designed to protect farmers and ensure fair market prices.
          </p>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Connecting vertical line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <motion.div
              className="w-full bg-gradient-to-b from-sage-300 via-rust-400/30 to-sage-300 rounded-full"
              initial={{ height: 0 }}
              animate={isInView ? { height: '100%' } : {}}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`relative md:grid md:grid-cols-2 md:gap-16 md:items-center md:py-12 ${
                  i % 2 === 0 ? '' : 'md:direction-rtl'
                }`}
              >
                {/* Step number dot on line */}
                <motion.div
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-sage-300 items-center justify-center z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.3, type: 'spring' }}
                >
                  <span className="text-sm font-bold text-rust-400">{step.num}</span>
                </motion.div>

                {/* Content - alternating sides */}
                <div className={`${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'}`}>
                  <div className={`fairfarm-card p-6 md:p-8 ${i % 2 === 0 ? 'md:ml-auto' : ''} max-w-md ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${step.color} mb-4`}>
                      <step.icon size={28} className={step.iconColor} />
                    </div>
                    <span className="text-xs font-bold text-rust-400 uppercase tracking-wider">Step {step.num}</span>
                    <h3 className="font-serif text-xl md:text-2xl text-olive-400 mt-1 mb-3">{step.title}</h3>
                    <p className="text-olive-400/60 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Empty column for alternating layout */}
                {i % 2 === 0 && <div className="hidden md:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
