import React from "react";
import Highstock from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Boost from "highcharts/modules/boost"
import "./style.css"

function ResultsChart(props) {
    
    Boost(Highstock)

    return (
        <HighchartsReact
            highcharts={Highstock}
            constructorType="stockChart"
            options = {{
                title: {
                    text: props.strategy.strategy + " Simulation"
                },
                series: [{
                    type : "line",
                    data: props.evaluation_history,
                }],
            }}
        />   
    )
}

export default ResultsChart