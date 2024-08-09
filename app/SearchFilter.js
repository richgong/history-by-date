import React from "react";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

@observer
export class SearchFilter extends React.Component {
  render() {
    let store = window.store;
    let { search, setSearch_ } = store;
    return (
      <div className={`alert alert-${search ? "success" : "secondary"}`}>
        Search on this day:
        <div className="input-group">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch_(e.target.value);
            }}
            placeholder="Search..."
            className="form-control"
            style={{ position: "relative" }}
          />
          {search && (
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-2"
              style={{ cursor: "pointer" }}
              onClick={() => setSearch_("")}
            >
              &times;
            </span>
          )}
        </div>
      </div>
    );
  }
}
