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


bp = Blueprint('getAccountBalance', __name__)


@bp.route('/getAccountBalance', methods=(["GET"]))
@login_required
def get_account_balance():
    try: 
        objs = Table_View(url, key)
        # table_name : str 
        # select from "Customer_Information", "Stock_Information", "Stock_Price_Daily_Data", "Transaction_Records"
        table_name = "Customer_Information"
        data = objs.view_table_data(table_name)

        # get only log in user
        user_id  = session.get('customer_id')

        # real data
        current_balance = {}

        # check current customer id 
        for info in data:
            if (info["customer_id"] == user_id):
                current_balance["current_balance"] = info["account_balance"]
      
        
        return jsonify(current_balance), 200

    except Exception as e:
        return jsonify({'error': e}), 400





