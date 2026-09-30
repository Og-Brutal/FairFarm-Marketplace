import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Check, AlertCircle, Loader2 } from 'lucide-react'
import { districts, qualityOptions, cropTypes, cropEmojis } from '../data/mockData'

const AddCropModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    crop: '',
    quantity: '',
    quality: '',
    minPrice: '',
    district: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.crop) newErrors.crop = 'Select a crop'
    if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Enter a valid quantity'
    }
    if (!formData.quality) newErrors.quality = 'Select quality'
    if (!formData.minPrice || isNaN(formData.minPrice) || Number(formData.minPrice) <= 0) {
      newErrors.minPrice = 'Enter a valid price'
    }
    if (!formData.district) newErrors.district = 'Select a district'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newListing = {
      id: Date.now(),
      crop: formData.crop,
      variety: '',
      quantity: Number(formData.quantity),
      unit: 'KG',
      quality: formData.quality,
      district: formData.district,
      province: 'Punjab',
      minPrice: Number(formData.minPrice),
      referencePrice: Math.round(Number(formData.minPrice) * 1.05),
      priceUnit: '40kg',
      biddingStatus: 'OPEN',
      totalBids: 0,
      endTime: Date.now() + 24 * 60 * 60 * 1000,
      listedDate: new Date().toISOString().split('T')[0],
      farmerName: 'Ahmed K.',
      image: cropEmojis[formData.crop] || '🌱',
    }

    setIsSubmitting(false)
    setIsSuccess(true)

    setTimeout(() => {
      onAdd(newListing)
      onClose()
    }, 1200)
  }

  const inputClass = (name) =>
    `fairfarm-input ${errors[name] ? 'border-red-400 focus:ring-red-200' : ''}`

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-sage-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-sage-200/50 flex items-center justify-center">
              <Plus size={20} className="text-olive-400" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-olive-400">Add Crop Listing</h2>
              <p className="text-xs text-olive-400/50">List your harvest on FairFarm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-sage-200/30 transition-colors text-olive-400/60"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-200 flex items-center justify-center"
                >
                  <Check size={30} className="text-olive-400" />
                </motion.div>
                <h3 className="font-serif text-xl text-olive-400 mb-2">Listing Added!</h3>
                <p className="text-sm text-olive-400/60">Your crop listing is now live on FairFarm</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                {/* Crop */}
                <div>
                  <label className="block text-sm font-medium text-olive-400 mb-1.5">Crop Name</label>
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    className={inputClass('crop')}
                  >
                    <option value="">Select crop...</option>
                    {cropTypes.map(c => (
                      <option key={c} value={c}>{cropEmojis[c]} {c}</option>
                    ))}
                  </select>
                  {errors.crop && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.crop}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-olive-400 mb-1.5">Quantity (KG)</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    className={inputClass('quantity')}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.quantity}
                    </p>
                  )}
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-olive-400 mb-1.5">Quality</label>
                  <select
                    name="quality"
                    value={formData.quality}
                    onChange={handleChange}
                    className={inputClass('quality')}
                  >
                    <option value="">Select quality...</option>
                    {qualityOptions.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  {errors.quality && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.quality}
                    </p>
                  )}
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-olive-400 mb-1.5">Minimum Price (Rs. per 40kg)</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={formData.minPrice}
                    onChange={handleChange}
                    placeholder="e.g. 9000"
                    className={inputClass('minPrice')}
                  />
                  {errors.minPrice && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.minPrice}
                    </p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-olive-400 mb-1.5">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={inputClass('district')}
                  >
                    <option value="">Select district...</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.district}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full fairfarm-btn-primary flex items-center justify-center gap-2 !py-3.5 mt-6"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Adding...</>
                  ) : (
                    <><Plus size={18} /> Add Listing</>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AddCropModal
