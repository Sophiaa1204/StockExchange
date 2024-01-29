from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from bigbucks.auth import login_required
from flask import jsonify
import json
import numpy as np
import pandas as pd
# bigbucks
from bigbucks_db import *
from bigbucks_port.portfolio import *

url = "https://lhjpufbcymwhprgzfbwt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanB1ZmJjeW13aHByZ3pmYnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2MDY3MDMsImV4cCI6MTk5NTE4MjcwM30.42A0qtrLYChbrdUzjf1E7TRgHionW5xrZRK-e9wBqPk"
STOCK_API_KEYS = "9Q91BWGMOE13WOR3"


bp = Blueprint('getChartData', __name__)

@bp.route('/getEfficientFrontierData', methods=(["GET"]))
@login_required
def get_efficient_frontier():
    try:
        objs = Table_View(url, key)
        user_id = session.get('customer_id')
        # risk and return pairs
        data =frontier_json(objs,user_id,100)
        return_risk = json.loads(data)["data"]
        labels = json.loads(data)["labels"]
        format_return_risk = [{"x": item["std"], "y": item["mean"]} for item in return_risk]
        # # get the label list
        # labels=[]
        # # r_r_list = []
        # for item in return_risk:
        #     # r_r_list.append({"std":item["std"],"mean":item["mean"]})
        #     labels.append(item["std"])
        result = {"data":format_return_risk,"labels":labels}
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/getTimeSeriesDatabyStock',methods=(["POST"]))
def get_stock_price():
    try:
        stock_symbol =request.json["ticker"]
        objs = Table_View(url, key)
        prices_json = objs.view_symbol_price_data(stock_symbol)
        if len(prices_json)==0:
            raise Exception("This symbol has no historical price data")
        # list of json objects
        # prices = json.loads(prices_json)
        # Get the adjusted close and date 
        date_list = []
        js_list = []
        for item in prices_json:
            date_list.append(item["date"])
            js_list.append({"x":item["date"],"y":item["adjusted_close"]})
        result = {"labels":date_list,"data":js_list}
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@bp.route('/getDailySimpleReturnByTicker',methods=(["POST"]))
def get_stock_return():
    try:
        stock_symbol =request.json["ticker"]
        print(stock_symbol)
        objs = Table_View(url, key)
        user_id = session.get('customer_id')
        returns_list = json.loads(return_json(objs,user_id))
        js_data = []
        labels = []
        for item in returns_list:
            if item["Symbol"] == stock_symbol:
                js_data = item["data"]
                labels = item["labels"]
        if len(js_data) ==0:
            raise Exception("This user does not hold this stock")
        format_return = [{"x": item["date"], "y": item["return"]} for item in js_data]
        response = {"labels":labels,"data":format_return}
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/getReturnComparisonByTicker',methods=(["POST"]))
def get_return_compare():
    try:
        stock_symbol =request.json["ticker"]
        objs = Table_View(url, key)
        user_id = session.get('customer_id')
        returns_list = json.loads(return_json(objs,user_id))
        js_data = []
        for item in returns_list:
            if item["Symbol"] == stock_symbol:
                js_data = item["data"]
        if len(js_data) ==0:
            raise Exception("This user does not hold this stock")
        returns = [item["return"] for item in js_data]
        fromat_return = [{"x":round(returns[i-1],3),"y":round(returns[i],3)} for i in range(1,len(returns))]
        response = {"data":fromat_return}
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/getReturnHistogramDataByTicker',methods=(["POST"]))
def get_return_his():
    try:
        stock_symbol =request.json["ticker"]
        objs = Table_View(url, key)
        user_id = session.get('customer_id')
        returns_list = json.loads(return_json(objs,user_id))
        js_data = []
        for item in returns_list:
            if item["Symbol"] == stock_symbol:
                js_data = item["data"]
        if len(js_data) ==0:
            raise Exception("This user does not hold this stock")
        format_return = [item["return"] for item in js_data]
        # create a list of interval tuples
        values = [round(x,3) for x in np.linspace(min(format_return),max(format_return),11)]
        intervals = [(values[i],values[i+1]) for i in range(10)]
        # count returns in each interval
        counts = [0 for _ in intervals]
        for r in format_return:
            for i, (interval_start, interval_end) in enumerate(intervals):
                if interval_start <= r <= interval_end:
                    counts[i]+=1
        response = {"labels":values,"data":counts}
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/getSharpeRatio',methods=(["GET"]))
def get_sharpe():
    try:
        objs = Table_View(url, key)
        user_id = session.get('customer_id')
        rf = 0.033
        js_stat = cur_risk_return(rf,objs,user_id)
        sharpe = round(js_stat["sharpe"],3)
        response = {"data":sharpe}
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/getStockIndexComparison',methods=(["POST"]))
def get_stock_index():
    try:
        stock_symbol =request.json["ticker"]
        objs = Table_View(url, key)
        prices_json = objs.view_symbol_price_data(stock_symbol)
        index_json = objs.view_table_data("SP500_Index")
        if len(prices_json)==0:
            raise Exception("This symbol has no historical price data")
        df_stock = pd.json_normalize(prices_json)
        df_stock.sort_values(by='date',inplace=True)
        df_stock = df_stock[['date','adjusted_close']]
        df_stock.set_index('date',inplace=True)
        df_index = pd.json_normalize(index_json)
        df_index.sort_values(by='date',inplace=True)
        df_index = df_index[['date','close']]
        df_index.set_index('date',inplace=True)
        data = pd.concat([df_index,df_stock],axis=1)
        data.dropna(inplace=True)
        data.reset_index(inplace=True)
        data.columns=['date','index','stock']
        data_list = data.to_dict(orient='records')
        stock_list = []
        index_list = []
        for item in data_list:
            stock_list.append({"x":item["date"],"y":item["stock"]})
        for item in data_list:
            index_list.append({"x":item["date"],"y":item["index"]})
        result = {"stock":stock_list,"index":index_list}
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/getReturnComparisonIndexByTicker',methods=(["POST"]))
def get_stock_index_return():
    try:
        stock_symbol =request.json["ticker"]
        objs = Table_View(url, key)
        user_id = session.get('customer_id')
        spy = spy_returns(objs)
        spy.set_index('date',inplace=True)
        returns = cal_returns(objs,user_id)
        if stock_symbol not in returns.columns:
            raise Exception("This user does not hold this stock")
        data = pd.concat([spy,returns[stock_symbol]],axis=1)
        data.dropna(inplace=True)
        data.reset_index(inplace=True)
        data.columns=['date','index','stock']
        data_list = data.to_dict(orient='records')
        stock_list = []
        index_list = []
        for item in data_list:
            stock_list.append({"x":item["date"],"y":item["stock"]})
        for item in data_list:
            index_list.append({"x":item["date"],"y":item["index"]})
        result = {"stock":stock_list,"index":index_list}
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/getScatterStockIndexReturnComparison',methods=(["POST"]))
def get_stock_index_scatter():
    try:
        stock_symbol =request.json["ticker"]
        objs = Table_View(url, key)
        user_id = session.get('customer_id')
        returns_list = json.loads(return_json(objs,user_id))
        stock_data = []
        for item in returns_list:
            if item["Symbol"] == stock_symbol:
                stock_data = item["data"]
        if len(stock_data) ==0:
            raise Exception("This user does not hold this stock")
        spy_data = json.loads(spy_json(objs))["data"]
        stock_list = [x["return"] for x in stock_data]
        index_list = [x["return"] for x in spy_data]
        format_data = [ {'x': index, 'y': stock} for index,stock in zip(index_list, stock_list)]
        result = {"data":format_data}
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400