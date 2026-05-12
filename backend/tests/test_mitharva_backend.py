"""Mitharva AI backend tests — full API coverage."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # Fall back to reading from /app/frontend/.env if env var not exported
    from pathlib import Path
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
@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def demo_token(api_client):
    r = api_client.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASS})
    assert r.status_code == 200, f"Demo login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(demo_token):
    return {"Authorization": f"Bearer {demo_token}", "Content-Type": "application/json"}


# ---------------- Health ----------------
class TestHealth:
    def test_health(self, api_client):
        r = api_client.get(f"{API}/health")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"

    def test_root(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        assert "Mitharva" in r.json().get("message", "")


# ---------------- Auth ----------------
class TestAuth:
    def test_login_demo(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASS})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        assert "user" in data
        u = data["user"]
        assert u["email"] == DEMO_EMAIL
        assert "password" not in u
        assert "_id" not in u
        assert u.get("plan") in ("basic", "free", "pro")

    def test_login_wrong_password(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_signup_and_login(self, api_client):
        email = f"TEST_{uuid.uuid4().hex[:10]}@example.com"
        payload = {"full_name": "Test User", "email": email, "password": "Test@1234",
                   "phone": "+911234567890", "exam_focus": "upsc"}
        r = api_client.post(f"{API}/auth/signup", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data
        assert data["user"]["email"] == email
        assert "password" not in data["user"]
        assert "_id" not in data["user"]

        # Duplicate signup → 400
        r2 = api_client.post(f"{API}/auth/signup", json=payload)
        assert r2.status_code == 400

        # Login with new user
        r3 = api_client.post(f"{API}/auth/login", json={"email": email, "password": "Test@1234"})
        assert r3.status_code == 200

    def test_me_with_valid_token(self, api_client, auth_headers):
        r = api_client.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        u = r.json()
        assert u["email"] == DEMO_EMAIL
        assert "password" not in u
        assert "_id" not in u

    def test_me_without_token(self, api_client):
        r = api_client.get(f"{API}/auth/me")
        assert r.status_code in (401, 403)

    def test_me_invalid_token(self, api_client):
        r = api_client.get(f"{API}/auth/me", headers={"Authorization": "Bearer bad.token.value"})
        assert r.status_code == 401


# ---------------- Profile ----------------
class TestProfile:
    def test_update_profile(self, api_client, auth_headers):
        r = api_client.patch(f"{API}/profile", headers=auth_headers,
                             json={"bio": "Updated bio TEST", "target_year": 2027})
        assert r.status_code == 200
        u = r.json()
        assert u["bio"] == "Updated bio TEST"
        assert u["target_year"] == 2027
        assert "_id" not in u and "password" not in u

        # Restore
        api_client.patch(f"{API}/profile", headers=auth_headers,
                         json={"bio": "UPSC aspirant from Allahabad. Engineering graduate turning to civil services.",
                               "target_year": 2026})

    def test_profile_requires_auth(self, api_client):
        r = api_client.patch(f"{API}/profile", json={"bio": "x"})
        assert r.status_code in (401, 403)


# ---------------- Sessions ----------------
class TestSessions:
    def test_list_sessions_seeded(self, api_client, auth_headers):
        r = api_client.get(f"{API}/sessions", headers=auth_headers)
        assert r.status_code == 200
        sessions = r.json()
        assert isinstance(sessions, list)
        assert len(sessions) >= 12, f"Expected ≥12 seeded sessions, got {len(sessions)}"
        for s in sessions:
            assert "_id" not in s
            assert "id" in s and "session_type" in s

    def test_create_session(self, api_client, auth_headers):
        payload = {"session_type": "upsc", "sub_type": "full_mock",
                   "duration_minutes": 30, "difficulty": "medium",
                   "language": "english", "mode": "voice_camera"}
        r = api_client.post(f"{API}/sessions", headers=auth_headers, json=payload)
        assert r.status_code == 200
        s = r.json()
        assert s["session_type"] == "upsc"
        assert s["mode"] == "voice_camera"
        assert s["duration_minutes"] == 30
        assert s["status"] == "active"
        assert "id" in s
        assert "_id" not in s
        pytest.created_session_id = s["id"]

    def test_get_single_session(self, api_client, auth_headers):
        sid = getattr(pytest, "created_session_id", None)
        assert sid, "Need created session"
        r = api_client.get(f"{API}/sessions/{sid}", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["id"] == sid

    def test_get_session_404(self, api_client, auth_headers):
        r = api_client.get(f"{API}/sessions/{uuid.uuid4()}", headers=auth_headers)
        assert r.status_code == 404

    def test_sessions_requires_auth(self, api_client):
        r = api_client.get(f"{API}/sessions")
        assert r.status_code in (401, 403)

    def test_session_turn_llm(self, api_client, auth_headers):
        sid = getattr(pytest, "created_session_id", None)
        assert sid
        r = api_client.post(f"{API}/sessions/turn", headers=auth_headers,
                            json={"session_id": sid,
                                  "user_message": "Hello, I am ready for the interview. My name is Rahul Kumar.",
                                  "question_index": 0}, timeout=60)
        assert r.status_code == 200
        data = r.json()
        assert "raw" in data and "parsed" in data
        parsed = data["parsed"]
        assert isinstance(parsed, dict)
        # Should have either valid LLM result or fallback — both have nextQuestion+evaluation
        assert "nextQuestion" in parsed
        assert "evaluation" in parsed
        ev = parsed["evaluation"]
        assert "overallScore" in ev
        assert isinstance(float(ev.get("overallScore", 0)), float)

    def test_session_turn_invalid_session(self, api_client, auth_headers):
        r = api_client.post(f"{API}/sessions/turn", headers=auth_headers,
                            json={"session_id": str(uuid.uuid4()),
                                  "user_message": "hi", "question_index": 0})
        assert r.status_code == 404

    def test_complete_session(self, api_client, auth_headers):
        sid = getattr(pytest, "created_session_id", None)
        assert sid
        # First get current total_interviews
        me_before = api_client.get(f"{API}/auth/me", headers=auth_headers).json()
        before_total = me_before.get("total_interviews", 0)

        transcript = [
            {"role": "assistant", "content": "Q1", "evaluation": {"overallScore": 8.0, "technicalScore": 8, "clarityScore": 7, "structureScore": 7.5, "confidenceEstimate": 7}},
            {"role": "user", "content": "answer 1"},
            {"role": "assistant", "content": "Q2", "evaluation": {"overallScore": 7.0, "technicalScore": 7, "clarityScore": 7, "structureScore": 7, "confidenceEstimate": 7}},
        ]
        r = api_client.post(f"{API}/sessions/complete", headers=auth_headers,
                            json={"session_id": sid, "transcript": transcript,
                                  "duration_seconds": 600, "camera_used": True})
        assert r.status_code == 200, r.text
        s = r.json()
        assert s["status"] == "completed"
        assert s["overall_score"] == 7.5
        assert s["camera_used"] is True
        assert "_id" not in s

        # Verify increment
        me_after = api_client.get(f"{API}/auth/me", headers=auth_headers).json()
        assert me_after["total_interviews"] == before_total + 1


# ---------------- Questions ----------------
class TestQuestions:
    def test_questions_all(self, api_client):
        r = api_client.get(f"{API}/questions")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list) and len(items) >= 10
        for q in items:
            assert "_id" not in q

    def test_questions_upsc(self, api_client):
        r = api_client.get(f"{API}/questions", params={"category": "upsc"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 10
        assert all(q["category"] == "upsc" for q in items)

    def test_questions_banking(self, api_client):
        r = api_client.get(f"{API}/questions", params={"category": "banking"})
        assert r.status_code == 200
        items = r.json()
        assert all(q["category"] == "banking" for q in items)


# ---------------- Practice Feedback ----------------
class TestPracticeFeedback:
    def test_practice_feedback(self, api_client, auth_headers):
        r = api_client.post(f"{API}/practice/feedback", headers=auth_headers,
                            json={"question": "What is cooperative federalism?",
                                  "answer": "Cooperative federalism is the idea that the Union and States work together rather than competitively. Example: GST Council.",
                                  "exam_type": "upsc"}, timeout=60)
        assert r.status_code == 200
        data = r.json()
        assert "score" in data
        assert "strengths" in data
        assert "improvements" in data

    def test_practice_feedback_requires_auth(self, api_client):
        r = api_client.post(f"{API}/practice/feedback", json={"question": "x", "answer": "y"})
        assert r.status_code in (401, 403)


# ---------------- Current Affairs ----------------
class TestCurrentAffairs:
    def test_list_current_affairs(self, api_client):
        r = api_client.get(f"{API}/current-affairs")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 10, f"Expected ≥10, got {len(items)}"
        # Sorted desc by published_date
        dates = [i["published_date"] for i in items]
        assert dates == sorted(dates, reverse=True)
        for i in items:
            assert "_id" not in i
            assert "title" in i

    def test_news_questions_generation(self, api_client, auth_headers):
        r = api_client.post(f"{API}/current-affairs/questions", headers=auth_headers,
                            json={"news_title": "RBI holds repo rate at 6.25%",
                                  "news_summary": "MPC unanimously held the repo rate at 6.25% citing stable inflation at 4.1%."},
                            timeout=60)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert "question" in data[0]


# ---------------- Subscription ----------------
class TestSubscription:
    def test_mock_pay_invalid_plan(self, api_client, auth_headers):
        r = api_client.post(f"{API}/subscription/mock-pay", headers=auth_headers, json={"plan": "ultra"})
        assert r.status_code == 400

    def test_mock_pay_pro(self, api_client, auth_headers):
        r = api_client.post(f"{API}/subscription/mock-pay", headers=auth_headers, json={"plan": "pro"})
        assert r.status_code == 200
        data = r.json()
        assert data["success"] is True
        assert data["plan"] == "pro"
        assert data["amount"] == 499

        # Verify user plan updated
        me = api_client.get(f"{API}/auth/me", headers=auth_headers).json()
        assert me["plan"] == "pro"

    def test_billing_history(self, api_client, auth_headers):
        r = api_client.get(f"{API}/subscription/history", headers=auth_headers)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        latest = items[0]
        assert latest["status"] == "paid"
        assert "razorpay_payment_id" in latest
        assert "_id" not in latest

    def test_mock_pay_requires_auth(self, api_client):
        r = api_client.post(f"{API}/subscription/mock-pay", json={"plan": "pro"})
        assert r.status_code in (401, 403)


# ---------------- Dashboard ----------------
class TestDashboard:
    def test_dashboard_stats(self, api_client, auth_headers):
        r = api_client.get(f"{API}/dashboard/stats", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        for k in ("total_sessions", "avg_score", "chart_data", "radar", "recent"):
            assert k in data, f"Missing {k}"
        assert data["total_sessions"] >= 12
        assert isinstance(data["chart_data"], list)
        assert isinstance(data["radar"], dict)
        for k in ("Technical", "Communication", "Confidence", "Structure", "CurrentAffairs", "Domain"):
            assert k in data["radar"]
        for s in data["recent"]:
            assert "_id" not in s

    def test_dashboard_requires_auth(self, api_client):
        r = api_client.get(f"{API}/dashboard/stats")
        assert r.status_code in (401, 403)
