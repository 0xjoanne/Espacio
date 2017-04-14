import { Bar } from 'vue-chartjs'

export default Bar.extend({
  mounted(){
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['0', '', '', '3', '', '', '6', '', '', '9', '', '', '12pm', '', '', '3', '', '', '6', '', '', '9', '', '', '12'],
      datasets: [
        {
          backgroundColor: '#21D331',
          fontStyle: "normal",
          data: [12, 20, 12, 18, 10, 6, 9, 32, 29, 19, 12, 11, 12, 20, 12, 18, 10, 6, 9, 32, 29, 19, 12, 11, 12]
        }
      ]
    }, {
      scales: {
        yAxes: [{
          display: false
        }],
        xAxes: [{
          categoryPercentage: 0.9,
          barPercentage: 0.9
        }]
      },
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false
    })
  }
})
