import React from 'react'
import { inject, observer } from 'mobx-react'
import { Creatable } from 'react-select'
import 'react-select/dist/react-select.css'


@inject('store')
@observer
export class DomainFilter extends React.Component {
  render() {
    let {options, store} = this.props
    let {filterEnabled, filters, setFilters_, setFilterEnabled_} = store
    return (
      <div className="pad-top-bottom">
        <div>
          <label>
            <input type="checkbox" checked={filterEnabled}
              onChange={e => {setFilterEnabled_(e.target.checked)}} /> Hide the following domains from results
          </label>
        </div>
        <Creatable
          placeholder="Enter a domain..."
          valueKey="domain"
          labelKey="domain"
          multi
          value={filters.toJSON()}
          onChange={setFilters_}
          options={options}
          backspaceRemoves
          disabled={!filterEnabled} />
      </div>
    );
  }
}
