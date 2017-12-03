import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'mobx-react'

import App from './App.js'
import Store from './Store.js'

window.store = new Store()

function render() {
  ReactDOM.render(
    <AppContainer><Provider store={store}>
      <App />
    </Provider></AppContainer>,
    document.getElementById('app')
  )
}

render()

if (module.hot)
  module.hot.accept('./App.js', render)
