import React from "react";
import { inject, observer } from "mobx-react";
import CreatableSelect from "react-select/creatable";
import { toJS } from "mobx";
// import 'react-select/dist/react-select.css'

function getKind(filterType, domainFilters) {
  if (domainFilters.length === 0) return "secondary";

  return filterType === "include" ? "success" : "warning";
}

@observer
export class DomainFilter extends React.Component {
  render() {
    let { options } = this.props;
    let store = window.store;
    let { filterType, domainFilters, setDomainFilters_, setFilterType_ } =
      store;
    return (
      <div className={`alert alert-${getKind(filterType, domainFilters)}`}>
        <div className="mb-3">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="filterType"
                  id="includeFilter"
                  value="include"
                  checked={filterType === "include"}
                  onChange={(e) => {
                    setFilterType_(e.target.value);
                  }}
                />
                <label className="form-check-label" htmlFor="includeFilter">
                  Include only the following domains
                </label>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="filterType"
                  id="excludeFilter"
                  value="exclude"
                  checked={filterType === "exclude"}
                  onChange={(e) => {
                    setFilterType_(e.target.value);
                  }}
                />
                <label className="form-check-label" htmlFor="excludeFilter">
                  Exclude the following domains
                </label>
              </div>
            </div>
          </div>
        </div>
        <CreatableSelect
          placeholder="Enter a domain..."
          isMulti
          value={toJS(domainFilters)}
          onChange={setDomainFilters_}
          options={options}
          backspaceRemoves
          disabled={filterType === ""}
          className="bg-success"
        />
      </div>
    );
  }
}
