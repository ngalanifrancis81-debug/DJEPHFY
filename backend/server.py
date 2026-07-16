from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'djeph2024')
WHATSAPP_NUMBER = os.environ.get('WHATSAPP_NUMBER', '237693819424')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()
api_router = APIRouter(prefix="/api")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    icon: str = "Wrench"
    color: str = "#D4822A"
    order: int = 0
    active: bool = True
    created_at: str = Field(default_factory=now_iso)


class CategoryCreate(BaseModel):
    name: str
    description: str
    icon: str = "Wrench"
    color: str = "#D4822A"
    order: int = 0
    active: bool = True


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class ServiceRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = ""
    category: str
    quartier: str
    description: str
    status: str = "nouveau"
    created_at: str = Field(default_factory=now_iso)


class ServiceRequestCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    category: str
    quartier: str
    description: str


class StatusUpdate(BaseModel):
    status: str


class LoginInput(BaseModel):
    password: str


# ---------- Auth ----------
async def require_admin(x_admin_password: str = Header(None)):
    if x_admin_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Accès non autorisé")
    return True


def slugify(text: str) -> str:
    import re
    text = text.lower().strip()
    text = re.sub(r'[àâä]', 'a', text)
    text = re.sub(r'[éèêë]', 'e', text)
    text = re.sub(r'[îï]', 'i', text)
    text = re.sub(r'[ôö]', 'o', text)
    text = re.sub(r'[ùûü]', 'u', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


DEFAULT_QUARTIERS = [
    "Akwa", "Bonanjo", "Bonapriso", "Deido", "Bepanda", "New Bell",
    "Bonabéri", "Makepe", "Logbaba", "Ndokotti", "Kotto", "Bali",
    "Ndogbong", "Cité des Palmiers", "Nyalla", "Yassa", "Japoma",
    "Logpom", "PK", "Village",
]

DEFAULT_CATEGORIES = [
    {"name": "Plomberie", "description": "Installation, fuites, robinetterie et dépannage sanitaire.", "icon": "Droplet", "color": "#2A7DE1"},
    {"name": "Électricité / dépannage", "description": "Installations électriques, pannes et mise aux normes.", "icon": "Zap", "color": "#F5A623"},
    {"name": "Menuiserie / ébénisterie", "description": "Meubles sur mesure, portes, fenêtres et réparations bois.", "icon": "Hammer", "color": "#8B5E3C"},
    {"name": "Maçonnerie / BTP", "description": "Construction, rénovation, carrelage et gros œuvre.", "icon": "Building2", "color": "#6B7280"},
    {"name": "Mécanique automobile", "description": "Réparation, entretien et diagnostic de véhicules.", "icon": "Car", "color": "#DC2626"},
    {"name": "Informatique / réparation", "description": "Réparation téléphones, ordinateurs et dépannage informatique.", "icon": "Laptop", "color": "#0EA5E9"},
    {"name": "Électroménager", "description": "Réparation frigo, climatiseur, machine à laver et plus.", "icon": "Microwave", "color": "#7C3AED"},
    {"name": "Nettoyage / entretien", "description": "Ménage à domicile, entretien de maison et bureaux.", "icon": "Sparkles", "color": "#10B981"},
    {"name": "Sécurité / gardiennage", "description": "Agents de sécurité et gardiennage de confiance.", "icon": "Shield", "color": "#1A1A2E"},
    {"name": "Traiteur / événementiel", "description": "Restauration et service traiteur pour vos événements.", "icon": "UtensilsCrossed", "color": "#B5522B"},
    {"name": "Coiffure / esthétique", "description": "Coiffure, soins et esthétique à domicile.", "icon": "Scissors", "color": "#EC4899"},
    {"name": "Transport / déménagement", "description": "Transport de biens et déménagement à Douala.", "icon": "Truck", "color": "#F59E0B"},
    {"name": "Juridique", "description": "Conseils, notaires et avocats à votre écoute.", "icon": "Scale", "color": "#374151"},
    {"name": "Santé à domicile", "description": "Infirmiers, aides-soignants et soins à domicile.", "icon": "Stethoscope", "color": "#EF4444"},
    {"name": "Cours particuliers", "description": "Soutien scolaire et cours particuliers à domicile.", "icon": "GraduationCap", "color": "#2A5C3F"},
    {"name": "Photo / vidéographie", "description": "Photographie et vidéo pour vos événements.", "icon": "Camera", "color": "#8B5CF6"},
]


@api_router.get("/")
async def root():
    return {"message": "Djeph API"}


@api_router.get("/config")
async def get_config():
    return {"whatsapp_number": WHATSAPP_NUMBER, "quartiers": DEFAULT_QUARTIERS}


# ---------- Categories ----------
@api_router.get("/categories", response_model=List[Category])
async def get_categories(include_inactive: bool = False):
    query = {} if include_inactive else {"active": True}
    docs = await db.categories.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    return docs


@api_router.post("/categories", response_model=Category, dependencies=[Depends(require_admin)])
async def create_category(payload: CategoryCreate):
    cat = Category(**payload.model_dump(), slug=slugify(payload.name))
    await db.categories.insert_one(cat.model_dump())
    return cat


@api_router.put("/categories/{cat_id}", response_model=Category, dependencies=[Depends(require_admin)])
async def update_category(cat_id: str, payload: CategoryUpdate):
    existing = await db.categories.find_one({"id": cat_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "name" in updates:
        updates["slug"] = slugify(updates["name"])
    await db.categories.update_one({"id": cat_id}, {"$set": updates})
    doc = await db.categories.find_one({"id": cat_id}, {"_id": 0})
    return doc


@api_router.delete("/categories/{cat_id}", dependencies=[Depends(require_admin)])
async def delete_category(cat_id: str):
    res = await db.categories.delete_one({"id": cat_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    return {"success": True}


# ---------- Service Requests ----------
@api_router.post("/requests", response_model=ServiceRequest)
async def create_request(payload: ServiceRequestCreate):
    req = ServiceRequest(**payload.model_dump())
    await db.requests.insert_one(req.model_dump())
    return req


@api_router.get("/requests", response_model=List[ServiceRequest], dependencies=[Depends(require_admin)])
async def get_requests():
    docs = await db.requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.put("/requests/{req_id}/status", response_model=ServiceRequest, dependencies=[Depends(require_admin)])
async def update_request_status(req_id: str, payload: StatusUpdate):
    res = await db.requests.update_one({"id": req_id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    doc = await db.requests.find_one({"id": req_id}, {"_id": 0})
    return doc


@api_router.delete("/requests/{req_id}", dependencies=[Depends(require_admin)])
async def delete_request(req_id: str):
    res = await db.requests.delete_one({"id": req_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    return {"success": True}


# ---------- Admin ----------
@api_router.post("/admin/login")
async def admin_login(payload: LoginInput):
    if payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    return {"token": ADMIN_PASSWORD}


@app.on_event("startup")
async def seed_data():
    count = await db.categories.count_documents({})
    if count == 0:
        for i, c in enumerate(DEFAULT_CATEGORIES):
            cat = Category(**c, slug=slugify(c["name"]), order=i)
            await db.categories.insert_one(cat.model_dump())
        logger.info("Seeded default categories")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
