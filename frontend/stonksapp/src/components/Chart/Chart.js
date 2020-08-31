
import React from "react";
import HighStock from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import Boost from "highcharts/modules/boost"
import "./style.css";

function Chart(props) {
	Indicators(HighStock);
	DragPanes(HighStock);
	AnnotationsAdvanced(HighStock);
	PriceIndicator(HighStock);
	FullScreen(HighStock);
	StockTools(HighStock);
	Boost(HighStock)

	return (
		<HighchartsReact
			highcharts={HighStock}
			constructorType="stockChart"
			containerProps = {{style : {height : '400px'}}}
			options={
				{	
					chart : {
						renderTo : 'container', 
					},
					rangeSelector : {
						x : 20 
					},
					yAxis: [{
						labels: {
							align: 'left'
						},
						height: '80%',
						resize: {
							enabled: true
						}
						}, {
						labels: {
							align: 'left'
						},
						top: '80%',
						height: '20%',
						offset: 0
						}],
						tooltip: {
						shape: 'square',
						headerShape: 'callout',
						borderWidth: 0,
						shadow: false,
						positioner: function (width, height, point) {
							var chart = this.chart,
							position;
					
							if (point.isHeader) {
							position = {
								x: Math.max(
								// Left side limit
								chart.plotLeft,
								Math.min(
									point.plotX + chart.plotLeft - width / 2,
									// Right side limit
									chart.chartWidth - width - chart.marginRight
								)
								),
								y: point.plotY
							};
							} else {
							position = {
								x: point.series.chart.plotLeft,
								y: point.series.yAxis.top - chart.plotTop
							};
							}

							return position;
						}
					},
					series: [
						{
							type: "candlestick",
							id: props.stock.symbol.toLowerCase()+"-stock-price",
							name: props.stock.symbol + " Stock Price",
							data: props.ohlc,
							dataGrouping : {
								forced : true,
								units : [
									['day', [1]],
									['week', [1]],
									['month',[1, 3, 6]]
								]
							},
						},
						{
							type: "column",
							id: props.stock.symbol.toLowerCase()+"-volume",
							name: props.stock.symbol + " Volume",
							data: props.volume,
							yAxis: 1,
						}
					],
					responsive: {
						rules: [{
							condition: {
								maxWidth: 800
							},
							chartOptions: {
								rangeSelector: {
									inputEnabled: false
								}
							}
						}]
					},
					stockTools : {
						gui : {
							buttons : [
								'indicators',
								'typeChange', 
								'currentPriceIndicator', 
								'fullScreen'
							]
						}
					}
				}
			}
		/>
	);
}

export default Chart


