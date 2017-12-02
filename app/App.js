import React from 'react'
import moment from 'moment'

import {getDayHistory} from './chromeHistory.js'

function DateItem({active, date, setDate, children}) {
  let className = ''
  if (!date)
    className = 'btn disabled'
  else if (active)
    className = 'active'

  let weekday = date && date.day()
  if (weekday == 0 || weekday == 6) { // sun or sat
    className += ' weekend'
  }

  return (
    <li className={className}>
      <a href="#" onClick={e => {
        e.preventDefault()
        if (date)
          setDate(date)
      }}>{children}</a>
    </li>
  )

}

class DateRange extends React.Component {
  constructor() {
    super()
  }

  render() {
    let {date, setDate} = this.props
    let now = new Date()

    let dates = []
    let remain = 11

    let future

    // add dates after this date
    let curr = date
    while (dates.length < 6) {
      dates.push(curr)
      remain -= 1
      curr = curr.clone().add(1, 'd')
      future = curr
      if (curr >= now) {
        future = null
        break
      }
    }

    curr = date
    while (remain > 0) {
      curr = curr.clone().add(-1, 'd')
      dates.unshift(curr)
      remain -= 1
    }

    let past = curr.clone().add(-1, 'd')

    return (
      <ul className="pagination">
        <DateItem date={past} setDate={setDate}>&larr;</DateItem>
        {dates.map((d, i) => <DateItem key={i} date={d} active={d == date} setDate={setDate}>
          <b>{d.format('ddd')}</b> <br /> {d.format('MMM D')}
        </DateItem>)}
        <DateItem date={future} setDate={setDate}>&rarr;</DateItem>
      </ul>
    )
  }
}


class EventItem extends React.Component {
  render() {
    let {event} = this.props
    return (
      <tr>
        <td>
          <a href={event.url} target="_blank"><img src={event.favicon} /> {event.title}</a>
          <small className="text-muted"> {event.host} &bull; {event.visitCount} visits</small>
        </td>
      </tr>
    )
  }
}


export default class App extends React.Component {
  constructor() {
    super()
    this.setDate_ = this.setDate_.bind(this)
    this.state = {
      date: moment(),
      events: [],
      loading: false
    }
  }

  componentDidMount() {
    this.setDate_(this.state.date)
  }

  setDate_(date) {
    this.setState({
      date,
      events: [],
      loading: true
    })
    getDayHistory(date.toDate(), '', events => {
      this.setState({events, loading: false})
    })
  }

  render() {
    let {events, date, loading} = this.state
    return (
      <div>
        <DateRange date={date} setDate={this.setDate_} />
        <h2>{loading ? 'Loading' : events.length} things on {date.format('ddd MMM D, YYYY')}</h2>
        <table className="event">
          <tbody>
          {events.map((event, i) => <EventItem event={event} key={i} />)}
          </tbody>
        </table>
      </div>
    )
  }
}
