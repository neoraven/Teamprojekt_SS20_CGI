TODO:
	stock > purchase at xyz > lookup(most recent trade price) > write to DB

	Transaction model:
		timestamp
		symbol
		amount
		transaction_type
		price_at


	Recommendation algorithm:
		- model: Company (**metadata > sector, date_founded)
			> what additional data can we get?
				> e.g. news articles etc.
					> NLP
			> separate app


	/api/prices?symbol=AAPL&datefrom=2020-01-01&dateto=now
