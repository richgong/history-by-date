import React from "react";
import moment from "moment";
import { inject, observer } from "mobx-react";

import { DateNav } from "./DateNav.js";
import { DomainFilter } from "./DomainFilter.js";
import { SearchFilter } from "./SearchFilter.js";

function EventItem({ event }) {
  // error on image
  let [error, setError] = React.useState(false);
  return (
    <tr>
      <td className="time">{moment(event.lastVisitTime).format("h:mm a")}</td>
      <td>
        <img
          className="favicon"
          src={error ? "/dist/blank.png" : event.favicon}
          alt="favicon"
          onError={(e) => {
            setError(true);
          }}
        />
      </td>
      <td>
        <a href={event.url} target="_blank">
          {event.title}
          <br />
          <small className="muted">{event.url}</small>
        </a>
      </td>
    </tr>
  );
}

@observer
class ChunkCell extends React.Component {
  render() {
    let { chunk } = this.props;

    let { filteredEvents, expanded } = chunk;

    if (!filteredEvents.length) {
      return null;
    }
    return (
      <>
        {this.renderHeader()}
        {expanded &&
          filteredEvents.map((event, i) => <EventItem event={event} key={i} />)}
        {expanded && this.renderFooter()}
      </>
    );
  }

  renderHeader() {
    let { chunk } = this.props;
    let { expanded, startTime, endTime, filteredEvents, summary } = chunk;
    return (
      <tr>
        <td className="expand">
          <button
            onClick={() => {
              chunk.setExpanded(!expanded);
            }}
            className={"btn btn " + (expanded ? "btn-secondary" : "btn-light")}
          >
            <span
              style={{
                display: "inline-block",
                width: "20px",
                textAlign: "center",
              }}
            >
              {expanded ? <>&minus;</> : "+"}
            </span>
          </button>
        </td>
        <td className="expand" colSpan="2">
          <b>{moment(startTime).format("h:mm a")}</b> to{" "}
          <b>{moment(endTime).format("h:mm a")}</b> (
          {moment.utc(endTime - startTime + 30 * 1000).format("H:mm")})
          <div className="text-muted">
            <b>{filteredEvents.length}</b> things: {summary}
          </div>
        </td>
      </tr>
    );
  }

  renderFooter() {
    let { endTime } = this.props.chunk;
    return (
      <tr>
        <td className="time">{moment(endTime).format("h:mm a")}</td>
        <td></td>
        <td>End of session</td>
      </tr>
    );
  }
}

@observer
class App extends React.Component {
  componentDidMount() {
    window.store.setDate_(window.store.date);
  }

  render() {
    let { chunks, date, total, totalTime, domains, totalFiltered } =
      window.store;
    return (
      <div className="container">
        <h1 class="text-center my-3">
          <img src="/dist/logo_128.png" class="logo me-2 v-align" />
          History by Date
        </h1>
        <DateNav date={date} setDate={window.store.setDate_} />
        <h2
          className={totalFiltered < total ? "text-success" : "text-secondary"}
        >
          Showing {totalFiltered} of {total} things (
          {moment.utc(totalTime).format("H:mm")}) on{" "}
          {date.format("ddd MMM D, YYYY")}
        </h2>
        <button
          onClick={(e) => {
            window.store.toggleExpandAll();
          }}
          className={
            "my-2 btn " +
            (chunks.length && chunks[0].expanded
              ? "btn-secondary"
              : "btn-light")
          }
        >
          {chunks.length && chunks[0].expanded ? (
            <>&minus; Collapse all</>
          ) : (
            <>+ Expand all</>
          )}
        </button>
        <div className="row g-2">
          <div className="col-12 col-md-8">
            <DomainFilter options={domains} />
          </div>
          <div className="col-12 col-md-4">
            <SearchFilter />
          </div>
        </div>
        <table className="event">
          <tbody>
            {chunks.map((chunk, i) => (
              <ChunkCell chunk={chunk} key={i} />
            ))}
          </tbody>
        </table>
        <hr />
        <small>
          This extension is open-source:{" "}
          <a href="https://github.com/richgong/history-by-date">
            https://github.com/richgong/history-by-date
          </a>
        </small>
      </div>
    );
  }
}

export default App;
