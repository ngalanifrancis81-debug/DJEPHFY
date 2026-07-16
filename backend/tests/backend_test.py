"""Backend API tests for Djeph marketplace."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://djeph-connect.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "djeph2024"


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "X-Admin-Password": ADMIN_PASSWORD})
    return s


# ---------- Public: config & categories ----------
class TestPublic:
    def test_root(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("message") == "Djeph API"

    def test_config(self, api_client):
        r = api_client.get(f"{API}/config")
        assert r.status_code == 200
        data = r.json()
        assert data["whatsapp_number"] == "237693819424"
        assert isinstance(data["quartiers"], list)
        assert len(data["quartiers"]) >= 15
        assert "Akwa" in data["quartiers"]

    def test_categories_seeded(self, api_client):
        r = api_client.get(f"{API}/categories")
        assert r.status_code == 200
        cats = r.json()
        assert isinstance(cats, list)
        assert len(cats) >= 16
        # All active by default
        assert all(c.get("active") is True for c in cats)
        names = {c["name"] for c in cats}
        assert "Plomberie" in names
        # No mongo _id leak
        assert all("_id" not in c for c in cats)
        # Have slug
        assert all(c.get("slug") for c in cats)


# ---------- Contact requests (public POST) ----------
class TestServiceRequests:
    _created_id = None

    def test_create_request(self, api_client, admin_client):
        payload = {
            "name": "TEST_Jean Mballa",
            "phone": "+237699999999",
            "email": "TEST_jean@example.com",
            "category": "Plomberie",
            "quartier": "Akwa",
            "description": "Fuite d'eau dans la cuisine",
        }
        r = api_client.post(f"{API}/requests", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["status"] == "nouveau"
        assert data["category"] == "Plomberie"
        assert "id" in data
        TestServiceRequests._created_id = data["id"]

        # Verify persistence via admin GET
        r2 = admin_client.get(f"{API}/requests")
        assert r2.status_code == 200
        ids = [x["id"] for x in r2.json()]
        assert data["id"] in ids

    def test_requests_requires_admin(self, api_client):
        r = api_client.get(f"{API}/requests")
        assert r.status_code == 401

    def test_update_request_status(self, admin_client):
        rid = TestServiceRequests._created_id
        assert rid, "prior test must create a request"
        r = admin_client.put(f"{API}/requests/{rid}/status", json={"status": "en cours"})
        assert r.status_code == 200
        assert r.json()["status"] == "en cours"

    def test_update_status_requires_admin(self, api_client):
        rid = TestServiceRequests._created_id
        r = api_client.put(f"{API}/requests/{rid}/status", json={"status": "traité"})
        assert r.status_code == 401

    def test_delete_request(self, admin_client):
        rid = TestServiceRequests._created_id
        r = admin_client.delete(f"{API}/requests/{rid}")
        assert r.status_code == 200
        # Verify it's gone
        r2 = admin_client.get(f"{API}/requests")
        ids = [x["id"] for x in r2.json()]
        assert rid not in ids

    def test_delete_missing_request_404(self, admin_client):
        r = admin_client.delete(f"{API}/requests/nonexistent-id-xyz")
        assert r.status_code == 404


# ---------- Admin login ----------
class TestAdminAuth:
    def test_login_success(self, api_client):
        r = api_client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert r.json()["token"] == ADMIN_PASSWORD

    def test_login_wrong(self, api_client):
        r = api_client.post(f"{API}/admin/login", json={"password": "wrongpw"})
        assert r.status_code == 401


# ---------- Categories CRUD (admin) ----------
class TestCategoryCRUD:
    _cid = None

    def test_create_category_requires_admin(self, api_client):
        r = api_client.post(f"{API}/categories", json={"name": "TEST_X", "description": "d"})
        assert r.status_code == 401

    def test_create_category(self, admin_client):
        payload = {"name": "TEST_Jardinage", "description": "Entretien de jardin", "icon": "Sparkles", "color": "#10B981", "active": True}
        r = admin_client.post(f"{API}/categories", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["slug"] == "test-jardinage"
        assert "id" in data
        TestCategoryCRUD._cid = data["id"]

        # Verify persistence
        r2 = admin_client.get(f"{API}/categories")
        assert any(c["id"] == data["id"] for c in r2.json())

    def test_update_category(self, admin_client):
        cid = TestCategoryCRUD._cid
        r = admin_client.put(f"{API}/categories/{cid}", json={"description": "Nouvelle description", "name": "TEST_Jardin Pro"})
        assert r.status_code == 200
        data = r.json()
        assert data["description"] == "Nouvelle description"
        assert data["name"] == "TEST_Jardin Pro"
        assert data["slug"] == "test-jardin-pro"

    def test_update_category_requires_admin(self, api_client):
        cid = TestCategoryCRUD._cid
        r = api_client.put(f"{API}/categories/{cid}", json={"description": "x"})
        assert r.status_code == 401

    def test_delete_category_requires_admin(self, api_client):
        cid = TestCategoryCRUD._cid
        r = api_client.delete(f"{API}/categories/{cid}")
        assert r.status_code == 401

    def test_delete_category(self, admin_client):
        cid = TestCategoryCRUD._cid
        r = admin_client.delete(f"{API}/categories/{cid}")
        assert r.status_code == 200
        # Verify gone
        r2 = admin_client.get(f"{API}/categories?include_inactive=true")
        assert all(c["id"] != cid for c in r2.json())

    def test_update_missing_category_404(self, admin_client):
        r = admin_client.put(f"{API}/categories/does-not-exist", json={"name": "x"})
        assert r.status_code == 404
