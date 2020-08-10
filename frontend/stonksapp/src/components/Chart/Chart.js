
import React from "react";
import HighStock from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import "./style.css";

// init the module

Indicators(HighStock);
DragPanes(HighStock);
AnnotationsAdvanced(HighStock);
PriceIndicator(HighStock);
FullScreen(HighStock);
StockTools(HighStock);

function Chart(props) {
	console.log(props.ohlc)
	return (
		<HighchartsReact
			highcharts={HighStock}
			constructorType={"stockChart"}
			options={
				{
					rangeSelector: {
						selected: 1
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
					xAxis : {
						endOnTick : true
					},
					
					tooltip: {
						shape: "square",
						headerShape: "callout",
						borderWidth: 0,
						shadow: false,
					},
					series: [
						{
							type: "candlestick",
							id: props.stock.symbol,
							name: props.stock.symbol + " Stock Price",
							data: props.ohlc,
							dataGrouping : {
								enabled : true
							}
							
						},
						{
							type: "column",
							id: props.stock.symbol,
							name: props.stock.symbol + " Volume",
							data: props.volume,
							yAxis: 1
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
					}
				}
			}
		/>
	);
}

export default Chart


