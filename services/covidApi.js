const axios = require('axios')
const COVIDAPI = 'https://covid2019-api.herokuapp.com'

class Covid19 {
    all() {
        return axios.get(`${COVIDAPI}/v2/current`).then(r => r.data)
    }
    countries(country) {
        return axios.get(`${COVIDAPI}/v2/country/${country}`)
            .then(r => r.data)
            .catch(e => console.log(e))
    }
    confirmed() {
        return axios.get(`${COVIDAPI}/timeseries/confirmed`).then(r => r.data)
    }
    deaths() {
        return axios.get(`${COVIDAPI}/timeseries/deaths`).then(r => r.data)
    }
    recovered() {
        return axios.get(`${COVIDAPI}/timeseries/recovered`).then(r => r.data)
    }

}
module.exports = {
    Covid19
}