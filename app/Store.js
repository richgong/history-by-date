import { action, observable, computed } from 'mobx'

export const localKeys = {
  filterEnabled: 'filterEnabled',
  filters: 'filters'
}

let storageGet, storageSet

if (chrome.storage && chrome.storage.local) {
  storageGet = key => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, items => {
        if (chrome.runtime.lastError)
          return reject(chrome.runtime.lastError)
        return resolve(JSON.parse(items[key]))
      })
    })
  }

  storageSet = (key, object) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({[key]: JSON.stringify(object)},
        () => {
          if (chrome.runtime.lastError)
            return reject(chrome.runtime.lastError)
          return resolve(true)
        })
    })
  }
} else {
  console.warn("Chrome storage not available; using localStorage")

  storageGet = key => {
    let item = localStorage.getItem(key)
    if (item == null)
      return Promise.reject("Not found in localStorage: " + key)
    return Promise.resolve(JSON.parse(item))
  }

  storageSet = (key, object) => {
    return Promise.resolve(localStorage.setItem(key, JSON.stringify(object)))
  }
}

export default class Store {

@observable filterEnabled
@observable filters
@observable filterMap

  constructor() {
    this.setFilterEnabled_ = this.setFilterEnabled_.bind(this)
    this.setFilters_ = this.setFilters_.bind(this)
    this.filterEnabled = true
    this.filters = []
    this.filterMap = {}
    storageGet('filterEnabled').then(this.setFilterEnabled_).catch(console.error)
    storageGet('filters').then(this.setFilters_).catch(console.error)
  }

@action
  setFilterEnabled_(value) {
    this.filterEnabled = value
    storageSet(localKeys.filterEnabled, value)
  }

@action
  setFilters_(rawFilters) {

    let filterMap = {}
    let filters = []
    for (let filter of rawFilters) {
      filterMap[filter.domain] = 1
      filters.push({domain: filter.domain})
    }
    this.filterMap = filterMap
    this.filters = filters
    storageSet(localKeys.filters, filters)
  }
}
