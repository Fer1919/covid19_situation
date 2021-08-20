const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const cors = require('cors')

const options = {
    inflate: true,
    limit: 1000,
    type: ['text/plain','application/json']
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json(options))
app.use(cors())

const {authApi} = require('./routes/auth')
const {userPostApi} = require('./routes/posts')
const {photosApi} = require('./routes/photos')
const {covid19Api} = require('./routes/covid')

authApi(app)
userPostApi(app)
photosApi(app)
covid19Api(app)

app.use(express.static('public'))

app.get('/jwt-practico', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/jwt-practico/index.html'))
});

app.get('/desafio-instafake', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/desafio-instafake/index.html'))
});

app.get('/covid19', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/covid19/index.html'))
});

app.listen(3000,() => {
    console.log(`Listening server in http://localhost:3000`)
})
