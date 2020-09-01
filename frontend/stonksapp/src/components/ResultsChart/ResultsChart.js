import React from "react";
import Highstock from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Boost from "highcharts/modules/boost"
import Data from "highcharts/modules/data"
import Exporting from "highcharts/modules/exporting"
import ExportData from "highcharts/modules/export-data"
import "./style.css"

function ResultsChart(props) {

    Boost(Highstock)
    Data(Highstock)
    Exporting(Highstock)
    ExportData(Highstock)
    return (
        <HighchartsReact
            highcharts={Highstock}
            constructorType="stockChart"
            containerProps = {{style : {height : '400px'}}} 
            options = {{
                chart : {
                    renderTo : "results-chart-container"
                },
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: props.strategy.strategy + " Simulation"
                },
                series: [{
                    name : props.strategy.strategy,
                    type : "line",
                    data: props.evaluation_history,
                }],
            }}
        />   
    )
}

export default ResultsChart