const express = require('express')
const bodyParser = require('body-parser')
const lirc = require('lirc_node')
lirc.init()

const app = express()

const routerBasic = require('./routers/routerBasic')
const routerRemote = require('./routers/routerRemote')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs')

app.use('/', routerBasic)
app.use('/remote', routerRemote)

module.exports = app
