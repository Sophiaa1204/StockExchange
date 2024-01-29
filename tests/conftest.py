import pytest
from bigbucks import create_app
from supabase import Client, create_client

@pytest.fixture(scope="session")
def supabase() -> Client:
    url = "https://lhjpufbcymwhprgzfbwt.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanB1ZmJjeW13aHByZ3pmYnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2MDY3MDMsImV4cCI6MTk5NTE4MjcwM30.42A0qtrLYChbrdUzjf1E7TRgHionW5xrZRK-e9wBqPk"
    return create_client(url, key)

@pytest.fixture
def app():

    app = create_app({
        'TESTING': True,
    })

    yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()

class AuthActions(object):
    def __init__(self, client):
        self._client = client

    def login(self, username='WendyCui', password='wendy4646'):
        return self._client.post(
            '/auth/login',
            data={'InputUsername': username, 'InputPassword': password}
        )

    def logout(self):
        return self._client.get('/auth/logout')

@pytest.fixture
def auth(client):
    return AuthActions(client)