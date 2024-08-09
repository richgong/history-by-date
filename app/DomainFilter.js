import React from "react";
import { inject, observer } from "mobx-react";
import CreatableSelect from "react-select/creatable";
import { toJS } from "mobx";
// import 'react-select/dist/react-select.css'

@observer
export class DomainFilter extends React.Component {
  render() {
    let { options } = this.props;
    let store = window.store;
    let {
      excludeFilterOn,
      excludeFilters,
      setExcludeFilters_,
      setExcludeFilterOn_,
    } = store;
    return (
      <div
        className={`alert alert-${excludeFilterOn ? "warning" : "secondary"}`}
      >
        <div>
          <label>
            <input
              type="checkbox"
              checked={excludeFilterOn}
              onChange={(e) => {
                setExcludeFilterOn_(e.target.checked);
              }}
            />{" "}
            Hide the following domains from results
          </label>
        </div>
        <CreatableSelect
          placeholder="Enter a domain..."
          isMulti
          value={toJS(excludeFilters)}
          onChange={setExcludeFilters_}
          options={options}
          backspaceRemoves
          disabled={!excludeFilterOn}
          className="bg-success"
        />
      </div>
    );
  }
}
