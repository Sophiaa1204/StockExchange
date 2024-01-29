from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

# from flaskr.auth import login_required

bp = Blueprint('overview', __name__)

@bp.route('/index')
@bp.route('/')
def index():
    return render_template('index.html')
