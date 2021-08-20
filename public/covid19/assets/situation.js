document.addEventListener('DOMContentLoaded', function() {
  getSituation()
  if(localStorage.getItem('jwt')) {
    $('.navbar-nav').append(`<a class="nav-link" style="cursor: pointer;" id="chile" href="./situation.html">Situacion Chile</a>`)
    $('.navbar-nav').append(`<a class="nav-link" style="cursor: pointer;" onclick="logout()" id="logout">Cerrar sesión</a>`)
  } else {
    window.location.replace('http://localhost:3000/covid19')
  }
})

function logout() {
  localStorage.clear()
  window.location.replace('http://localhost:3000/covid19')
}

function loaderShow() {
  $('body').prepend(`
  <div id="shadow" style="z-index: 15; width: 100vw; height: 100vh; position: absolute; background-color: black; opacity: 0.7;"></div>
  <div id="spinner" style="z-index: 20; position: absolute; top: 50%; left: 50%;">
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>
  `)
}

function loaderHide() {
  $('#spinner').fadeOut()
  $('#shadow').fadeOut()
}

async function getSituation() {
  loaderShow()
  const token = localStorage.getItem('jwt');
  try {
    const dataConfirmed = await fetch("http://localhost:3000/api/confirmed", {headers: {"Authorization": token}})
    const dataDeaths = await fetch("http://localhost:3000/api/deaths", {headers: {"Authorization": token}})
    const dataRecovered = await fetch("http://localhost:3000/api/recovered", {headers: {"Authorization": token}})
    const confirmed = await dataConfirmed.json()
    const deaths = await dataDeaths.json()
    const recovered = await dataRecovered.json()
    drawChart(confirmed, deaths, recovered)
  } catch(e) {
    console.log(e);
  }
  loaderHide()
}

function drawChart(confirmed, deaths, recovered) {
  let total_confirmed = _.map(confirmed.data, function(d) { return d.total })
  let total_deaths = _.map(deaths.data, function(d) { return d.total })
  let total_recovered = _.map(recovered.data, function(d) { return d.total })

  Highcharts.chart('chart', {
    title: {
      text: 'Situacion actual Chile'
    },
    subtitle: {
      text: 'Actualizado'
    },
    yAxis: {
      title: {
        text: 'Cantidad de personas'
      }
    },
    xAxis: {
      title: {
        text: 'Total de días'
      },
      accessibility: {
        rangeDescription: 'Última semana'
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: 1
      }
    },
    series: [
      {
        name: 'Confirmados',
        data: total_confirmed
      },
      {
        name: 'Muertos',
        data: total_deaths
      },
      {
        name: 'Recuperados',
        data: total_recovered
      }
    ]
  })
}