Current task:
	> Compile task(-__headlines__) for each category

@Tobias
#data:
	> subset of stocks?
		> S&P 500 index (?)
			> alternatives: NASDAQ{100|500}
	> initial load
	> microservice
		> every x interval: execute code
		> data source?
			> choice of API
				> __alphavantage__ (_daily_ for last ~20y in 1 call)
				> 5 calls / 1 min

@Jonas
#backend:
	> switch DB architecture
		> to what? (__PostgreSQL__)
	~~(> user authentication model)~~ user login / creation
	> finalize data model
		> Transaction model
			> does this implementation make sense?
	> groundwork for company metadata model

@Emre
#frontend:
	> routing
	> user can interact w/ his own portfolio
		> doesn't need to be anything fancy

	> portfolio
		> stocks
		> cash value
			> for stock in portfolio: cash_value += stock.value * amount
				> stock.value := most_recent_value < lookup