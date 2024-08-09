import { action, observable, computed } from "mobx";

import { storageGet, storageSet } from "./storage.js";

export const localKeys = {
  filterEnabled: "filterEnabled",
  filters: "filters",
};

export default class Store {
  @observable accessor filterEnabled;
  @observable accessor filters;
  @observable accessor filterMap;

  constructor() {
    this.setFilterEnabled_ = this.setFilterEnabled_.bind(this);
    this.setFilters_ = this.setFilters_.bind(this);
    this.filterEnabled = true;
    this.filters = [];
    this.filterMap = {};
    storageGet("filterEnabled")
      .then(this.setFilterEnabled_)
      .catch(console.error);
    storageGet("filters").then(this.setFilters_).catch(console.error);
  }

  @action
  setFilterEnabled_(value) {
    this.filterEnabled = value;
    storageSet(localKeys.filterEnabled, value);
  }

  @action
  setFilters_(rawFilters) {
    console.warn("setFilters_", rawFilters, typeof rawFilters);
    let filterMap = {};
    let filters = [];
    for (let rawFilter of rawFilters) {
      filterMap[rawFilter.value] = 1;
      filters.push(rawFilter);
    }
    this.filterMap = filterMap;
    this.filters = filters;
    storageSet(localKeys.filters, filters);
  }
}
