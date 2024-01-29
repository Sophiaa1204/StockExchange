from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from bigbucks.auth import login_required

bp = Blueprint('admin', __name__)


@bp.route('/admin')
def admin():
    return render_template('admin.html')
