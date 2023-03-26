require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const path = require('path')

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
    initApi(req).then(api => {
        api.query(
            Prismic.Predicates.any('document.type', ['homepage', 'meta'])
        ).then(response => {
            const { results } = response
            const [ homepage, meta ] = results

            //console.log(homepage.data.body)

            res.render('index', { homepage, meta })
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})