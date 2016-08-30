import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'

module.exports = (
  <Route path="/" component={App}>
    <Route path="/:type/:id/:label" component={App}/>
  </Route>
)
