const { jwtAuth } = require('./../middleware/jwtVerify')
const { Covid19 } = require('../services/covidApi')

const filteredChile = (data) => {
    return data.filter(country => country['Country/Region'] === 'Chile')[0]
}

const formatResponse = (data) => {
    let index = 0
    let response = []
    Object.entries(data).forEach(entry => {
        const [key, value] = entry
        if (index > 3) {
            response.push({ date: key, total: value })
        }
        index++
    })
    return response
}

const covid19Api = (app) => {
    const covid19 = new Covid19
    app.get('/api/total', async (req, res) => {
        try {
            const data = await covid19.all()
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
        }
    })
    app.get('/api/countries/:country', async (req, res) => {
        try {
            const country = await covid19.countries(req.params.country)
            res.status(200).json(country)
        } catch (error) {
            console.log(error)
        }
    })
    app.get('/api/confirmed', jwtAuth, async (req, res) => {
        try {
            const { confirmed } = await covid19.confirmed()
            const chile = filteredChile(confirmed)
            res.status(200).json({ data: formatResponse(chile), type: 'confirmed' })
        } catch (error) {
            console.log(error)
        }
    })
    app.get('/api/deaths', jwtAuth, async (req, res) => {
        try {
            const { deaths } = await covid19.deaths()
            const chile = filteredChile(deaths)
            res.status(200).json({ data: formatResponse(chile), type: 'deaths' })
        } catch (error) {
            console.log(error)
        }
    })
    app.get('/api/recovered', jwtAuth, async (req, res) => {
        try {
            const { recovered } = await covid19.recovered()
            const chile = filteredChile(recovered)

            res.status(200).json({ data: formatResponse(chile), type: 'recovered' })
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports = {
    covid19Api
}