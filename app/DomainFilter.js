import React from 'react'
import { Creatable } from 'react-select'
import 'react-select/dist/react-select.css'


let OPTIONS = [
  {domain:'abc.com'},
  {domain:'bbc.com'},
  {domain:'cnn.com'}
]

export class DomainFilter extends React.Component {
  constructor() {
    super()
    this.onChange = this.onChange.bind(this)
    this.toggleEnable = this.toggleEnable.bind(this)
    this.state = {
      enabled: true,
      value: []
    }
  }

  onChange(value) {
    this.setState({
      value: value
    });
  }

  toggleEnable() {
    this.setState({
      enabled: !this.state.enabled
    })
  }

  render() {
    let {enabled, value} = this.state
    return (
      <div className="pad-top-bottom">
        <div>
          <label>
            <input type="checkbox" checked={enabled} onChange={this.toggleEnable} /> Hide the following domains from results
          </label>
        </div>
        <Creatable
          valueKey="domain"
          labelKey="domain"
          multi
          value={value}
          onChange={this.onChange}
          options={OPTIONS}
          backspaceRemoves
          enabled={enabled} />
      </div>
    );
  }

}
