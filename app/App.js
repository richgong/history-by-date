import React from 'react'

import {getDayHistory} from './chromeHistory.js'


export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      events: []
    }
  }

  componentDidMount() {
    getDayHistory(new Date(), results => {
      this.setState({events: results})
    })
  }

  render() {
    let {events} = this.state
    return (
      <div>
        <h2>{events.length} events</h2>
      </div>
    )
  }
}
