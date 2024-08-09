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
      domainFilterOn,
      domainFilters,
      setDomainFilters_,
      setDomainFilterOn_,
    } = store;
    return (
      <div
        className={`alert alert-${domainFilterOn ? "warning" : "secondary"}`}
      >
        <div>
          <label>
            <input
              type="checkbox"
              checked={domainFilterOn}
              onChange={(e) => {
                setDomainFilterOn_(e.target.checked);
              }}
            />{" "}
            Hide the following domains from results
          </label>
        </div>
        <CreatableSelect
          placeholder="Enter a domain..."
          isMulti
          value={toJS(domainFilters)}
          onChange={setDomainFilters_}
          options={options}
          backspaceRemoves
          disabled={!domainFilterOn}
          className="bg-success"
        />
      </div>
    );
  }
}
