import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://bmw-mwcrew-hub.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "mwcrew2025"


@pytest.fixture(scope="module")
def s():
    return requests.Session()


@pytest.fixture(scope="module")
def admin_token(s):
    r = s.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200
    return r.json()["token"]


@pytest.fixture(scope="module", autouse=True)
def cleanup(s):
    yield
    # purge anything created with TEST_ prefix
    try:
        r = s.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
        token = r.json()["token"]
        regs = s.get(f"{API}/admin/registrations", headers={"X-Admin-Token": token}).json()
        for reg in regs:
            if reg.get("prenom", "").startswith("TEST_"):
                s.delete(f"{API}/admin/registrations/{reg['id']}", headers={"X-Admin-Token": token})
    except Exception:
        pass


# ---------- Count ----------
def test_count_shape(s):
    r = s.get(f"{API}/registrations/count")
    assert r.status_code == 200
    d = r.json()
    for k in ("count", "max_places", "places_restantes", "sold_out"):
        assert k in d
    assert d["max_places"] == 25
    assert isinstance(d["sold_out"], bool)


# ---------- Admin auth ----------
def test_admin_login_wrong(s):
    r = s.post(f"{API}/admin/login", json={"password": "wrong"})
    assert r.status_code == 401


def test_admin_login_ok(admin_token):
    assert isinstance(admin_token, str) and len(admin_token) > 5


def test_admin_list_requires_token(s):
    r = s.get(f"{API}/admin/registrations")
    assert r.status_code == 401


def test_admin_list_ok(s, admin_token):
    r = s.get(f"{API}/admin/registrations", headers={"X-Admin-Token": admin_token})
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ---------- Registration create + validation ----------
def test_create_missing_fields(s):
    r = s.post(f"{API}/registrations", json={"prenom": "x"})
    assert r.status_code == 422


def test_create_invalid_interet(s):
    r = s.post(f"{API}/registrations", json={
        "prenom": "TEST_x", "modele_bmw": "M3", "telephone": "+32111",
        "interet": "bogus"
    })
    assert r.status_code == 422


def test_create_no_photo(s, admin_token):
    payload = {"prenom": "TEST_NoPhoto", "modele_bmw": "M3 G80",
               "telephone": "+32400000001", "interet": "les_deux"}
    r = s.post(f"{API}/registrations", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["prenom"] == "TEST_NoPhoto"
    assert d["modele_bmw"] == "M3 G80"
    assert isinstance(d["place_numero"], int)
    # verify persistence
    regs = s.get(f"{API}/admin/registrations", headers={"X-Admin-Token": admin_token}).json()
    assert any(x["id"] == d["id"] and x.get("photo_base64") is None for x in regs)


def test_create_with_photo(s, admin_token):
    tiny_png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    payload = {"prenom": "TEST_WithPhoto", "modele_bmw": "M4 F82",
               "telephone": "+32400000002", "interet": "1_jour",
               "photo_base64": tiny_png}
    r = s.post(f"{API}/registrations", json=payload)
    assert r.status_code == 200
    d = r.json()
    regs = s.get(f"{API}/admin/registrations", headers={"X-Admin-Token": admin_token}).json()
    match = [x for x in regs if x["id"] == d["id"]]
    assert match and match[0]["photo_base64"] == tiny_png


# ---------- Delete ----------
def test_admin_delete_requires_token(s):
    r = s.delete(f"{API}/admin/registrations/nope")
    assert r.status_code == 401


def test_admin_delete_404(s, admin_token):
    r = s.delete(f"{API}/admin/registrations/does-not-exist-xyz",
                 headers={"X-Admin-Token": admin_token})
    assert r.status_code == 404


def test_admin_delete_ok(s, admin_token):
    create = s.post(f"{API}/registrations", json={
        "prenom": "TEST_ToDelete", "modele_bmw": "M2", "telephone": "+32400000003",
        "interet": "aucun"
    }).json()
    r = s.delete(f"{API}/admin/registrations/{create['id']}",
                 headers={"X-Admin-Token": admin_token})
    assert r.status_code == 200
    # verify gone
    regs = s.get(f"{API}/admin/registrations", headers={"X-Admin-Token": admin_token}).json()
    assert not any(x["id"] == create["id"] for x in regs)


# ---------- 25 place limit ----------
def test_sold_out_limit(s, admin_token):
    count = s.get(f"{API}/registrations/count").json()["count"]
    created_ids = []
    to_fill = 25 - count
    for i in range(to_fill):
        r = s.post(f"{API}/registrations", json={
            "prenom": f"TEST_Fill{i}", "modele_bmw": "M3",
            "telephone": f"+3240000{i:04d}", "interet": "aucun"
        })
        assert r.status_code == 200
        created_ids.append(r.json()["id"])

    # 26th must 409
    r = s.post(f"{API}/registrations", json={
        "prenom": "TEST_Overflow", "modele_bmw": "M5", "telephone": "+32999",
        "interet": "aucun"
    })
    assert r.status_code == 409

    cdata = s.get(f"{API}/registrations/count").json()
    assert cdata["sold_out"] is True
    assert cdata["places_restantes"] == 0

    # cleanup these to keep space for demo
    for i in created_ids:
        s.delete(f"{API}/admin/registrations/{i}",
                 headers={"X-Admin-Token": admin_token})
