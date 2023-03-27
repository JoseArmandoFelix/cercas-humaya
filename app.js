require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

const initApi = req => {
    return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        req
    })
}

const handleLinkResolver = doc => {
    return '/'
}

app.use((req, res, next) => {
    res.locals.ctx = {
        endpoint: process.env.PRISMIC_ENDPOINT,
        linkResolver: handleLinkResolver
    }

    res.locals.PrismicDOM = PrismicDOM

    next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    const api = await initApi(req)
    const homepage = await api.getSingle('homepage')
    const meta = await api.getSingle('meta')

    res.render('index', { homepage, meta })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})