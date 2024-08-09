import React from "react";
import moment from "moment";
import { inject, observer } from "mobx-react";

import { DateNav } from "./DateNav.js";
import { getDayHistory } from "./chromeHistory.js";
import { DomainFilter } from "./DomainFilter.js";
import { action, observable } from "mobx";

class EventItem extends React.Component {
  render() {
    let { event } = this.props;
    return (
      <tr>
        <td className="time">{moment(event.lastVisitTime).format("h:mm a")}</td>
        <td>
          <img className="favicon" src={event.favicon} />
        </td>
        <td>
          <a href={event.url} target="_blank">
            {event.title}
            <br />
            <small className="text-muted">{event.url}</small>
          </a>
        </td>
      </tr>
    );
  }
}

class Chunk {
  @observable accessor rank = [];
  @observable accessor expanded = false;

  constructor() {
    this.events = [];
    this.startTime = null;
    this.endTime = null;
    this.stats = {};
  }

  calcStats() {
    if (this.rank.length || !this.events.length) return;
    let rank = Object.keys(this.stats).map((key) => [key, this.stats[key]]);
    rank.sort((a, b) => b[1] - a[1]);
    this.rank = rank.slice(0, 5);
    return this.endTime - this.startTime;
  }

  @action setExpanded(expanded) {
    this.expanded = expanded;
  }

  add(event) {
    if (
      !this.startTime ||
      event.lastVisitTime - this.endTime < 15 * 60 * 1000
    ) {
      if (!this.startTime) this.startTime = event.lastVisitTime;
      this.endTime = event.lastVisitTime + 30 * 1000;
      this.events.push(event);
      if (this.stats[event.domain]) this.stats[event.domain] += 1;
      else this.stats[event.domain] = 1;
      return true;
    } else {
      return false;
    }
  }

  renderHeader() {
    let { expanded, rank } = this;
    let filteredCount = 0;
    let summary = rank.map((r, i) => {
      let { excludeFilterOn, includeFilterOn, filterMap } = window.store;
      let show = true;
      let domain = r[0];
      let count = r[1];
      if (excludeFilterOn && domain in filterMap) show = false;
      if (includeFilterOn && !(domain in filterMap)) show = false;
      if (!show) return null;
      filteredCount += count;
      return (
        <span key={i}>
          {domain}={count}{" "}
        </span>
      );
    });
    return (
      <tr>
        <td className="expand">
          <button
            onClick={() => {
              this.setExpanded(!expanded);
            }}
            className="btn btn-default btn-lg"
          >
            {expanded ? <span>&minus;</span> : <span>+</span>}
          </button>
        </td>
        <td className="expand" colSpan="2">
          <b>{moment(this.startTime).format("h:mm a")}</b> to{" "}
          <b>{moment(this.endTime).format("h:mm a")}</b> (
          {moment.utc(this.endTime - this.startTime + 30 * 1000).format("H:mm")}
          )
          <div className="text-muted">
            <b>{filteredCount}</b> things: {summary}
          </div>
        </td>
      </tr>
    );
  }

  renderFooter() {
    return (
      <tr>
        <td className="time">{moment(this.endTime).format("h:mm a")}</td>
        <td></td>
        <td>End of session</td>
      </tr>
    );
  }
}

@observer
class ChunkCell extends React.Component {
  render() {
    // render in a function here, instead of in a component to be able to return array, instead of a single element

    let { chunk } = this.props;

    let rows = [];

    rows.push(chunk.renderHeader());

    if (chunk.expanded) {
      let {
        excludeFilterOn,
        includeFilterOn,
        excludeFilters,
        includeFilters,
        filterMap,
      } = window.store;
      for (let event of chunk.events) {
        if (
          !(excludeFilterOn && event.domain in filterMap) &&
          !(includeFilterOn && !(event.domain in filterMap))
        )
          rows.push(<EventItem event={event} />);
      }

      rows.push(chunk.renderFooter());
    }

    return rows;
  }
}

@observer
export default class App extends React.Component {
  constructor() {
    super();
    this.setDate_ = this.setDate_.bind(this);
    this.state = {
      date: moment(),
      chunks: [],
      total: 0,
      totalTime: 0,
      domains: ["google.com", "facebook.com"].map((domain) => ({
        label: domain,
        value: domain,
      })),
    };
  }

  componentDidMount() {
    this.setDate_(this.state.date);
  }

  toggleExpandAll() {
    let { chunks } = this.state;
    let expanded = chunks.length && !chunks[0].expanded;
    for (let chunk of chunks) {
      chunk.setExpanded(expanded);
    }
  }

  setDate_(date) {
    this.setState({
      date,
    });
    getDayHistory(date.toDate(), "", (results) => {
      if (!results) {
        console.error(
          "No Chrome history API found: maybe not running as Chrome extension?"
        );
        return;
      }

      let chunks = [];
      let totalTime = 0;
      let domains = [];

      if (results.length) {
        let domainMap = {};
        let chunk = new Chunk(this);
        chunks.push(chunk);
        for (let e of results) {
          domainMap[e.domain] = 1;
          if (!chunk.add(e)) {
            chunk = new Chunk(this);
            chunk.add(e);
            chunks.push(chunk);
          }
        }

        for (let chunk of chunks) {
          totalTime += chunk.calcStats();
        }

        for (let domain in domainMap) {
          domains.push({ label: domain, value: domain });
        }
      }
      this.setState({ chunks, totalTime, total: results.length, domains });
    });
  }

  render() {
    let { chunks, date, total, totalTime, domains } = this.state;
    return (
      <div>
        <DateNav date={date} setDate={this.setDate_} />
        <h2>
          {total} things ({moment.utc(totalTime).format("H:mm")}) on{" "}
          {date.format("ddd MMM D, YYYY")}
        </h2>
        <button
          onClick={(e) => {
            this.toggleExpandAll();
          }}
          className="btn btn-outline-secondary"
        >
          {chunks.length && chunks[0].expanded ? "Collapse" : "Expand"}{" "}
          all
        </button>
        <DomainFilter
          options={domains}
          includeFilters={window.store.includeFilters}
        />
        <table className="event">
          <tbody>
            {chunks.map((chunk, i) => (
              <ChunkCell chunk={chunk} key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
