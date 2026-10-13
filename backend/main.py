"""
FairFarm Marketplace — Full Backend API
FastAPI + In-Memory Store | SSD Semester Project
Implements: Auth, RBAC, CRUD Listings, Bidding, KYC Verification, Reference Prices
"""

import uvicorn
from fastapi import FastAPI, HTTPException, Header, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import time

# ─── App Init ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="FairFarm Marketplace API",
    description=(
        "Secure role-based backend for FairFarm — Pakistan's farmer marketplace.\n\n"
        "**Roles:** Farmer · Market Officer · Buyer\n\n"
        "**Security Controls:** RBAC (HTTP 403), PII Masking (CNIC/Phone), "
        "Role-based header auth, Input validation"
    ),
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Restrict to frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-Memory Databases ──────────────────────────────────────────────────────

DEMO_USERS: dict = {
    "farmer@fairfarm.pk": {
        "id": "u1",
        "email": "farmer@fairfarm.pk",
        "password": "password123",
        "name": "Ahmed Khan",
        "role": "Farmer",
        "district": "Faisalabad",
        "verificationStatus": "VERIFIED",
        "cnic": "35202-1234567-1",
        "phone": "0300-1234567",
        "avatar": "👨‍🌾",
    },
    "officer@fairfarm.pk": {
        "id": "u2",
        "email": "officer@fairfarm.pk",
        "password": "password123",
        "name": "Tariq Mahmood",
        "role": "Market Officer",
        "district": "Faisalabad Market Board",
        "verificationStatus": "VERIFIED",
        "cnic": "35201-5554321-9",
        "phone": "0321-9988776",
        "avatar": "🛡️",
    },
    "buyer@fairfarm.pk": {
        "id": "u3",
        "email": "buyer@fairfarm.pk",
        "password": "password123",
        "name": "Bilal Traders",
        "role": "Buyer",
        "district": "Lahore",
        "verificationStatus": "VERIFIED",
        "cnic": "35202-7776655-3",
        "phone": "0345-4433221",
        "avatar": "🏪",
    },
}

PENDING_FARMERS: list = [
    {
        "id": "f_101",
        "name": "Mohammad Rashid",
        "email": "rashid@fairfarm.pk",
        "phone": "0301-9876543",
        "cnic": "35201-9876543-5",
        "district": "Multan",
        "landRecordNo": "FARD-2026-8891",
        "submittedDate": "2026-10-04",
        "status": "PENDING_VERIFICATION",
    },
    {
        "id": "f_102",
        "name": "Sultan Ali",
        "email": "sultan@fairfarm.pk",
        "phone": "0303-1122334",
        "cnic": "35203-1122334-7",
        "district": "Gujranwala",
        "landRecordNo": "FARD-2026-9902",
        "submittedDate": "2026-10-05",
        "status": "PENDING_VERIFICATION",
    },
    {
        "id": "f_103",
        "name": "Ghulam Nabi",
        "email": "ghulam@fairfarm.pk",
        "phone": "0305-6677889",
        "cnic": "35204-6677889-3",
        "district": "Sahiwal",
        "landRecordNo": "FARD-2026-7734",
        "submittedDate": "2026-10-03",
        "status": "PENDING_VERIFICATION",
    },
]

REFERENCE_PRICES: list = [
    {"crop": "Wheat", "price": 9200, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-05"},
    {"crop": "Rice", "price": 11500, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-05"},
    {"crop": "Cotton", "price": 18400, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-04"},
    {"crop": "Maize", "price": 4800, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-03"},
    {"crop": "Sugarcane", "price": 380, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-02"},
]

# Seed with realistic listings
_now = time.time()
CROP_LISTINGS: list = [
    {
        "id": 1,
        "crop": "Wheat",
        "variety": "Faisalabad-2008",
        "quantity": 500,
        "unit": "KG",
        "quality": "Premium",
        "district": "Faisalabad",
        "province": "Punjab",
        "minPrice": 9000,
        "referencePrice": 9200,
        "priceUnit": "40kg",
        "description": "Sun-dried premium wheat. Fresh harvest, low moisture content.",
        "biddingStatus": "OPEN",
        "totalBids": 4,
        "endTime": int((_now + 2 * 3600 + 18 * 60) * 1000),
        "listedDate": "2026-09-28",
        "farmerName": "Ahmed K.",
        "farmerId": "u1",
        "image": "🌾",
    },
    {
        "id": 2,
        "crop": "Rice",
        "variety": "Basmati Super",
        "quantity": 1200,
        "unit": "KG",
        "quality": "Premium",
        "district": "Gujranwala",
        "province": "Punjab",
        "minPrice": 11000,
        "referencePrice": 11500,
        "priceUnit": "40kg",
        "description": "Aromatic Basmati Super. Extra-long grain, suitable for export.",
        "biddingStatus": "OPEN",
        "totalBids": 7,
        "endTime": int((_now + 5 * 3600 + 42 * 60) * 1000),
        "listedDate": "2026-09-27",
        "farmerName": "Ahmed K.",
        "farmerId": "u1",
        "image": "🍚",
    },
    {
        "id": 3,
        "crop": "Cotton",
        "variety": "BT-886",
        "quantity": 800,
        "unit": "KG",
        "quality": "Grade A",
        "district": "Multan",
        "province": "Punjab",
        "minPrice": 18000,
        "referencePrice": 18400,
        "priceUnit": "40kg",
        "description": "BT Cotton variety. High ginning out-turn. Clean and well-sorted.",
        "biddingStatus": "OPEN",
        "totalBids": 3,
        "endTime": int((_now + 1 * 3600 + 5 * 60) * 1000),
        "listedDate": "2026-09-29",
        "farmerName": "Ahmed K.",
        "farmerId": "u1",
        "image": "🏵️",
    },
    {
        "id": 4,
        "crop": "Maize",
        "variety": "Hybrid-3335",
        "quantity": 2000,
        "unit": "KG",
        "quality": "Standard",
        "district": "Sahiwal",
        "province": "Punjab",
        "minPrice": 4500,
        "referencePrice": 4800,
        "priceUnit": "40kg",
        "description": "Hybrid maize, suitable for poultry feed and flour milling.",
        "biddingStatus": "ENDED",
        "totalBids": 5,
        "endTime": int((_now - 3600) * 1000),
        "listedDate": "2026-09-25",
        "farmerName": "Ahmed K.",
        "farmerId": "u1",
        "image": "🌽",
    },
    {
        "id": 5,
        "crop": "Sugarcane",
        "variety": "CP-77/400",
        "quantity": 5000,
        "unit": "KG",
        "quality": "Premium",
        "district": "Rahim Yar Khan",
        "province": "Punjab",
        "minPrice": 350,
        "referencePrice": 380,
        "priceUnit": "40kg",
        "description": "High Brix sugarcane from Rahim Yar Khan. Sold in bulk.",
        "biddingStatus": "SOLD",
        "totalBids": 9,
        "endTime": int((_now - 86400) * 1000),
        "listedDate": "2026-09-20",
        "farmerName": "Ahmed K.",
        "farmerId": "u1",
        "image": "🎋",
    },
    {
        "id": 6,
        "crop": "Tomatoes",
        "variety": "Roma",
        "quantity": 300,
        "unit": "KG",
        "quality": "Grade A",
        "district": "Swat",
        "province": "KPK",
        "minPrice": 2800,
        "referencePrice": 3100,
        "priceUnit": "40kg",
        "description": "Roma tomatoes from Swat valley. Fresh, firm, and bright red.",
        "biddingStatus": "OPEN",
        "totalBids": 2,
        "endTime": int((_now + 8 * 3600) * 1000),
        "listedDate": "2026-09-30",
        "farmerName": "Ahmed K.",
        "farmerId": "u1",
        "image": "🍅",
    },
    {
        "id": 7,
        "crop": "Potatoes",
        "variety": "Desiree",
        "quantity": 1500,
        "unit": "KG",
        "quality": "Standard",
        "district": "Okara",
        "province": "Punjab",
        "minPrice": 1800,
        "referencePrice": 2000,
        "priceUnit": "40kg",
        "description": "Desiree potatoes. Good size and texture, suitable for chips and restaurants.",
        "biddingStatus": "OPEN",
        "totalBids": 6,
        "endTime": int((_now + 3 * 3600 + 30 * 60) * 1000),
        "listedDate": "2026-09-29",
        "farmerName": "Ahmed K.",
        "farmerId": "u1",
        "image": "🥔",
    },
]

BIDS: list = []       # Runtime bid records
LISTING_ID_CTR = [8]  # Auto-increment counter (mutable list trick)

# ─── Helpers ──────────────────────────────────────────────────────────────────

def mask_cnic(cnic: str) -> str:
    parts = cnic.split("-")
    if len(parts) == 3:
        return f"{parts[0]}-*******-{parts[2]}"
    return cnic[:5] + "*******" + cnic[-2:]


def mask_phone(phone: str) -> str:
    parts = phone.split("-")
    if len(parts) == 2:
        return f"{parts[0]}-***-{parts[1][-4:]}"
    return phone[:4] + "***" + phone[-4:]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def today_str() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")

# ─── Pydantic Schemas ─────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class CreateListingRequest(BaseModel):
    crop: str = Field(..., min_length=1)
    variety: str = Field(..., min_length=2)
    quantity: float = Field(..., gt=0)
    unit: str = "KG"
    quality: str
    district: str
    province: str = "Punjab"
    minPrice: float = Field(..., gt=0)
    description: str = ""


class PlaceBidRequest(BaseModel):
    listingId: int
    bidAmount: float = Field(..., gt=0)
    buyerName: str = ""
    buyerContact: str = ""


class VerifyFarmerRequest(BaseModel):
    farmerId: str
    status: str   # "VERIFIED" | "REJECTED"
    reason: Optional[str] = None


class UpdateReferencePriceRequest(BaseModel):
    crop: str
    price: int
    unit: str = "40kg"

# ─── RBAC Dependency ──────────────────────────────────────────────────────────

def get_current_user_role(x_user_role: Optional[str] = Header(None)) -> str:
    if not x_user_role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-User-Role header. Please log in first.",
        )
    return x_user_role


def require_role(allowed_role: str):
    def checker(role: str = Depends(get_current_user_role)):
        if role != allowed_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Access denied. This action requires the '{allowed_role}' role. "
                    f"Your current role is '{role}'."
                ),
            )
        return role
    return checker

# ─── Root ─────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {
        "system": "FairFarm Marketplace API",
        "version": "3.0.0",
        "status": "Running ✅",
        "docs": "/docs",
        "endpoints": {
            "auth": "POST /api/login",
            "listings": "GET/POST /api/listings",
            "listing_detail": "GET /api/listings/{id}",
            "delete_listing": "DELETE /api/listings/{id}",
            "bid": "POST /api/listings/{id}/bid",
            "bids": "GET /api/listings/{id}/bids",
            "reference_prices": "GET /api/reference-prices",
            "update_price": "POST /api/officer/reference-prices",
            "pending_farmers": "GET /api/officer/pending-farmers",
            "verify_farmer": "POST /api/officer/verify-farmer",
            "farmer_stats": "GET /api/farmer/stats",
        },
    }

# ─── 1. AUTH ──────────────────────────────────────────────────────────────────

@app.post("/api/login", tags=["Auth"])
def login(req: LoginRequest):
    """Authenticate a demo user and return their profile (role-aware)."""
    user = DEMO_USERS.get(req.email.lower().strip())
    if not user or user["password"] != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Demo accounts: farmer@fairfarm.pk / officer@fairfarm.pk",
        )
    user_data = {k: v for k, v in user.items() if k != "password"}
    return {"success": True, "message": f"Login successful as {user['role']}", "user": user_data}

# ─── 2. LISTINGS — CRUD ───────────────────────────────────────────────────────

@app.get("/api/listings", tags=["Listings"])
def get_listings(
    crop: Optional[str] = Query(None),
    quality: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    district: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query("newest"),
):
    """
    Fetch all crop listings with optional filters:
    - crop, quality, status, district: exact filter
    - search: searches crop name, variety, district (case-insensitive)
    - sort: newest | price_asc | price_desc | most_bids
    """
    result = list(CROP_LISTINGS)

    if search:
        q = search.lower()
        result = [
            l for l in result
            if q in (l.get("crop", "")).lower()
            or q in (l.get("variety", "")).lower()
            or q in (l.get("district", "")).lower()
        ]
    if crop and crop != "All":
        result = [l for l in result if l.get("crop") == crop]
    if quality and quality != "All":
        result = [l for l in result if l.get("quality") == quality]
    if status_filter and status_filter != "All":
        result = [l for l in result if l.get("biddingStatus") == status_filter]
    if district and district != "All":
        result = [l for l in result if l.get("district") == district]

    if sort == "price_asc":
        result.sort(key=lambda l: l.get("minPrice", 0))
    elif sort == "price_desc":
        result.sort(key=lambda l: l.get("minPrice", 0), reverse=True)
    elif sort == "most_bids":
        result.sort(key=lambda l: l.get("totalBids", 0), reverse=True)
    else:  # newest
        result.sort(key=lambda l: l.get("id", 0), reverse=True)

    return {"count": len(result), "listings": result}


@app.get("/api/listings/{listing_id}", tags=["Listings"])
def get_listing(listing_id: int):
    """Fetch a single listing by ID."""
    for l in CROP_LISTINGS:
        if l["id"] == listing_id:
            return l
    raise HTTPException(status_code=404, detail=f"Listing #{listing_id} not found.")


@app.post("/api/listings", tags=["Listings"], status_code=201)
def create_listing(
    req: CreateListingRequest,
    role: str = Depends(get_current_user_role),
    x_user_name: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
):
    """
    Create a new crop listing. Requires authentication (any role).
    Farmers are the primary creators; Market Officers can also list.
    """
    CROP_EMOJI_MAP = {
        "Wheat": "🌾", "Rice": "🍚", "Cotton": "🏵️", "Maize": "🌽",
        "Sugarcane": "🎋", "Tomatoes": "🍅", "Potatoes": "🥔",
        "Onions": "🧅", "Mangoes": "🥭", "Oranges": "🍊",
    }
    # Find reference price
    ref_price = None
    for rp in REFERENCE_PRICES:
        if rp["crop"].lower() == req.crop.lower():
            ref_price = rp["price"]
            break

    new_id = LISTING_ID_CTR[0]
    LISTING_ID_CTR[0] += 1

    listing = {
        "id": new_id,
        "crop": req.crop,
        "variety": req.variety,
        "quantity": req.quantity,
        "unit": req.unit,
        "quality": req.quality,
        "district": req.district,
        "province": req.province,
        "minPrice": req.minPrice,
        "referencePrice": ref_price,
        "priceUnit": "40kg",
        "description": req.description,
        "biddingStatus": "OPEN",
        "totalBids": 0,
        "endTime": int((_now + 24 * 3600) * 1000),   # 24h from server start (demo)
        "listedDate": today_str(),
        "farmerName": x_user_name or "Ahmed K.",
        "farmerId": x_user_id or "u1",
        "image": CROP_EMOJI_MAP.get(req.crop, "🌾"),
        "createdAt": now_iso(),
    }
    CROP_LISTINGS.append(listing)
    return {"success": True, "message": "Listing created successfully.", "listing": listing}


@app.delete("/api/listings/{listing_id}", tags=["Listings"])
def delete_listing(
    listing_id: int,
    role: str = Depends(get_current_user_role),
    x_user_id: Optional[str] = Header(None),
):
    """
    Delete a listing. Farmers can only delete their own listings.
    Market Officers can delete any listing.
    """
    for i, l in enumerate(CROP_LISTINGS):
        if l["id"] == listing_id:
            if role == "Farmer" and l.get("farmerId") != x_user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Farmers can only delete their own listings.",
                )
            CROP_LISTINGS.pop(i)
            return {"success": True, "message": f"Listing #{listing_id} deleted."}
    raise HTTPException(status_code=404, detail=f"Listing #{listing_id} not found.")

# ─── 3. BIDDING ───────────────────────────────────────────────────────────────

@app.post("/api/listings/{listing_id}/bid", tags=["Bidding"])
def place_bid(
    listing_id: int,
    req: PlaceBidRequest,
    role: str = Depends(get_current_user_role),
    x_user_name: Optional[str] = Header(None),
):
    """Place a bid on an open listing. Only authenticated users (non-farmer) can bid."""
    listing = None
    for l in CROP_LISTINGS:
        if l["id"] == listing_id:
            listing = l
            break
    if not listing:
        raise HTTPException(status_code=404, detail=f"Listing #{listing_id} not found.")
    if listing["biddingStatus"] != "OPEN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Listing is not open for bidding (status: {listing['biddingStatus']}).",
        )
    if req.bidAmount < listing["minPrice"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bid amount Rs.{req.bidAmount:,.0f} is below minimum price Rs.{listing['minPrice']:,.0f}.",
        )
    bid = {
        "id": len(BIDS) + 1,
        "listingId": listing_id,
        "bidAmount": req.bidAmount,
        "bidderName": x_user_name or req.buyerName or "Anonymous Buyer",
        "bidderRole": role,
        "placedAt": now_iso(),
    }
    BIDS.append(bid)
    listing["totalBids"] = listing.get("totalBids", 0) + 1
    return {"success": True, "message": f"Bid of Rs.{req.bidAmount:,.0f} placed successfully.", "bid": bid}


@app.get("/api/listings/{listing_id}/bids", tags=["Bidding"])
def get_bids(listing_id: int, role: str = Depends(get_current_user_role)):
    """Get all bids for a listing. Bidder contact info masked for non-officers."""
    listing_bids = [b for b in BIDS if b["listingId"] == listing_id]
    is_officer = role == "Market Officer"
    result = []
    for b in listing_bids:
        item = dict(b)
        if not is_officer:
            # Mask bidder identity for privacy
            name = item.get("bidderName", "")
            if len(name) > 2:
                item["bidderName"] = name[0] + "*" * (len(name) - 2) + name[-1]
        result.append(item)
    return {
        "listingId": listing_id,
        "totalBids": len(result),
        "pii_masked": not is_officer,
        "bids": result,
    }

# ─── 4. REFERENCE PRICES ─────────────────────────────────────────────────────

@app.get("/api/reference-prices", tags=["Market Prices"])
def get_reference_prices():
    """Public endpoint: Get all official market reference prices."""
    return {"referencePrices": REFERENCE_PRICES}


@app.post("/api/officer/reference-prices", tags=["Market Prices"])
def update_reference_price(
    req: UpdateReferencePriceRequest,
    role: str = Depends(require_role("Market Officer")),
):
    """Market Officer only: Update or add an official reference price."""
    for item in REFERENCE_PRICES:
        if item["crop"].lower() == req.crop.lower():
            item["price"] = req.price
            item["lastUpdated"] = today_str()
            return {
                "success": True,
                "message": f"Reference price for {req.crop} updated to Rs.{req.price:,}/{req.unit}.",
                "referencePrices": REFERENCE_PRICES,
            }
    REFERENCE_PRICES.append({
        "crop": req.crop,
        "price": req.price,
        "unit": req.unit,
        "updatedBy": "Market Officer",
        "lastUpdated": today_str(),
    })
    return {
        "success": True,
        "message": f"Reference price for {req.crop} created at Rs.{req.price:,}/{req.unit}.",
        "referencePrices": REFERENCE_PRICES,
    }

# ─── 5. KYC VERIFICATION (Officer) ───────────────────────────────────────────

@app.get("/api/officer/pending-farmers", tags=["KYC"])
def get_pending_farmers(role: str = Depends(get_current_user_role)):
    """
    Get pending KYC farmer registrations.
    PII (CNIC, phone, land record) is masked for non-officers.
    """
    is_officer = role == "Market Officer"
    result = []
    for f in PENDING_FARMERS:
        item = dict(f)
        if not is_officer:
            item["cnic"] = mask_cnic(item["cnic"])
            item["phone"] = mask_phone(item["phone"])
            item["landRecordNo"] = "FARD-****-HIDDEN"
        result.append(item)
    return {"caller_role": role, "pii_masked": not is_officer, "farmers": result}


@app.post("/api/officer/verify-farmer", tags=["KYC"])
def verify_farmer(
    req: VerifyFarmerRequest,
    role: str = Depends(require_role("Market Officer")),
):
    """Market Officer only: Approve or reject a pending farmer KYC application."""
    allowed_statuses = {"VERIFIED", "REJECTED"}
    if req.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status must be one of: {allowed_statuses}",
        )
    for f in PENDING_FARMERS:
        if f["id"] == req.farmerId:
            f["status"] = req.status
            if req.reason:
                f["officerNote"] = req.reason
            f["verifiedAt"] = now_iso()
            return {
                "success": True,
                "message": f"Farmer '{f['name']}' status updated to {req.status}.",
                "farmer": f,
            }
    raise HTTPException(status_code=404, detail=f"Farmer ID '{req.farmerId}' not found.")

# ─── 6. FARMER STATS ─────────────────────────────────────────────────────────

@app.get("/api/farmer/stats", tags=["Farmer"])
def get_farmer_stats(
    role: str = Depends(get_current_user_role),
    x_user_id: Optional[str] = Header(None),
):
    """Get stats for the currently authenticated farmer."""
    farmer_id = x_user_id or "u1"
    farmer_listings = [l for l in CROP_LISTINGS if l.get("farmerId") == farmer_id]
    active = [l for l in farmer_listings if l.get("biddingStatus") == "OPEN"]
    sold = [l for l in farmer_listings if l.get("biddingStatus") == "SOLD"]
    total_bids = sum(l.get("totalBids", 0) for l in farmer_listings)
    total_revenue = sum(l.get("minPrice", 0) * l.get("quantity", 0) / 40 for l in sold)

    return {
        "farmerId": farmer_id,
        "totalListings": len(farmer_listings),
        "activeListings": len(active),
        "totalBids": total_bids,
        "totalSold": len(sold),
        "estimatedRevenuePKR": round(total_revenue, 2),
    }

# ─── Run ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
