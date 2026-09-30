import { motion } from 'framer-motion'

const SplashScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-farm-cream overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle decorative elements */}
      <div className="absolute inset-0">
        {/* Organic curved shapes in background */}
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-sage-200/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-sage-200/15"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
        />
        <motion.div
          className="absolute top-1/4 left-10 w-3 h-3 rounded-full bg-olive-400/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], y: [-20, 0, -20] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-16 w-2 h-2 rounded-full bg-rust-400/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
        />
      </div>

      {/* Center logo container */}
      <div className="relative flex flex-col items-center">
        {/* Glow ring behind logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.3, 0.1], scale: [0.8, 1.2, 1.15] }}
          transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
        >
          <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-sage-200/30 blur-xl" />
        </motion.div>

        {/* Logo */}
        <motion.img
          src="/FairFarm_Logo.png"
          alt="FairFarm"
          className="w-56 h-56 md:w-64 md:h-64 object-contain relative z-10"
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />

        {/* Subtle line below logo */}
        <motion.div
          className="mt-6 h-0.5 bg-gradient-to-r from-transparent via-olive-400/40 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 120, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        />
      </div>
    </motion.div>
  )
}

export default SplashScreen
