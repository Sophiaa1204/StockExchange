from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from bigbucks.auth import login_required

import os
from supabase import create_client, Client
# bigbucks_db
from bigbucks_db import *
import json
from flask import jsonify
import datetime

url = "https://lhjpufbcymwhprgzfbwt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanB1ZmJjeW13aHByZ3pmYnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2MDY3MDMsImV4cCI6MTk5NTE4MjcwM30.42A0qtrLYChbrdUzjf1E7TRgHionW5xrZRK-e9wBqPk"
STOCK_API_KEYS = "9Q91BWGMOE13WOR3"


bp = Blueprint('getTransactionHistory', __name__)


@bp.route('/getTransactionHistory', methods=(["GET"]))
def get_Transaction_History():
    try:
        objs = Table_View(url, key)
        # table_name : str
        # select from "Customer_Information", "Stock_Information", "Stock_Price_Daily_Data", "Transaction_Records"
        table_name = "Transaction_Records"
        data = objs.view_table_data(table_name)

        dict_data = {}
        dict_data['transactions'] = []
        # Example Data
        # {"transactions": [{"date":"2023-04-15","assets":"AAPL","direction":"Buy","filledPrice","$164.8","filledAmount":100,"total":"$16480"}],"status": "success"}

        # get only log in user
        user_id = session.get('customer_id')

        for d in data:
            if (d['customer_id'] == user_id):
                dict_without_date = {}
                dict_without_date['transaction_id'] = d['transaction_id']
                dict_without_date['customer_id'] = d['customer_id']
                dict_without_date['condition'] = d['condition']
                dict_without_date['stock_symbol'] = d['stock_symbol']
                dict_without_date['num_shares'] = d['num_shares']
                dict_without_date['stock_price_realtime'] = round(
                    d['stock_price_realtime'], 2)
                dict_without_date['total'] = '$' + \
                    str(int(d['stock_price_realtime'])*int(d['num_shares']))
                dict_without_date['transaction_date'] = str(
                    d['transaction_date']).split('T')[0]
                dict_data['transactions'].append(dict_without_date)
        dict_data['transactions'].reverse()
        dict_data['status'] = 'success'
        json_data = jsonify(dict_data)

        return json_data, 200

    except Exception as e:
        return jsonify({'error': e}), 400
