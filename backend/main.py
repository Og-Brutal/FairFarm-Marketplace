import uvicorn
from fastapi import FastAPI, HTTPException, Header, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="FairFarm SSD Backend API",
    description="Role-Based Functional API with RBAC & Data Masking for Secure Software Development Activity 2",
    version="2.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Demo Users Database
DEMO_USERS = {
    "farmer@fairfarm.pk": {
        "id": "u1",
        "email": "farmer@fairfarm.pk",
        "password": "password123",
        "name": "Ahmed Khan",
        "role": "Farmer",
        "district": "Faisalabad",
        "verificationStatus": "VERIFIED",
        "cnic": "35202-1234567-1",
        "phone": "0300-1234567"
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
        "phone": "0321-9988776"
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
        "phone": "0345-4433221"
    }
}

# Pending Farmers Database for Market Officer KYC Verification
PENDING_FARMERS = [
    {
        "id": "f_101",
        "name": "Mohammad Rashid",
        "email": "rashid@fairfarm.pk",
        "phone": "0301-9876543",
        "cnic": "35201-9876543-5",
        "district": "Multan",
        "landRecordNo": "FARD-2026-8891",
        "submittedDate": "2026-10-04",
        "status": "PENDING_VERIFICATION"
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
        "status": "PENDING_VERIFICATION"
    }
]

# Market Reference Prices Database
REFERENCE_PRICES = [
    {"crop": "Wheat", "price": 9200, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-05"},
    {"crop": "Rice", "price": 11500, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-05"},
    {"crop": "Cotton", "price": 18400, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-04"},
    {"crop": "Maize", "price": 4800, "unit": "40kg", "updatedBy": "Tariq Mahmood", "lastUpdated": "2026-10-03"}
]

# Helper for PII Masking (SSD Privacy Requirement)
def mask_cnic(cnic: str) -> str:
    # 35202-1234567-1 -> 35202-*******-1
    parts = cnic.split("-")
    if len(parts) == 3:
        return f"{parts[0]}-*******-{parts[2]}"
    return cnic[:5] + "*******" + cnic[-2:]

def mask_phone(phone: str) -> str:
    # 0300-1234567 -> 0300-***-4567
    parts = phone.split("-")
    if len(parts) == 2:
        return f"{parts[0]}-***-{parts[1][-4:]}"
    return phone[:4] + "***" + phone[-4:]

# Pydantic Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyFarmerRequest(BaseModel):
    farmerId: str
    status: str # "VERIFIED" or "REJECTED"
    reason: Optional[str] = None

class UpdateReferencePriceRequest(BaseModel):
    crop: str
    price: int
    unit: str = "40kg"

# Role Dependency Enforcement (RBAC)
def get_current_user_role(x_user_role: Optional[str] = Header(None)):
    if not x_user_role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token or X-User-Role header missing"
        )
    return x_user_role

def require_role(allowed_role: str):
    def role_checker(role: str = Depends(get_current_user_role)):
        if role != allowed_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Action restricted to '{allowed_role}' role only. Your role is '{role}'."
            )
        return role
    return role_checker

@app.get("/")
def read_root():
    return {
        "system": "FairFarm Role-Based Functional Backend API",
        "status": "Running",
        "roles_supported": ["Farmer", "Market Officer", "Buyer"],
        "security_controls": ["RBAC (403 Enforcement)", "CNIC/Phone Masking", "Role-Based Header Auth"]
    }

# 1. AUTHENTICATION ENDPOINT
@app.post("/api/login")
def login(credentials: LoginRequest):
    user = DEMO_USERS.get(credentials.email.lower().strip())
    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Use demo accounts: farmer@fairfarm.pk or officer@fairfarm.pk"
        )
    
    # Return user object without raw password
    user_data = dict(user)
    del user_data["password"]
    return {
        "success": True,
        "message": f"Login successful as {user['role']}",
        "user": user_data
    }

# 2. RESTRICTED OFFICER ENDPOINT: View Pending KYC Farmers (Data Masked based on role!)
@app.get("/api/officer/pending-farmers")
def get_pending_farmers(role: str = Depends(get_current_user_role)):
    is_officer = (role == "Market Officer")
    
    formatted = []
    for f in PENDING_FARMERS:
        item = dict(f)
        if not is_officer:
            # Mask PII data if caller is not Market Officer
            item["cnic"] = mask_cnic(item["cnic"])
            item["phone"] = mask_phone(item["phone"])
            item["landRecordNo"] = "FARD-****-HIDDEN"
        formatted.append(item)

    return {
        "caller_role": role,
        "pii_masked": not is_officer,
        "farmers": formatted
    }

# 3. RESTRICTED OFFICER ENDPOINT: Approve / Reject Farmer KYC Verification
@app.post("/api/officer/verify-farmer")
def verify_farmer(
    req: VerifyFarmerRequest,
    role: str = Depends(require_role("Market Officer")) # Strictly HTTP 403 if Farmer!
):
    for f in PENDING_FARMERS:
        if f["id"] == req.farmerId:
            f["status"] = req.status
            return {
                "success": True,
                "message": f"Farmer {f['name']} status updated to {req.status} by Market Officer",
                "farmer": f
            }
    raise HTTPException(status_code=404, detail="Farmer ID not found")

# 4. RESTRICTED OFFICER ENDPOINT: Publish Official Market Reference Prices
@app.post("/api/officer/reference-prices")
def update_reference_price(
    req: UpdateReferencePriceRequest,
    role: str = Depends(require_role("Market Officer")) # Strictly HTTP 403 if Farmer!
):
    updated = False
    for item in REFERENCE_PRICES:
        if item["crop"].lower() == req.crop.lower():
            item["price"] = req.price
            item["lastUpdated"] = "2026-10-05"
            updated = True
            break
            
    if not updated:
        REFERENCE_PRICES.append({
            "crop": req.crop,
            "price": req.price,
            "unit": req.unit,
            "updatedBy": "Tariq Mahmood",
            "lastUpdated": "2026-10-05"
        })
        
    return {
        "success": True,
        "message": f"Official Market Reference Price for {req.crop} set to Rs. {req.price:,}/{req.unit} by Market Officer",
        "referencePrices": REFERENCE_PRICES
    }

# 5. PUBLIC / FARMER ENDPOINT: Read Reference Prices
@app.get("/api/reference-prices")
def get_reference_prices():
    return {"referencePrices": REFERENCE_PRICES}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
