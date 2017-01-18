var Chart = require('chart.js')

var data = window.data

new Chart('coming-and-going', {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Enplaned',
        data: data.enplanedAndDeplaned.enplaned,
        borderColor: 'rgba(255, 30, 30, 1)',
        fill: false
      },
      {
        label: 'Deplaned',
        data: data.enplanedAndDeplaned.deplaned,
        borderColor: 'rgba(30, 30, 255, 1)',
        fill: false
      }
    ]
  },
  options: {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'year'
        }
      }]
    }
  }
})

new Chart('by-airline', {
  type: 'line',
  data: {
    datasets: data.byAirline.map(function (d) {
      return {
        label: d.name,
        data: d.data,
        fill: false,
        hidden: d.hidden,
        borderColor: d.color
      }
    })
  },
  options: {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'year'
        }
      }]
    }
  }
})
