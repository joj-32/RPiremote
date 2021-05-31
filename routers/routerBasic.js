const express = require('express')

const controllerBasic = require('../controllers/controllerBasic')
const router = express.Router()

router
    .route('/')
    .get(controllerBasic.renderIndex)
    .post(controllerBasic.crudIndex)

router
    .route('/remotes')
    .get(controllerBasic.getRemotes)

module.exports = router