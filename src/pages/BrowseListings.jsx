import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, SlidersHorizontal, ArrowUpDown,
  MapPin, Clock, Tag, Eye, X, Package,
  CheckCircle, TrendingUp, AlertCircle, Loader2,
  Wifi, WifiOff, RefreshCw, Gavel
} from 'lucide-react';
import { cropListings as seedListings, cropTypes, cropEmojis, qualityOptions } from '../data/mockData';
import api from '../services/api';

const BrowseListings = ({ currentUser }) => {
  // ── Data state ────────────────────────────────────────────────────────────
  const [allListings, setAllListings] = useState(seedListings);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // ── Filter / sort state ───────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropType, setSelectedCropType] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // ── Modal state ───────────────────────────────────────────────────────────
  const [selectedListing, setSelectedListing] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [bidMsg, setBidMsg] = useState(null);

  // ── Fetch listings from backend ───────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await api.getListings();
      setAllListings(data.listings || []);
      setIsBackendOnline(true);
    } catch {
      // Fallback to mock seed data
      setAllListings(seedListings);
      setIsBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Active filter chips ───────────────────────────────────────────────────
  const activeFilters = useMemo(() => {
    const f = [];
    if (searchTerm) f.push({ type: 'search', label: `Search: "${searchTerm}"` });
    if (selectedCropType !== 'All') f.push({ type: 'cropType', label: `Type: ${selectedCropType}` });
    if (selectedQuality !== 'All') f.push({ type: 'quality', label: `Quality: ${selectedQuality}` });
    if (selectedStatus !== 'All') f.push({ type: 'status', label: `Status: ${selectedStatus}` });
    return f;
  }, [searchTerm, selectedCropType, selectedQuality, selectedStatus]);

  const removeFilter = (type) => {
    if (type === 'search') setSearchTerm('');
    if (type === 'cropType') setSelectedCropType('All');
    if (type === 'quality') setSelectedQuality('All');
    if (type === 'status') setSelectedStatus('All');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCropType('All');
    setSelectedQuality('All');
    setSelectedStatus('All');
    setSortBy('Newest');
  };

  // ── Client-side filter + sort (works for both live and seed data) ─────────
  const filteredListings = useMemo(() => {
    let result = [...allListings];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          (l.crop || '').toLowerCase().includes(q) ||
          (l.variety || '').toLowerCase().includes(q) ||
          (l.district || '').toLowerCase().includes(q)
      );
    }
    if (selectedCropType !== 'All') {
      result = result.filter((l) => l.crop === selectedCropType);
    }
    if (selectedQuality !== 'All') {
      result = result.filter((l) => l.quality === selectedQuality);
    }
    if (selectedStatus !== 'All') {
      result = result.filter(
        (l) => (l.biddingStatus || l.status) === selectedStatus
      );
    }

    result.sort((a, b) => {
      const pa = a.minPrice || 0;
      const pb = b.minPrice || 0;
      const ba = a.totalBids || 0;
      const bb = b.totalBids || 0;
      switch (sortBy) {
        case 'Price Low-High': return pa - pb;
        case 'Price High-Low': return pb - pa;
        case 'Most Bids':     return bb - ba;
        default:              return (b.id || 0) - (a.id || 0);
      }
    });
    return result;
  }, [allListings, searchTerm, selectedCropType, selectedQuality, selectedStatus, sortBy]);

  // ── Bid handler ───────────────────────────────────────────────────────────
  const handlePlaceBid = async () => {
    if (!currentUser) {
      setBidMsg({ type: 'error', text: 'Please log in to place a bid.' });
      return;
    }
    const amount = Number(bidAmount);
    if (!amount || amount <= 0) {
      setBidMsg({ type: 'error', text: 'Enter a valid bid amount.' });
      return;
    }
    if (amount < selectedListing.minPrice) {
      setBidMsg({
        type: 'error',
        text: `Bid must be at least PKR ${selectedListing.minPrice?.toLocaleString()}.`,
      });
      return;
    }

    setIsBidding(true);
    setBidMsg(null);
    try {
      if (isBackendOnline) {
        await api.placeBid(selectedListing.id, amount, currentUser);
      }
      // Optimistic update
      setAllListings((prev) =>
        prev.map((l) =>
          l.id === selectedListing.id
            ? { ...l, totalBids: (l.totalBids || 0) + 1 }
            : l
        )
      );
      setSelectedListing((prev) => ({ ...prev, totalBids: (prev.totalBids || 0) + 1 }));
      setBidMsg({ type: 'success', text: `✅ Bid of PKR ${amount.toLocaleString()} placed!` });
      setBidAmount('');
    } catch (err) {
      setBidMsg({ type: 'error', text: err.message });
    } finally {
      setIsBidding(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(n || 0);

  const getStatusClass = (status) => {
    switch (status) {
      case 'OPEN':   return 'bg-green-100 text-green-800 border-green-200';
      case 'ENDED':  return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SOLD':   return 'bg-blue-100 text-blue-800 border-blue-200';
      default:       return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-farm-cream p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-olive-400 mb-2">Browse Crop Listings</h1>
            <p className="text-gray-600">Discover fresh produce directly from farmers across Pakistan.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Backend status */}
            <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
              isBackendOnline
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {isBackendOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isBackendOnline ? 'Live data' : 'Offline (mock)'}
            </span>

            {/* Refresh */}
            <button
              onClick={fetchListings}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>

            {/* Count badge */}
            <div className="text-sm font-medium text-olive-400 bg-sage-200/30 px-4 py-2 rounded-full border border-sage-200/50">
              {filteredListings.length} {filteredListings.length === 1 ? 'Listing' : 'Listings'}
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="fairfarm-card p-4 md:p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by crop name, variety, or district..."
              className="fairfarm-input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <Filter className="w-3 h-3" /> Crop Type
              </label>
              <select
                className="fairfarm-input w-full cursor-pointer"
                value={selectedCropType}
                onChange={(e) => setSelectedCropType(e.target.value)}
              >
                <option value="All">All Types</option>
                {cropTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Quality
              </label>
              <select
                className="fairfarm-input w-full cursor-pointer"
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
              >
                <option value="All">All Qualities</option>
                {qualityOptions.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <Tag className="w-3 h-3" /> Status
              </label>
              <select
                className="fairfarm-input w-full cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="ENDED">Ended</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Sort By
              </label>
              <select
                className="fairfarm-input w-full cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Newest">Newest</option>
                <option value="Price Low-High">Price: Low to High</option>
                <option value="Price High-Low">Price: High to Low</option>
                <option value="Most Bids">Most Bids</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap items-center gap-2 pt-2"
              >
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <SlidersHorizontal className="w-4 h-4" /> Active Filters:
                </span>
                {activeFilters.map((f) => (
                  <motion.span
                    key={f.type}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1 bg-white border border-olive-400/30 text-olive-400 text-sm px-3 py-1 rounded-full shadow-sm"
                  >
                    {f.label}
                    <button
                      onClick={() => removeFilter(f.type)}
                      className="hover:text-rust-400 hover:bg-rust-400/10 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                <button onClick={clearAllFilters} className="text-sm text-rust-400 hover:underline ml-2">
                  Clear All
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="fairfarm-card p-5 animate-pulse space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredListings.map((listing) => (
              <motion.div
                key={listing.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="fairfarm-card overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="p-5 flex-grow space-y-4">
                  {/* Card header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl bg-sage-200/20 w-16 h-16 rounded-2xl flex items-center justify-center border border-sage-200/50 group-hover:scale-105 transition-transform">
                        {cropEmojis[listing.crop] || listing.image || '🌾'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-olive-400">{listing.crop}</h3>
                        <p className="text-sm text-gray-500 font-medium">{listing.variety}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusClass(listing.biddingStatus || listing.status)}`}>
                      {listing.biddingStatus || listing.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rust-400" /> District</span>
                      <span className="font-medium text-gray-800">{listing.district}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5"><Package className="w-4 h-4 text-olive-400" /> Quantity</span>
                      <span className="font-medium text-gray-800">{listing.quantity} {listing.unit || 'KG'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-sage-300" /> Quality</span>
                      <span className="font-medium text-gray-800 bg-gray-100 px-2 rounded-md">{listing.quality}</span>
                    </div>
                  </div>

                  {/* Price & bids */}
                  <div className="bg-sage-200/10 p-3 rounded-xl border border-sage-200/30 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Starting Price</p>
                      <p className="text-lg font-bold text-olive-400">{formatCurrency(listing.minPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">Bids</p>
                      <p className="text-sm font-bold text-rust-400 flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {listing.totalBids || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => { setSelectedListing(listing); setBidMsg(null); setBidAmount(''); }}
                    className="w-full fairfarm-btn-outline flex items-center justify-center gap-2 group-hover:bg-olive-400 group-hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    Listed on {listing.listedDate ? new Date(listing.listedDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fairfarm-card p-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="bg-rust-400/10 p-4 rounded-full">
              <AlertCircle className="w-12 h-12 text-rust-400" />
            </div>
            <h2 className="text-2xl font-bold text-olive-400">No listings found</h2>
            <p className="text-gray-500 max-w-md">
              We couldn't find any crop listings matching your search and filter criteria.
            </p>
            <button onClick={clearAllFilters} className="fairfarm-btn-primary mt-4">
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Listing Detail Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedListing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-farm-cream">
                <div className="flex gap-4 items-center">
                  <div className="text-5xl bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    {cropEmojis[selectedListing.crop] || selectedListing.image || '🌾'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-olive-400">{selectedListing.crop}</h2>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusClass(selectedListing.biddingStatus || selectedListing.status)}`}>
                        {selectedListing.biddingStatus || selectedListing.status}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium">{selectedListing.variety}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-rust-400" /> {selectedListing.district}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="p-2 text-gray-400 hover:text-rust-400 hover:bg-rust-400/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Quantity', value: `${selectedListing.quantity} ${selectedListing.unit || 'KG'}` },
                    { label: 'Quality', value: selectedListing.quality },
                    { label: 'Crop Type', value: selectedListing.crop },
                    { label: 'Total Bids', value: selectedListing.totalBids || 0 },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="font-semibold text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {selectedListing.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-olive-400 mb-2 border-b pb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{selectedListing.description}</p>
                  </div>
                )}

                {/* Reference price */}
                {selectedListing.referencePrice && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span>Official Market Reference Price: <strong>PKR {selectedListing.referencePrice?.toLocaleString()}</strong> per {selectedListing.priceUnit || '40kg'}</span>
                  </div>
                )}

                {/* Pricing */}
                <div className="bg-sage-200/10 p-5 rounded-2xl border border-sage-200/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Asking Price</p>
                    <p className="text-3xl font-bold text-olive-400">{formatCurrency(selectedListing.minPrice)}</p>
                  </div>
                  <div className="text-right sm:text-left text-sm text-gray-500 space-y-1">
                    <p><span className="font-medium">Listed:</span> {selectedListing.listedDate ? new Date(selectedListing.listedDate).toLocaleDateString() : 'N/A'}</p>
                    <p><span className="font-medium">Farmer:</span> {selectedListing.farmerName || 'Verified Farmer'}</p>
                  </div>
                </div>

                {/* Place Bid section — only if OPEN */}
                {(selectedListing.biddingStatus === 'OPEN' || selectedListing.status === 'OPEN') && (
                  <div className="border border-olive-400/20 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-olive-400 flex items-center gap-2">
                      <Gavel className="w-4 h-4 text-rust-400" /> Place a Bid
                    </h3>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Min PKR ${selectedListing.minPrice?.toLocaleString()}`}
                        className="fairfarm-input flex-1"
                        min={selectedListing.minPrice}
                      />
                      <motion.button
                        onClick={handlePlaceBid}
                        disabled={isBidding}
                        whileHover={{ scale: isBidding ? 1 : 1.02 }}
                        whileTap={{ scale: isBidding ? 1 : 0.98 }}
                        className="fairfarm-btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
                      >
                        {isBidding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />}
                        {isBidding ? 'Placing...' : 'Bid Now'}
                      </motion.button>
                    </div>
                    {bidMsg && (
                      <p className={`text-sm font-medium ${bidMsg.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                        {bidMsg.text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button onClick={() => setSelectedListing(null)} className="fairfarm-btn-outline">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BrowseListings;
