

document.addEventListener('DOMContentLoaded', function() {
  getData()
  if(localStorage.getItem('jwt')) {
    $('.navbar-nav').append(`<a class="nav-link" style="cursor: pointer;" id="chile" href="./situation.html">Situacion Chile</a>`)
    $('.navbar-nav').append(`<a class="nav-link" style="cursor: pointer;" onclick="logout()" id="logout">Cerrar sesión</a>`)
  } else {
    $('.navbar-nav').append(`<a class="nav-link" style="cursor: pointer;" onclick="login()" id="login">Iniciar Sesión</a>`)
  }
})

$('#tbody').click(function(event) {
  let button = event.target
  if(button.dataset.country) {
    getInfoByCountry(button.dataset.country.toLowerCase())
  }
})

const login = () => {
  openLogInModal()
  showModal()
}

const logout = () => {
  localStorage.clear()
  window.location.replace('http://localhost:3000/covid19')
}

const getToken = async () => {
    let user = $("#email").val()
    let pass = $("#pass").val()
  try {
      const response = await fetch('http://localhost:3000/api/login',
      {
          method:'POST',
          body: JSON.stringify({email:user,password:pass})
      })
      const { token } = await response.json();
      localStorage.setItem('jwt',token);
      return token;
  }
  catch (err) {
      console.log(`Error: ${err}`);
  }
}

function getData() {
  loaderShow()
  $.ajax({
    type: "get",
    url: 'http://localhost:3000/api/total',
    dataType: "json",
    success: function(response) {
      data = response.data
      mountChart(data)
      mountTable(data)
      loaderHide()
    }
  });
}

function openLogInModal(){
  let modal = `
  <div class="modal" tabindex="-1" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Iniciar sesión</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="country-chart" class="modal-body d-flex justify-content-center">
          <form class="w-75">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email</label>
              <input id="email" type="email" class="form-control" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Password</label>
              <input type="password" class="form-control" id="pass">
            </div>
            <div class="text-center">
              <button type="button" onclick="getToken()" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  `
  $('#modal').html(modal)
}

const getInfoByCountry = (country) =>{
  $.ajax({
    type: "get",
    url: "http://localhost:3000/api/countries/" + country,
    dataType: "json",
    success:  (response) =>{
      mountModal(response.data)
      if(response.data.confirmed == undefined){
        NoData("Sin datos para mostrar")
        showModal()
      }else{
        mountCountryChart(response.data)
        showModal()
      } 
    }
  });
}

const showModal = () =>{
  let modal = document.getElementById('myModal')
  let myModal = new bootstrap.Modal(modal)
  myModal.show()
}

function NoData (mensaje) {
  document.getElementsByClassName("modal-body")[0].innerHTML = `<h5 class="text-center">${mensaje}</h5>`
  document.getElementsByClassName("modal-title")[0].innerHTML = "País"
}


const mountModal = (data) =>{
  let modal = `
  <div class="modal" tabindex="-1" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${data.location}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="country-chart" class="modal-body">
        </div>
      </div>
    </div>
  </div>
  `
  $('#modal').html(modal)
}

function getToken() {
    let user = $("#email").val()
    let pass = $("#pass").val()
    $.ajax({
      type: "post",
      url: "http://localhost:3000/api/login",
      data: {email: user, password: pass},
      dataType: "json",
      success: function (response) {
        localStorage.setItem('jwt', response.token)
        window.location.replace('http://localhost:3000/covid19')
      }
    }).fail( function() {
      alert('Usuario y/o password incorrectos');
      $("#email").val("")
      $("#pass").val("")

  });
}

function getData() {
  loaderShow()
  $.ajax({
    type: "get",
    url: 'http://localhost:3000/api/total',
    dataType: "json",
    success: function (response) {
      data = response.data
      console.log(data);
      mountChart(data)
      mountTable(data)
      loaderHide()
    }
  });
}



const loaderShow = () => {
  $('body').prepend(`
  <div id="shadow" style="z-index: 15; width: 100vw; height: 100vh; position: absolute; background-color: black; opacity: 0.7;"></div>
  <div id="spinner" style="z-index: 20; position: absolute; top: 50%; left: 50%;">
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden"></span>
    </div>
  </div>
  `)
}

const loaderHide = () =>{
  $('#spinner').fadeOut()
  $('#shadow').fadeOut()
}

const mountChart = (data) => {
  let confirmed = _.filter(data, (d) => { 
    if(d.confirmed > 1400000) {
      return d
    }
  })

    Highcharts.chart('chart', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Resumen de contagios'
      },
      subtitle: {
        text: 'Datos actualizados'
      },
      xAxis: {
        categories: _.map(confirmed, (c)=> { return c.location }),
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de personas'
        }
      },
      series: [
        {
          name: 'Activos',
          data: _.map(confirmed, (c)=> { return c.active })
        },
        {
          name: 'Confirmados',
          data: _.map(confirmed, (c)=> { return c.confirmed })
        },
        {
          name: 'Muertos',
          data: _.map(confirmed, (c) => { return c.deaths })
        },
        {
          name: 'Recuperados',
          data: _.map(confirmed, (c) => { return c.recovered })
        }
      ]
    })
}

const mountTable = (data) => {
  _.forEach(data, (d) => {
    $('#tbody').append(`
      <tr>
        <td>${d.location}</td>
        <td class="text-center">${d.active}</td>
        <td class="text-center">${numberconpunto(d.confirmed)}</td>
        <td class="text-center">${numberconpunto(d.deaths)}</td>
        <td class="text-center">${d.recovered}</td>
        <td class="text-center"><button data-country="${d.location}" type="button" class="btn btn-success">Ver detalle</button></td>
      </tr>
    `)
  })
}

function numberconpunto(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


const mountCountryChart = (data) =>{
  Highcharts.chart('country-chart', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Datos del pais seleccionado'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer'
      }
    },
    series: [{
      name: 'Datos',
      colorByPoint: true,
      data: [
        {
          name: 'Confirmados',
          y: data.confirmed,
          sliced: true,
          selected: true
        },
        {
          name: 'Activos',
          y: data.active
        },
        {
          name: 'Muertos',
          y: data.deaths
        },
        {
          name: 'Recuperados',
          y: data.recovered
        }
      ]
    }]  
  })
}

