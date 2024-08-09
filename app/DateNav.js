import React from "react";

function DateHeader({ active, date, setDate, children, isArrow = false }) {
  let className = "page-item";
  if (!date) className += " disabled";
  else if (active) className += " active";

  let weekday = date && date.day();
  if (!isArrow && (weekday === 0 || weekday === 6)) {
    // sun or sat
    className += " bg-warning";
  }

  return (
    <li className={className}>
      <a
        href="#"
        className="page-link"
        onClick={(e) => {
          e.preventDefault();
          if (date) setDate(date);
        }}
      >
        {children}
      </a>
    </li>
  );
}

export class DateNav extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { date, setDate } = this.props;
    let now = new Date();

    let dates = [];
    let remain = 13;

    let future;

    // add dates after this date
    let curr = date;
    while (dates.length < 7) {
      dates.push(curr);
      remain -= 1;
      curr = curr.clone().add(1, "d");
      future = curr;
      if (curr >= now) {
        future = null;
        break;
      }
    }

    curr = date;
    while (remain > 0) {
      curr = curr.clone().add(-1, "d");
      dates.unshift(curr);
      remain -= 1;
    }

    let past = curr.clone().add(-1, "d");

    return (
      <ul className="pagination justify-content-center">
        <DateHeader date={past} setDate={setDate} isArrow>
          &larr;
        </DateHeader>
        {dates.map((d, i) => (
          <DateHeader
            key={i}
            date={d}
            active={d.isSame(date, "day")}
            setDate={setDate}
          >
            <b>{d.format("ddd")}</b> <br /> {d.format("M/D")}
          </DateHeader>
        ))}
        <DateHeader date={future} setDate={setDate} isArrow>
          &rarr;
        </DateHeader>
      </ul>
    );
  }
}
