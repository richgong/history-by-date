import { action, observable, computed } from "mobx";

import { storageGet, storageSet } from "./storage.js";

export default class Store {
  @observable accessor excludeFilterOn;
  @observable accessor excludeFilters;
  @observable accessor filterMap;
  @observable accessor includeFilter;

  constructor() {
    this.setExcludeFilterOn_ = this.setExcludeFilterOn_.bind(this);
    this.setExcludeFilters_ = this.setExcludeFilters_.bind(this);
    this.setIncludeFilter_ = this.setIncludeFilter_.bind(this);
    this.excludeFilters = [];
    this.filterMap = {};
    this.includeFilter = "";
    storageGet("excludeFilterOn")
      .then(this.setExcludeFilterOn_)
      .catch(console.error);
    storageGet("excludeFilters")
      .then(this.setExcludeFilters_)
      .catch(console.error);
    storageGet("includeFilter")
      .then(this.setIncludeFilter_)
      .catch(console.error);
  }

  @action setIncludeFilter_(value) {
    this.includeFilter = value;
    storageSet("includeFilter", value);
  }

  @action setExcludeFilterOn_(value) {
    this.excludeFilterOn = value;
    storageSet("excludeFilterOn", value);
  }

  @action setExcludeFilters_(rawFilters) {
    console.warn("setExcludeFilters_", rawFilters, typeof rawFilters);
    let filterMap = {};
    let filters = [];
    for (let rawFilter of rawFilters) {
      filterMap[rawFilter.value] = 1;
      filters.push(rawFilter);
    }
    this.filterMap = filterMap;
    this.excludeFilters = filters;
    storageSet("excludeFilters", filters);
  }
}
