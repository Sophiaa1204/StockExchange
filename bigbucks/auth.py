from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for,jsonify
)
import functools
from supabase import create_client

url = "https://lhjpufbcymwhprgzfbwt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanB1ZmJjeW13aHByZ3pmYnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2MDY3MDMsImV4cCI6MTk5NTE4MjcwM30.42A0qtrLYChbrdUzjf1E7TRgHionW5xrZRK-e9wBqPk"

supabase = create_client(url, key)

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=(["POST"]))
def register():
    firstname = request.json['first_name']
    lastname = request.json['last_name']
    phonenum = request.json['phone_number']
    email = request.json['email']
    username = request.json['username']
    password = request.json['password']
    error = None
    if not email:
        error = 'Email is required.'
    elif not firstname:
        error = 'Firstname is required.'
    elif not lastname:
        error = 'Lastname is required.'
    elif not username:
        error = 'Username is required.'
    elif not password:
        error = 'Password is required.'

    if error is None:
        # Unique requirement for Username
        response = supabase.table('Customer_Information').select("*").eq('user_name', username).execute()

        if len(response.data) != 0:
            error = f"Username {username} is already registered."
        else:
            # Register data into database
            try:
                supabase.table('Customer_Information').insert({'first_name': firstname, 'last_name': lastname, 'phone_number': phonenum, 'email_address': email,'user_name': username, 'password': password, 'account_balance': 1000000}).execute()
            except Exception as e:
                error = e.message
                print(error)
                return jsonify({'error': error}), 400
            return jsonify({'status': 'Success'}), 200
    if error:
        flash(error)
    return jsonify({'error': error}), 400


@bp.route('/login', methods=(["POST"]))
def login():
    username = request.json['username']
    password = request.json['password']
    error = None
    if not username:
        error = 'Username is required.'
    elif not password:
        error = 'Password is required.'
    else:
        # Check if Username exists
        response = supabase.table('Customer_Information').select("*").eq('user_name', username).execute()
        if len(response.data) != 0:
            password_true = response.data[0]['password']
            customer_id = response.data[0]['customer_id']
            if password_true == password:
                session.clear()
                session['customer_id'] = customer_id
                return jsonify({'status': 'Success'}), 200
        error = 'Incorrect email or password.'
    print(error)
    return jsonify({'error': error}), 400

@bp.route('/login', methods=(["GET"]))
def get_login():
    return render_template('index.html')


@bp.before_app_request
def load_logged_in_user():
    customer_id = session.get('customer_id')

    if customer_id is None:
        g.user = None
    else:
        g.user = supabase.table('Customer_Information').select("*").eq('customer_id', customer_id).execute().data[0]


@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view


# add username from current session
@bp.route('/username')
def profile():
    username = session['username'] # retrieve the username from the session object
    user = User.query.filter_by(username=username).first()
    return jsonify(user)







