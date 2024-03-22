import Chart from "react-apexcharts";
import "./styles/kpWidget.css"

// component for the kp forecast chart on the main homepage
export default function KpChart({xAxis, yAxis}){

  // these options define the layout of our chart
  // what the colors will be for the labels, what the data will be for x and y axis
  // and type of chart
  const chartOptions = {
    options: {
    chart: {
      id: "line"
    },
    xaxis: {
      categories: xAxis,
      labels:{
        style: {
          colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF","#FFFFFF", "#FFFFFF"],
      },
      },

      title: {
        text: "Time",
        style:{
          color:"#FFFFFF",
        }
      }
    },

    yaxis:{
      seriesName: "series-1",
      labels:{
        style: {
          colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF","#FFFFFF", "#FFFFFF"],
      }
      },

      title: {
        text: "Kp-Index",
        style:{
          color:"#FFFFFF",
        }
      }
    }
  },
  series: [
    {
      name: "series-1",
      data: yAxis
    }
  ]
  }
    return (
      <div id="chart">
        <section id="kp-ftitle">Kp Forecast</section>
        {/* we decided to use a chart component from apex charts since it made it very easy to plot our data */}
              <Chart
              options={chartOptions.options}
              series={chartOptions.series}
                type="line"
                id="kp-chart"
                height={270}
              />
      </div>
      );
}