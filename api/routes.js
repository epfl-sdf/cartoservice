import router from 'express';
import { Api } from './api';

const routes = router();
const api = new Api();

routes.get('/get/processes', (req, res) => {
  api.getProcesses(res);
});

routes.get('/get/process/:id', (req, res) => {
  api.getProcess(req.params.id, res);
});

routes.get('/get/used/:id', (req, res) => {
  api.getUsed(req.params.id, res);
});

routes.post('/post/custom', (req, res) => {
  api.postCustom(JSON.parse(req.body), res);
});

routes.get('/get/customs', (req, res) => {
  api.getCustoms(res);
});

routes.get('/get/custom/:id', (req, res) => {
  api.getCustom(req.params.id, res);
});

module.exports = routes;
