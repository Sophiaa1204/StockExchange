from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from bigbucks.auth import login_required

import os
from supabase import create_client, Client
# bigbucks_db
from bigbucks_db import *
from flask import jsonify
from bigbucks_port.portfolio import *
import json

url = "https://lhjpufbcymwhprgzfbwt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanB1ZmJjeW13aHByZ3pmYnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2MDY3MDMsImV4cCI6MTk5NTE4MjcwM30.42A0qtrLYChbrdUzjf1E7TRgHionW5xrZRK-e9wBqPk"
STOCK_API_KEYS = "9Q91BWGMOE13WOR3"


bp = Blueprint('getAssetBalance', __name__)


@bp.route('/getAssetBalance', methods=(["GET"]))
@login_required
def getAssetBalance():
    try:
        # Connect to supabase
        objs = Table_View(url, key)

        user_id = session.get('customer_id')
        holding = holding_json(objs, user_id)

        return jsonify(holding), 200
    except:
        return jsonify({'error': 'Incorrect customer_id or fail to get data'}), 400



