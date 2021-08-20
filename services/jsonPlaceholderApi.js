const axios = require('axios')
const JSONPLACEHOLDERAPI = 'https://jsonplaceholder.typicode.com'

class JsonPlaceholderService {
    posts(user) {
        return axios.get(`${JSONPLACEHOLDERAPI}/users/${user}/posts`).then(r => r.data)
    }
    other() {
        return axios.get(`${JSONPLACEHOLDERAPI}/albums`).then(r => r.data).catch(e => console.log(e))
    }

}
module.exports = {
    JsonPlaceholderService
}