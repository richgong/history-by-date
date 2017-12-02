import React from 'react'

import {getDayHistory} from './chromeHistory.js'

class Event extends React.Component {
  render() {
    let {event} = this.props
    return (
      <tr>
        <td>
          <a href={event.url} target="_blank">{event.title}</a>
          <small className="text-muted"> {event.host} &bull; {event.visitCount} visits</small>
        </td>


      </tr>
    )
  }
}


export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      date: new Date(),
      events: []
    }
  }

  componentDidMount() {
    getDayHistory(this.state.date, '', events => {
      this.setState({events})
    })
  }

  render() {
    let {events, date} = this.state
    return (
      <div>
        <h2>{events.length} events on {date.toISOString()}</h2>
        <table className="event">
          <tbody>
          {events.map((event, i) => <Event event={event} key={i} />)}
          </tbody>
        </table>
      </div>
    )
  }
}
