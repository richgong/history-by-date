import React from 'react'

function DateHeader({active, date, setDate, children}) {
  let className = 'date-header'
  if (!date)
    className += ' btn disabled'
  else if (active)
    className += ' active'

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

export class DateNav extends React.Component {
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
        <DateHeader date={past} setDate={setDate}>&larr;</DateHeader>
        {dates.map((d, i) => <DateHeader key={i} date={d} active={d == date} setDate={setDate}>
          <b>{d.format('ddd')}</b> <br /> {d.format('MMM D')}
        </DateHeader>)}
        <DateHeader date={future} setDate={setDate}>&rarr;</DateHeader>
      </ul>
    )
  }
}