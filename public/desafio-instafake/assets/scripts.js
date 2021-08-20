var d = document;
const loginButton = d.querySelector('[type="submit"]')

loginButton.addEventListener('click', function(event) {
  event.preventDefault()
  const email = d.querySelector('[type="email"]').value
  const password = d.querySelector('[type="password"]').value
  const userData = {
    email: email,
    password: password 
  }

  fetch("http://localhost:3000/api/login", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(userData)
  })
  .then(function(response) {
    console.log(response);
    const token = response.token
    fetch('http://localhost:3000/api/photos', {
      headers: {
        Authentication: token
      }
    })
    .then(function(response) {
      console.log(response);
      let form = d.querySelector('form')
      let logoutButton = d.querySelector('#logout')
      form.setAttribute('display', 'none')
      logoutButton.setAttribute('display', 'block')

    })
  })
})