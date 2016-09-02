import Router from 'express'
import { Api } from './api'

var routes = Router()

var api = new Api()

routes.get('/get/processes', (req, res) => {
    api.getProcesses(res)
})

routes.get('/get/process/:id', (req, res) => {
    api.getProcess(req.params.id, res)
})

routes.get('/get/used/:id', (req, res) => {
    api.getUsed(req.params.id, res)
})

module.exports = routes
