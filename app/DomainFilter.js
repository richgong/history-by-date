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
    let {filterEnabled, filters, setFilters_, setFilterEnabled_} = store
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
          valueKey="domain"
          labelKey="domain"
          multi
          value={toJS(filters)}
          onChange={setFilters_}
          options={options}
          backspaceRemoves
          disabled={!filterEnabled} />
      </div>
    );
  }
}
