import React from "react";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

@observer
export class SearchFilter extends React.Component {
  render() {
    let store = window.store;
    let { includeFilter, setIncludeFilter_ } = store;
    return (
      <div className={`alert alert-${includeFilter ? "success" : "secondary"}`}>
        Search this date:
        <div className="input-group">
          <input
            type="text"
            value={includeFilter}
            onChange={(e) => {
              setIncludeFilter_(e.target.value);
            }}
            placeholder="Search..."
            className="form-control"
            style={{ position: "relative" }}
          />
          {includeFilter && (
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-2"
              style={{ cursor: "pointer" }}
              onClick={() => setIncludeFilter_("")}
            >
              &times;
            </span>
          )}
        </div>
      </div>
    );
  }
}
