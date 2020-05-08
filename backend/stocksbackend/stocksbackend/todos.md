#data:
	> subset of stocks?
		> S&P 500 index (?)
			> alternatives: NASDAQ{100|500}
	> initial load
	> microservice
		> every x interval: execute code
		> data source?
			> choice of API

#backend:
	> switch DB architecture
		> to what? (__PostgreSQL__)
	~~(> user authentication model)~~ user login / creation
	> finalize data model
		> Transaction model
			> does this implementation make sense?

#frontend:
	> routing
	> user can interact w/ his own portfolio
		> doesn't need to be anything fancy

	> portfolio
		> stocks
		> cash value
			> for stock in portfolio: cash_value += stock.value * amount
				> stock.value := most_recent_value < lookup
