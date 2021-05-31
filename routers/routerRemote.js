const express = require('express')

const controllerRemote = require('../controllers/controllerRemote')
const router = express.Router()

router
    .route('/:remote')
    .get(controllerRemote.getRemote)
    .post(controllerRemote.postRemote)

module.exports = router