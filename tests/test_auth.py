import pytest
from flask import g, session

def test_register(client,app,supabase):
    response = client.post(
        '/auth/register', data={'InputFirstName': 'a', 'InputLastName': 'a', 'InputPhoneNumber': '1', 'InputEmail':'@email.com','InputUserName':'test','InputPassword': 'test'}
    )
    print(response.headers)
    assert response.headers["Location"] == "/auth/login"
    with app.app_context():
        try:
            assert supabase.table('Customer_Information').select("*").eq('user_name','test').execute() is not None
            supabase.table('Customer_Information').delete().eq('user_name','test').execute()
        except:
            raise AssertionError("test case not registered in databse")


def test_login(client, auth):
    assert client.get('/auth/login').status_code == 200
    response = auth.login()
    print(response.status_code)
    assert response.headers["Location"] == "/"

    with client:
        client.get('/')
        assert g.user.data[0]['user_name'] == 'WendyCui'

@pytest.mark.parametrize(('username', 'password', 'message'), (
    ('WendyCui', 'test', b'Incorrect email or password.'),
))
def test_login_validate_input(auth, username, password, message):
    response = auth.login(username, password)
    assert message in response.data

def test_logout(client, auth):
    auth.login()

    with client:
        auth.logout()
        assert 'customer_id' not in session

