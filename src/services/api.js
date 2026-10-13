/**
 * FairFarm API Service
 * Connects the React frontend to the FastAPI backend at http://localhost:8000
 *
 * Usage:
 *   import api from '../services/api'
 *   const { listings } = await api.getListings()
 *   const { user } = await api.login(email, password)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Build common request headers from the current user context.
 * We use simple custom headers (X-User-Role, X-User-Name, X-User-Id)
 * instead of JWT tokens for this academic demo.
 */
function buildHeaders(user = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (user) {
    headers['X-User-Role'] = user.role || 'Farmer'
    headers['X-User-Name'] = user.name || ''
    headers['X-User-Id'] = user.id || ''
  }
  return headers
}

/**
 * Generic fetch wrapper — throws on HTTP errors.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, options)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.detail || `HTTP ${res.status}: ${res.statusText}`
    throw new Error(msg)
  }
  return data
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  return request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

// ─── Listings ─────────────────────────────────────────────────────────────────

/**
 * Fetch listings with optional filter/sort params.
 * @param {object} params - { crop, quality, status, district, search, sort }
 */
export async function getListings(params = {}) {
  const qs = new URLSearchParams()
  if (params.crop && params.crop !== 'All') qs.set('crop', params.crop)
  if (params.quality && params.quality !== 'All') qs.set('quality', params.quality)
  if (params.status && params.status !== 'All') qs.set('status', params.status)
  if (params.district && params.district !== 'All') qs.set('district', params.district)
  if (params.search) qs.set('search', params.search)
  if (params.sort) qs.set('sort', params.sort)
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return request(`/api/listings${query}`)
}

export async function getListing(id) {
  return request(`/api/listings/${id}`)
}

/**
 * Create a new crop listing (Farmer / Officer).
 * @param {object} listingData - form fields
 * @param {object} user - current logged-in user
 */
export async function createListing(listingData, user) {
  return request('/api/listings', {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify(listingData),
  })
}

export async function deleteListing(id, user) {
  return request(`/api/listings/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(user),
  })
}

// ─── Bidding ─────────────────────────────────────────────────────────────────

export async function placeBid(listingId, bidAmount, user) {
  return request(`/api/listings/${listingId}/bid`, {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify({ listingId, bidAmount }),
  })
}

export async function getBids(listingId, user) {
  return request(`/api/listings/${listingId}/bids`, {
    headers: buildHeaders(user),
  })
}

// ─── Reference Prices ────────────────────────────────────────────────────────

export async function getReferencePrices() {
  return request('/api/reference-prices')
}

export async function updateReferencePrice(crop, price, user) {
  return request('/api/officer/reference-prices', {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify({ crop, price }),
  })
}

// ─── KYC ─────────────────────────────────────────────────────────────────────

export async function getPendingFarmers(user) {
  return request('/api/officer/pending-farmers', {
    headers: buildHeaders(user),
  })
}

export async function verifyFarmer(farmerId, status, reason, user) {
  return request('/api/officer/verify-farmer', {
    method: 'POST',
    headers: buildHeaders(user),
    body: JSON.stringify({ farmerId, status, reason }),
  })
}

// ─── Farmer Stats ─────────────────────────────────────────────────────────────

export async function getFarmerStats(user) {
  return request('/api/farmer/stats', {
    headers: buildHeaders(user),
  })
}

// ─── Default export ───────────────────────────────────────────────────────────

const api = {
  login,
  getListings,
  getListing,
  createListing,
  deleteListing,
  placeBid,
  getBids,
  getReferencePrices,
  updateReferencePrice,
  getPendingFarmers,
  verifyFarmer,
  getFarmerStats,
}

export default api
