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
import requests

url = "https://lhjpufbcymwhprgzfbwt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanB1ZmJjeW13aHByZ3pmYnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2MDY3MDMsImV4cCI6MTk5NTE4MjcwM30.42A0qtrLYChbrdUzjf1E7TRgHionW5xrZRK-e9wBqPk"
STOCK_API_KEYS = "9Q91BWGMOE13WOR3"


bp = Blueprint('makeTransaction', __name__)

@bp.route('/makeTransaction/<string:stock_symbol>/<string:condition>/<int:num_shares>', methods=(["GET"]))
@bp.route('/makeTransaction/<string:stock_symbol>/<string:condition>/<int:num_shares>/<string:date_time>', methods=(["GET"]))
@login_required
def make_transaction(stock_symbol, condition, num_shares, date_time=None):
    # example : /makeTransaction/IBM/buy/123
    try:
        db = Table_Updates(url, key, STOCK_API_KEYS)

        user_id  = session.get('customer_id')
    
        user_name = str(get_username_by_id(user_id))

        # get realtime price
        # check if date exisits 
        if (date_time != None):
            price = get_history_price(stock_symbol, date_time)

        else:
            stock = Buy_And_Sell(STOCK_API_KEYS)
            price = stock.get_realtime_stock_price(stock_symbol)

        # make transaction data
        tmp = db.update_transaction_records(user_name, condition, stock_symbol, int(num_shares), price)

        # update transaction data
        db.supabase_insert_function(tmp[0], tmp[1]) 

        return jsonify({'status' : 'success'}), 200
    except:
        return jsonify({'error': 'Fail to update transaction data'}), 400
    

def get_username_by_id(id : int):
    api_url = url + "/rest/v1/" + 'Customer_Information' + "?customer_id=eq." + str(id)

    parameters =  {"apikey": key}

    response = requests.get(url =api_url, params = parameters)
    data = json.loads(response.text)

    return data[0]["user_name"]

# get historical price data 
def get_history_price(stock_symbol : str, date_time : str):
    # should be at format "2021-01-12"
    base_url = 'https://www.alphavantage.co/query?'
    params = {"function": "TIME_SERIES_DAILY_ADJUSTED", "symbol": stock_symbol, "outputsize" : "full","apikey": "9Q91BWGMOE13WOR3"}
    
    response = requests.get(base_url, params=params)
    data = response.json() # dict
    # store all data 
    #all_data[stock_symbol] = data['Time Series (Daily)']
    history_price = data['Time Series (Daily)'][date_time]['5. adjusted close']

    # tmp = {}
    # tmp["HistoryPirce"] = history_price

    return history_price







