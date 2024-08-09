import React from 'react'
import { inject, observer } from 'mobx-react'
import CreatableSelect from 'react-select/creatable';
import { toJS } from 'mobx'
// import 'react-select/dist/react-select.css'


@observer
export class DomainFilter extends React.Component {
  render() {
    let {options} = this.props
    let store = window.store
    let {filterEnabled, excludeFilters, includeFilters, setExcludeFilters_, setIncludeFilters_, setFilterEnabled_} = store
    return (
      <div className="pad-top-bottom">
        <div>
          <label>
            <input type="checkbox" checked={filterEnabled}
              onChange={e => {setFilterEnabled_(e.target.checked)}} /> Hide the following domains from results
          </label>
        </div>
        <CreatableSelect
          placeholder="Enter a domain..."
          isMulti
          value={toJS(excludeFilters)}
          onChange={setExcludeFilters_}
          options={options}
          backspaceRemoves
          disabled={!filterEnabled} />
        <div>
          <label>
            <input type="checkbox" checked={filterEnabled}
              onChange={e => {setFilterEnabled_(e.target.checked)}} /> Show only the following domains in results
          </label>
        </div>
        <CreatableSelect
          placeholder="Enter a domain..."
          isMulti
          value={toJS(includeFilters)}
          onChange={setIncludeFilters_}
          options={options}
          backspaceRemoves
          disabled={!filterEnabled} />
      </div>
    );
  }
}
