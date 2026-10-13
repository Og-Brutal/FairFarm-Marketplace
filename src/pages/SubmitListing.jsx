import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Check, AlertCircle, Package, MapPin, DollarSign, FileText,
  Wheat, Leaf, Scale, Award, Loader2, Wifi, WifiOff, RefreshCw
} from 'lucide-react';
import { cropTypes, cropEmojis, districts, qualityOptions } from '../data/mockData';
import api from '../services/api';

const SubmitListing = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    crop: '',
    variety: '',
    quantity: '',
    unit: 'KG',
    quality: '',
    district: '',
    province: 'Punjab',
    minPrice: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submittedListings, setSubmittedListings] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Listing submitted successfully!');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(null); // null = checking

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:8000/');
        setIsBackendOnline(res.ok);
      } catch {
        setIsBackendOnline(false);
      }
    };
    checkBackend();
  }, []);

  const units = ['KG', '40kg (Maund)', 'Tons'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.crop) newErrors.crop = 'Crop type is required';
    if (!formData.variety || formData.variety.length < 2)
      newErrors.variety = 'Variety name must be at least 2 characters';
    if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) <= 0)
      newErrors.quantity = 'Quantity must be a positive number';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.quality) newErrors.quality = 'Quality grade is required';
    if (!formData.minPrice || isNaN(formData.minPrice) || Number(formData.minPrice) <= 0)
      newErrors.minPrice = 'Minimum price must be a positive number';
    if (formData.description && formData.description.length < 10)
      newErrors.description = 'Description must be at least 10 characters if provided';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const showNotification = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      crop: formData.crop,
      variety: formData.variety,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      quality: formData.quality,
      district: formData.district,
      province: formData.province,
      minPrice: Number(formData.minPrice),
      description: formData.description,
    };

    try {
      if (isBackendOnline) {
        // POST to real backend
        const result = await api.createListing(payload, currentUser);
        const newListing = result.listing;
        setSubmittedListings((prev) => [newListing, ...prev]);
        showNotification('✅ Listing submitted to backend successfully!', 'success');
      } else {
        // Fallback: local mock
        const newListing = {
          ...payload,
          id: Date.now(),
          biddingStatus: 'OPEN',
          totalBids: 0,
          listedDate: new Date().toISOString().split('T')[0],
          image: cropEmojis[formData.crop] || '🌾',
          farmerName: currentUser?.name || 'Ahmed K.',
        };
        setSubmittedListings((prev) => [newListing, ...prev]);
        showNotification('📋 Listing saved locally (backend offline).', 'success');
      }

      // Reset form
      setFormData({
        crop: '', variety: '', quantity: '', unit: 'KG',
        quality: '', district: '', province: 'Punjab', minPrice: '', description: '',
      });
    } catch (err) {
      showNotification(`❌ Error: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-padding max-w-7xl mx-auto min-h-screen py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-olive-400 mb-2">Submit New Crop Listing</h1>
          <p className="text-gray-600">
            List your produce on the FairFarm marketplace — reach buyers across Pakistan.
          </p>
        </div>

        {/* Backend status indicator */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
          isBackendOnline === null
            ? 'bg-gray-100 text-gray-500 border-gray-200'
            : isBackendOnline
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {isBackendOnline === null ? (
            <><Loader2 size={14} className="animate-spin" /> Checking backend...</>
          ) : isBackendOnline ? (
            <><Wifi size={14} /> Backend Connected</>
          ) : (
            <><WifiOff size={14} /> Offline (local mode)</>
          )}
          <button
            onClick={() => {
              setIsBackendOnline(null);
              fetch('http://localhost:8000/').then(r => setIsBackendOnline(r.ok)).catch(() => setIsBackendOnline(false));
            }}
            className="ml-1 hover:opacity-70"
            title="Re-check connection"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 text-sm font-medium ${
              toastType === 'success'
                ? 'bg-sage-200 border border-olive-400 text-olive-400'
                : 'bg-red-50 border border-red-400 text-red-700'
            }`}
          >
            {toastType === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 fairfarm-card"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-olive-400 border-b border-gray-200 pb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-rust-400" />
              Produce Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crop Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-olive-400" /> Crop Type *
                </label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className={`fairfarm-input w-full ${errors.crop ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select a crop</option>
                  {cropTypes.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop} {cropEmojis[crop]}
                    </option>
                  ))}
                </select>
                {errors.crop && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.crop}
                  </p>
                )}
              </div>

              {/* Variety Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-olive-400" /> Variety Name *
                </label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  placeholder="e.g. Basmati Super"
                  className={`fairfarm-input w-full ${errors.variety ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.variety && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.variety}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-olive-400" /> Quantity *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="1"
                    className={`fairfarm-input flex-1 ${errors.quantity ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="fairfarm-input w-1/3"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.quantity && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.quantity}
                  </p>
                )}
              </div>

              {/* Quality Grade */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Award className="w-4 h-4 text-olive-400" /> Quality Grade *
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  className={`fairfarm-input w-full ${errors.quality ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select quality</option>
                  {qualityOptions.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
                {errors.quality && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.quality}
                  </p>
                )}
              </div>

              {/* Minimum Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-olive-400" /> Minimum Price (PKR) *
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="1"
                  className={`fairfarm-input w-full ${errors.minPrice ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.minPrice && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.minPrice}
                  </p>
                )}
              </div>

              {/* District */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-olive-400" /> District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`fairfarm-input w-full ${errors.district ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select district</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.district}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-olive-400" /> Additional Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Any special notes about the crop quality, location, or payment preferences..."
                rows="3"
                className={`fairfarm-input w-full resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="fairfarm-btn-primary flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Plus className="w-5 h-5" /> Submit Listing</>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Session Listings Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col h-full">
            <h2 className="text-xl font-semibold text-olive-400 border-b border-gray-200 pb-4 flex justify-between items-center mb-4">
              Session Listings
              <span className="bg-sage-200 text-olive-400 text-sm font-bold px-3 py-1 rounded-full">
                {submittedListings.length}
              </span>
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[600px]">
              <AnimatePresence>
                {submittedListings.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 px-4 h-full flex flex-col justify-center items-center"
                  >
                    <div className="bg-farm-cream p-4 rounded-full mb-4">
                      <Package className="w-12 h-12 text-rust-400 opacity-50" />
                    </div>
                    <p className="text-gray-500 font-medium">No listings submitted yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Fill the form to add your first crop listing.
                    </p>
                  </motion.div>
                ) : (
                  submittedListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-rust-400" />
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{listing.image || cropEmojis[listing.crop] || '🌾'}</span>
                          <div>
                            <h3 className="font-bold text-gray-800">{listing.crop}</h3>
                            <p className="text-xs text-gray-500">{listing.variety}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 bg-yellow-100 text-yellow-800 rounded uppercase tracking-wider">
                          {listing.biddingStatus || 'PENDING'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Scale className="w-3 h-3 text-olive-400" />
                          <span>{listing.quantity} {listing.unit}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <DollarSign className="w-3 h-3 text-olive-400" />
                          <span>PKR {listing.minPrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin className="w-3 h-3 text-olive-400" />
                          <span className="truncate">{listing.district}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Award className="w-3 h-3 text-olive-400" />
                          <span className="truncate">{listing.quality}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitListing;
