import { action, observable, computed } from 'mobx'

export default class Store {

@observable filterEnabled
@observable filters
  @observable filterMap

  constructor() {
    this.toggleFilterEnabled_ = this.toggleFilterEnabled_.bind(this)
    this.setFilters_ = this.setFilters_.bind(this)
    this.filterEnabled = true
    this.filters = []
    this.filterMap = {}
  }

@action
  toggleFilterEnabled_() {
    this.filterEnabled = !this.filterEnabled
  }

@action
  setFilters_(filters) {
    this.filters = filters
    let filterMap = {}
    for (let filter of filters) {
      filterMap[filter.domain] = 1
    }
    this.filterMap = filterMap
  }
}
