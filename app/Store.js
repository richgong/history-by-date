import { action, observable, computed } from "mobx";

import { storageGet, storageSet } from "./storage.js";

export const localKeys = {
  filterEnabled: "filterEnabled",
  excludeFilters: "filters",
};

export default class Store {
  @observable accessor filterEnabled;
  @observable accessor excludeFilters;
  @observable accessor includeFilters;
  @observable accessor filterMap;

  constructor() {
    this.setFilterEnabled_ = this.setFilterEnabled_.bind(this);
    this.setExcludeFilters_ = this.setExcludeFilters_.bind(this);
    this.setIncludeFilters_ = this.setIncludeFilters_.bind(this);
    this.filterEnabled = true;
    this.excludeFilters = [];
    this.includeFilters = [];
    this.filterMap = {};
    storageGet("filterEnabled")
      .then(this.setFilterEnabled_)
      .catch(console.error);
    storageGet("filters").then(this.setExcludeFilters_).catch(console.error);
    storageGet("includeFilters")
      .then(this.setIncludeFilters_)
      .catch(console.error);
  }

  @action
  setFilterEnabled_(value) {
    this.filterEnabled = value;
    storageSet(localKeys.filterEnabled, value);
  }

  @action
  setExcludeFilters_(rawFilters) {
    console.warn("setExcludeFilters_", rawFilters, typeof rawFilters);
    let filterMap = {};
    let filters = [];
    for (let rawFilter of rawFilters) {
      filterMap[rawFilter.value] = 1;
      filters.push(rawFilter);
    }
    this.filterMap = filterMap;
    this.excludeFilters = filters;
    storageSet(localKeys.excludeFilters, filters);
  }
  @action
  setIncludeFilters_(rawFilters) {
    console.warn("setIncludeFilters_", rawFilters, typeof rawFilters);
    let filterMap = {};
    let filters = [];
    for (let rawFilter of rawFilters) {
      filterMap[rawFilter.value] = 1;
      filters.push(rawFilter);
    }
    this.includeFilters = filters;
    storageSet(localKeys.includeFilters, filters);
  }
}
