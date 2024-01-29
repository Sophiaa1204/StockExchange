from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from bigbucks.auth import login_required

import os
from supabase import create_client, Client
# bigbucks_db 
from bigbucks_db import *
from flask import jsonify

url = "https://lhjpufbcymwhprgzfbwt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanB1ZmJjeW13aHByZ3pmYnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2MDY3MDMsImV4cCI6MTk5NTE4MjcwM30.42A0qtrLYChbrdUzjf1E7TRgHionW5xrZRK-e9wBqPk"
STOCK_API_KEYS = "9Q91BWGMOE13WOR3"


bp = Blueprint('getRealtimePrice', __name__)


@bp.route('/getRealtimePrice/<string:stock_symbol>', methods=(["GET"]))
def get_Realtime_Price(stock_symbol : str):
    try:
        objs = Buy_And_Sell(STOCK_API_KEYS)
        # realtime stock data within 1 mins interval
        price = objs.get_realtime_stock_price(stock_symbol)

        realtime_data = {}
        realtime_data[stock_symbol] = price
    
        return jsonify(realtime_data), 200
    except:
        return jsonify({'error': 'stock_symbol incorrect or fail to get realtime data from Yahoo'}), 400


