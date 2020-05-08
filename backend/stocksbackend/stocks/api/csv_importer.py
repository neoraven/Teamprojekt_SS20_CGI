import csv

from stocks.models import Price

FILE_PATH = r'C:\Users\Jonas\Downloads\GOOGL_20200101_20200506.csv'

with open(FILE_PATH, 'r') as f:
	reader = csv.reader(f)
	for row in reader:
		print(row)
		_, created = Price.objects.create(
			symbol=row[0],
			date=row[1],
			p_open=row[2],
			p_low=row[4],
			p_high=row[3],
			p_close=row[5],
			volume=row[6]
			)
		print(created)