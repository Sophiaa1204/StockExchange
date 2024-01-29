import unittest
import yfinance as yf
import os 
import requests
from bigbucks_db import *
from bigbucks_port.portfolio import *
import time
SUPABASE_URL = "https://lhjpufbcymwhprgzfbwt.supabase.co"
KEYS = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanB1ZmJjeW13aHByZ3pmYnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2MDY3MDMsImV4cCI6MTk5NTE4MjcwM30.42A0qtrLYChbrdUzjf1E7TRgHionW5xrZRK-e9wBqPk"
STOCK_API_KEYS = "9Q91BWGMOE13WOR3"
class BuyAndSell(unittest.TestCase):
	# buy and sell part 
	def test_buy(self):
		objs = Table_View(SUPABASE_URL, KEYS)
		# user_name : str
		# Send a request to the protected endpoint with the authentication token

		# run the below curl in the web browser before do this test
		# url = 'http://127.0.0.1:5000/makeTransaction/IBM/buy/90'
	
		user_name = "Jeffd"


		time.sleep(2)

		results = objs.view_customer_transaction(user_name)

		data = yf.download(tickers= "IBM", period='1d', interval='1m')
		real_data = float(data.iloc[-1]["Adj Close"])

		check = ('buy', 90, round(real_data, 12))
		
		our_ans = results["IBM"]

		#print(check)
		ct = 0
		for i in our_ans:
			#print(i)

			if (check[0] == i[0] and check[1] == i[1] and round(i[2],2) == round(128.589996337891,2)):
				ct = ct + 1

		self.assertEqual(ct, 1, "Transaction not found")

	def test_sell(self):
		objs = Table_View(SUPABASE_URL, KEYS)
		# user_name : str
		# Send a request to the protected endpoint with the authentication token

		# run the below curl in the web browser before do this test
		# url = 'http://127.0.0.1:5000/makeTransaction/IBM/sell/90'
	
		user_name = "Jeffd"


		time.sleep(2)

		results = objs.view_customer_transaction(user_name)

		data = yf.download(tickers= "IBM", period='1d', interval='1m')
		real_data = float(data.iloc[-1]["Adj Close"])

		check = ('sell', 20, int(real_data))
		
		our_ans = results["IBM"]

		#print(check)
		ct = 0
		for i in our_ans:

			#print(i)
			if (check[0] == i[0] and check[1] == i[1] and check[2] == int(i[2])):

				ct = ct + 1

		self.assertEqual(ct, 1, "Transaction not found")
		

class StockTest(unittest.TestCase):
	# test
	def test_AAPL_realtime_data(self):
		stock_symbol = "AAPL"
		data = yf.download(tickers= stock_symbol, period='1d', interval='1m')
		real_data = float(data.iloc[-1]["Adj Close"])

		response = requests.get("http://127.0.0.1:5000/getRealtimePrice/AAPL")
		our_data = response.json()
	
		self.assertEqual(int(real_data), int(our_data["AAPL"]), "Should be " + str(real_data))

	def test_IBM_realtime_data(self):
		stock_symbol = "IBM"
		data = yf.download(tickers= stock_symbol, period='1d', interval='1m')
		real_data = float(data.iloc[-1]["Adj Close"])

		response = requests.get("http://127.0.0.1:5000/getRealtimePrice/IBM")
		our_data = response.json()
	
		self.assertEqual(round(real_data, 2), round(float(our_data["IBM"]),2), "Should be " + str(real_data))

	def test_MSFT_realtime_data(self):
		stock_symbol = "MSFT"
		data = yf.download(tickers= stock_symbol, period='1d', interval='1m')
		real_data = float(data.iloc[-1]["Adj Close"])

		response = requests.get("http://127.0.0.1:5000/getRealtimePrice")
		code = response.status_code
		#our_data = response.json()
	
		self.assertEqual(code, 404, "404 Error")

class SPTest(unittest.TestCase):
	#get 5 years data 
	def test_sp500(self):
		data = yf.download(tickers= "^GSPC", period='2d')
		latest_data = data.iloc[0]["Adj Close"]
		
		real_data = round(latest_data,11)

		objs = Table_View(SUPABASE_URL, KEYS)
		our_data = objs.view_table_data("SP500_Index")


		check_data = [i['close'] for i in our_data if i['date'] == '2023-04-12']

		self.assertEqual(check_data[0], real_data, "SP500 data wrong")


	def test_five_year_data(self):
		objs = Table_View(SUPABASE_URL, KEYS)
		symbol_name = "AAPL"
		data = objs.view_symbol_price_data(symbol_name)

		our_data = [i['adjusted_close'] for i in data if i['date'] == '2023-04-12']
		our_data = our_data[0]

		base_url = 'https://www.alphavantage.co/query?'
		params = {"function": "TIME_SERIES_DAILY_ADJUSTED", "symbol": "AAPL", "outputsize" : "full","apikey": "9Q91BWGMOE13WOR3"}
		
		response = requests.get(base_url, params=params)
		data = response.json() # dict
		# store all data 
		#all_data[stock_symbol] = data['Time Series (Daily)']
		real_data = data["Time Series (Daily)"]["2023-04-12"]['5. adjusted close']

		self.assertEqual(our_data, float(real_data), "AAPL price data wrong")

class PortofolioTest(unittest.TestCase):
	def test_effcient_frontier(self):
		# Connect to supabase
		objs = Table_View(SUPABASE_URL, KEYS)

		# Connect to Alpha Vantage
		objs_realtime = Buy_And_Sell(STOCK_API_KEYS)
		self.assertEqual(json.loads(frontier_json(objs,6,1)), {"data": [{"std": 0.069, "mean": -0.018}], "labels": [0.069]}, "Effcient_Frontier data wrong")

	def test_sharpe_ratio(self):
		response = requests.get("http://127.0.0.1:5000/getSharpeRatio")
		data = response.json() # dict
		d = data['data']
		self.assertEqual(d, 1.478, "Sharpe Ratio data wrong")

		def test_shares_owned(self):
		# Connect to supabase
			objs = Table_View(SUPABASE_URL, KEYS)

			data = objs.view_customer_portfolio("Jeffd")
			
			self.assertEqual(data,{'IBM': {'shares': 170}, 'MSFT': {'shares': 370}}, "User shares wrong")


	def test_view_all_stocks(self):
		objs = Table_View(SUPABASE_URL, KEYS)
		data = objs.view_table_data("Stock_Information")

		our_data = [i['stock_symbol'] for i in data]

		self.assertEqual(our_data,['AAPL', 'IBM', 'TSLA', 'MSFT', 'AAL', 'BABA'], "View all stocks wrong")

	def test_view_orders(self):
		

		response = requests.get("http://127.0.0.1:5000/getTransactionHistory")
		data = response.json() # dict	

		our_data = data['status'] 
		
		self.assertEqual(our_data, 'success', "Fail to view transaction history")



if __name__ == '__main__':
	unittest.main(argv=[''], verbosity=2, exit=False)


