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
        <td className="time">
        {moment(event.lastVisitTime).format('h:mm a')}
        </td>
        <td>
          <img className="favicon" src={event.favicon} />
        </td>
        <td>
          <a href={event.url} target="_blank">{event.title}
            <br /><small className="text-muted">
            {event.url}
          </small>
          </a>
        </td>
      </tr>
    )
  }
}

class Chunk {
  constructor(component) {
    this.component = component
    this.events = []
    this.startTime = null
    this.endTime = null
    this.state = {
      expanded: false
    }
    this.stats = {}
    this.rank = []
  }

  ensureRank() {
    if (this.rank.length || !this.events.length)
      return
    let rank = Object.keys(this.stats).map(key => [key, this.stats[key]])
    rank.sort((a, b) => b[1] - a[1])
    this.rank = rank.slice(0, 5)
  }

  setState(obj) {
    Object.assign(this.state, obj)
    this.component.setState({_chunkSetState: null}) // force update
  }

  add(event) {
    if (!this.startTime || event.lastVisitTime - this.endTime < 15 * 60 * 1000) {
      if (!this.startTime)
        this.startTime = event.lastVisitTime
      this.endTime = event.lastVisitTime
      this.events.push(event)
      if (this.stats[event.domain])
        this.stats[event.domain] += 1
      else
        this.stats[event.domain] = 1
      return true
    } else {
      return false
    }
  }

  renderControl() {
    this.ensureRank()
    let {expanded} = this.state
    return (
      <tr>
        <td className="expand"><button onClick={() => {
          this.setState({expanded: !expanded})
        }} className="btn btn-default btn-lg">{expanded ? <span>&minus;</span> : <span>+</span>}</button></td>
        <td className="expand" colSpan="2">
          <b>{moment(this.startTime).format('h:mm a')}</b> to <b>{moment(this.endTime).format('h:mm a')}</b> ({moment.utc(this.endTime - this.startTime + 30 * 1000).format('H:mm')})
          <div className="text-muted"><b>{this.events.length}</b> things: {this.rank.map((r, i) => <span key={i}>{r[0]}={r[1]} </span>)}</div>
        </td>
      </tr>
    )
  }

  render() {
    // render in a function here, instead of in a component to be able to return array, instead of a single element

    let rows = [
      this.renderControl()
    ]

    if (this.state.expanded) {
      for (let event of this.events) {
        rows.push(<EventItem event={event} />)
      }
    }

    return rows
  }
}

export default class App extends React.Component {
  constructor() {
    super()
    this.setDate_ = this.setDate_.bind(this)
    this.state = {
      date: moment(),
      chunks: [],
      total: 0
    }
  }

  componentDidMount() {
    this.setDate_(this.state.date)
  }

  setDate_(date) {
    this.setState({
      date
    })
    getDayHistory(date.toDate(), '', results => {
      let chunk = new Chunk(this)
      let chunks = [chunk]
      for (let e of results) {
        if (!chunk.add(e)) {
          chunk = new Chunk(this)
          chunk.add(e)
          chunks.push(chunk)
        }
      }
      this.setState({chunks, total: results.length})
    })
  }

  render() {
    let {chunks, date, total} = this.state
    return (
      <div>
        <DateRange date={date} setDate={this.setDate_} />
        <h2>{total} things on {date.format('ddd MMM D, YYYY')}</h2>
        <table className="event">
          <tbody>
          {chunks.map(chunk => chunk.render())}
          </tbody>
        </table>
      </div>
    )
  }
}
