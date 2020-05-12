Current task:
	> Compile task(-__headlines__) for each category
		> due: 05/11/2020

@Tobias
#data:
	> subset of stocks?
		> S&P 500 index
	> initial load
	> microservice
		> every x interval: execute code
		> data source?
			> choice of API
				> __alphavantage__ (_daily_ for last ~20y in 1 call)
				> 5 calls / 1 min

@Jonas
#backend:
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


#Goal for next sprint:
	1. User can interact w/ a portfolio (view / buy / sell)
		- User authentication (signup / login)
			> Frontend component: signup page (> django native)
		- App needs to pull appropriate prices of the right symbol & timestamp
		- Frontend interface to visualize the portfolio
			> Grab and print user's portfolio
			> Buttons to view / buy / sell
			> Component to visualize a symbol's history?
	2. Application has data for all S&P 500 stocks
		- Choose approach:
			> Django app does fetching & writing itself?
			> Separate agent sending data via .json to an API of the django app?
	3. Data model needs to support meta data models that can link back to the stocks module
