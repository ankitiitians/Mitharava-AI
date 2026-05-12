"""Tests for deferred endpoints: STT, resume parse, onboarding, PDF report."""
import io
import os
import wave
import struct
import pytest
import requests
from pathlib import Path

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    env_path = Path('/app/frontend/.env')
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
                break

API = f"{BASE_URL}/api"
DEMO_EMAIL = "demo@mitharva.ai"
DEMO_PASS = "Demo@2026"


# ---------------- Fixtures ----------------
@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    return s


@pytest.fixture(scope="module")
def demo_token(api_client):
    r = api_client.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASS},
                        headers={"Content-Type": "application/json"})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(demo_token):
    return {"Authorization": f"Bearer {demo_token}"}


@pytest.fixture(scope="module")
def silent_wav_bytes():
    """Generate a 1-second 16 kHz mono silent WAV in memory."""
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(16000)
        w.writeframes(struct.pack("<" + "h" * 16000, *([0] * 16000)))
    return buf.getvalue()


@pytest.fixture(scope="module")
def sample_pdf_bytes():
    """Generate a small PDF using reportlab."""
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, 800, "John Doe")
    c.setFont("Helvetica", 12)
    c.drawString(72, 780, "Software Engineer")
    c.drawString(72, 760, "Email: john@example.com  Phone: +91-9999999999")
    c.drawString(72, 730, "Skills: Python, React, FastAPI, MongoDB, Docker, AWS")
    c.drawString(72, 700, "Education: B.Tech CSE, IIT Delhi, 2022")
    c.drawString(72, 670, "Experience: SDE at Amazon (2022-2024) - Built distributed systems")
    c.drawString(72, 640, "Projects: ResumeAI - LLM-based resume parser using Python and React")
    c.showPage()
    c.save()
    return buf.getvalue()


# ---------------- Voice STT ----------------
class TestVoiceSTT:
    def test_stt_requires_auth(self, api_client, silent_wav_bytes):
        files = {"file": ("test.wav", silent_wav_bytes, "audio/wav")}
        r = api_client.post(f"{API}/voice/stt", files=files)
        assert r.status_code in (401, 403), f"Expected 401/403, got {r.status_code}"

    def test_stt_no_file_returns_422(self, api_client, auth_headers):
        r = api_client.post(f"{API}/voice/stt", headers=auth_headers)
        assert r.status_code == 422, f"Expected 422, got {r.status_code}: {r.text}"

    def test_stt_happy_path_returns_text(self, api_client, auth_headers, silent_wav_bytes):
        files = {"file": ("silence.wav", silent_wav_bytes, "audio/wav")}
        r = api_client.post(f"{API}/voice/stt", headers=auth_headers, files=files)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        data = r.json()
        assert "text" in data, f"Missing 'text' field: {data}"
        assert isinstance(data["text"], str)

    def test_stt_non_audio_returns_500(self, api_client, auth_headers):
        files = {"file": ("not_audio.txt", b"this is plain text not audio", "text/plain")}
        r = api_client.post(f"{API}/voice/stt", headers=auth_headers, files=files)
        assert r.status_code == 500, f"Expected 500, got {r.status_code}: {r.text}"
        detail = r.json().get("detail", "")
        assert "Transcription failed" in detail or "transcrib" in detail.lower()

    def test_stt_oversize_returns_400(self, api_client, auth_headers):
        # 26 MB blob — should be rejected before STT call
        big = b"\x00" * (26 * 1024 * 1024)
        files = {"file": ("big.wav", big, "audio/wav")}
        r = api_client.post(f"{API}/voice/stt", headers=auth_headers, files=files)
        assert r.status_code == 400, f"Expected 400, got {r.status_code}: {r.text[:200]}"
        assert "too large" in r.json().get("detail", "").lower()


# ---------------- Resume Parse ----------------
class TestResumeParse:
    def test_resume_requires_auth(self, api_client, sample_pdf_bytes):
        files = {"file": ("r.pdf", sample_pdf_bytes, "application/pdf")}
        r = api_client.post(f"{API}/resume/parse", files=files)
        assert r.status_code in (401, 403)

    def test_resume_happy_path(self, api_client, auth_headers, sample_pdf_bytes):
        files = {"file": ("resume.pdf", sample_pdf_bytes, "application/pdf")}
        r = api_client.post(f"{API}/resume/parse", headers=auth_headers, files=files, timeout=60)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:500]}"
        data = r.json()
        assert data.get("filename") == "resume.pdf"
        assert "parsed" in data
        assert "text_length" in data
        assert isinstance(data["text_length"], int)
        assert data["text_length"] > 0
        parsed = data["parsed"]
        # Should at least be a dict (LLM may return varying keys)
        assert isinstance(parsed, dict)
        # Sanity: at minimum the schema fields should exist
        for key in ("name", "skills", "education", "experience"):
            assert key in parsed, f"Missing parsed key '{key}': {parsed}"

    def test_resume_non_pdf_returns_500(self, api_client, auth_headers):
        files = {"file": ("not.pdf", b"plain text not a pdf", "application/pdf")}
        r = api_client.post(f"{API}/resume/parse", headers=auth_headers, files=files)
        assert r.status_code == 500, f"Expected 500, got {r.status_code}: {r.text[:200]}"
        assert "Resume parse failed" in r.json().get("detail", "")


# ---------------- Onboarding ----------------
class TestOnboarding:
    def test_onboarding_requires_auth(self, api_client):
        r = api_client.post(f"{API}/profile/onboarding",
                            json={"preparation_stage": "beginner"},
                            headers={"Content-Type": "application/json"})
        assert r.status_code in (401, 403)

    def test_onboarding_saves_and_returns_user(self, api_client, auth_headers):
        payload = {
            "preparation_stage": "intermediate",
            "previous_attempts": "2",
            "challenges": ["time management", "current affairs depth"],
            "preferred_language": "english",
        }
        h = dict(auth_headers); h["Content-Type"] = "application/json"
        r = api_client.post(f"{API}/profile/onboarding", headers=h, json=payload)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:300]}"
        user = r.json()
        assert user.get("onboarding_completed") is True
        assert user.get("preparation_stage") == "intermediate"
        assert user.get("previous_attempts") == "2"
        assert user.get("challenges") == payload["challenges"]
        assert user.get("preferred_language") == "english"
        assert "_id" not in user
        assert "password" not in user

        # Verify persistence via /auth/me
        me = api_client.get(f"{API}/auth/me", headers=auth_headers).json()
        assert me.get("onboarding_completed") is True
        assert me.get("preparation_stage") == "intermediate"


# ---------------- PDF Report ----------------
class TestSessionReportPDF:
    @pytest.fixture(scope="class")
    def a_session_id(self, api_client, auth_headers):
        # Use an existing session from the demo user's seeded sessions
        r = api_client.get(f"{API}/sessions", headers=auth_headers)
        assert r.status_code == 200
        sessions = r.json()
        assert isinstance(sessions, list) and len(sessions) > 0
        return sessions[0]["id"]

    def test_report_pdf_requires_auth(self, api_client, a_session_id):
        r = api_client.get(f"{API}/sessions/{a_session_id}/report.pdf")
        assert r.status_code in (401, 403)

    def test_report_pdf_404_for_nonexistent(self, api_client, auth_headers):
        r = api_client.get(f"{API}/sessions/does-not-exist-xyz/report.pdf", headers=auth_headers)
        assert r.status_code == 404

    def test_report_pdf_happy_path(self, api_client, auth_headers, a_session_id):
        r = api_client.get(f"{API}/sessions/{a_session_id}/report.pdf", headers=auth_headers)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
        ctype = r.headers.get("content-type", "")
        assert "application/pdf" in ctype, f"Wrong content-type: {ctype}"
        cd = r.headers.get("content-disposition", "")
        assert "attachment" in cd and "filename=" in cd, f"Bad CD: {cd}"
        body = r.content
        assert body.startswith(b"%PDF-"), f"Not a PDF: starts with {body[:8]!r}"
        assert len(body) > 1000  # non-trivial PDF
