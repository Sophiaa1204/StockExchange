from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from bigbucks.auth import login_required

bp = Blueprint('trade', __name__)


@bp.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')
