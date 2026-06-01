from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

MAX_PLACES = 25
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'mwcrew2025')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'mwcrew-admin-secret-token')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class RegistrationCreate(BaseModel):
    prenom: str = Field(..., min_length=1, max_length=80)
    modele_bmw: str = Field(..., min_length=1, max_length=120)
    photo_base64: Optional[str] = Field(default=None)  # data:image/...;base64,...
    telephone: str = Field(..., min_length=4, max_length=40)
    interet: str = Field(..., pattern="^(aucun|1_jour|2_jours|les_deux)$")


class Registration(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prenom: str
    modele_bmw: str
    photo_base64: Optional[str] = None
    telephone: str
    interet: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CountResponse(BaseModel):
    count: int
    max_places: int
    places_restantes: int
    sold_out: bool


class RegistrationPublicResponse(BaseModel):
    id: str
    prenom: str
    modele_bmw: str
    place_numero: int


class AdminLoginRequest(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str


# ---------- Helpers ----------
async def get_count() -> int:
    return await db.registrations.count_documents({})


def require_admin(token: Optional[str]):
    if not token or token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "MWCREW API"}


@api_router.get("/registrations/count", response_model=CountResponse)
async def registrations_count():
    count = await get_count()
    return CountResponse(
        count=count,
        max_places=MAX_PLACES,
        places_restantes=max(MAX_PLACES - count, 0),
        sold_out=count >= MAX_PLACES,
    )


@api_router.post("/registrations", response_model=RegistrationPublicResponse)
async def create_registration(payload: RegistrationCreate):
    count = await get_count()
    if count >= MAX_PLACES:
        raise HTTPException(status_code=409, detail="Plus de places disponibles. Les 25 places sont prises.")

    # Soft cap on photo size to avoid huge documents (~ 5 MB base64)
    if payload.photo_base64 and len(payload.photo_base64) > 7_000_000:
        raise HTTPException(status_code=413, detail="La photo est trop lourde (max ~5 Mo).")

    reg = Registration(**payload.model_dump())
    doc = reg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.registrations.insert_one(doc)

    return RegistrationPublicResponse(
        id=reg.id,
        prenom=reg.prenom,
        modele_bmw=reg.modele_bmw,
        place_numero=count + 1,
    )


@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest):
    if payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    return AdminLoginResponse(token=ADMIN_TOKEN)


@api_router.get("/admin/registrations", response_model=List[Registration])
async def admin_list_registrations(x_admin_token: Optional[str] = Header(default=None)):
    require_admin(x_admin_token)
    docs = await db.registrations.find({}, {"_id": 0}).sort("created_at", 1).to_list(1000)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


@api_router.delete("/admin/registrations/{registration_id}")
async def admin_delete_registration(
    registration_id: str,
    x_admin_token: Optional[str] = Header(default=None),
):
    require_admin(x_admin_token)
    result = await db.registrations.delete_one({"id": registration_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inscription introuvable")
    return {"deleted": True, "id": registration_id}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
