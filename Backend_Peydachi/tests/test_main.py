from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == "Welcome to Peydachi"
