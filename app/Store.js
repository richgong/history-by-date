import { action, observable, computed } from "mobx";

import { storageGet, storageSet } from "./storage.js";

export default class Store {
  @observable accessor includeFilterOn;
  @observable accessor excludeFilterOn;
  @observable accessor excludeFilters;
  @observable accessor includeFilters;
  @observable accessor filterMap;

  constructor() {
    this.setIncludeFilterOn_ = this.setIncludeFilterOn_.bind(this);
    this.setExcludeFilterOn_ = this.setExcludeFilterOn_.bind(this);
    this.setExcludeFilters_ = this.setExcludeFilters_.bind(this);
    this.setIncludeFilters_ = this.setIncludeFilters_.bind(this);
    this.includeFilterOn = false;
    this.excludeFilterOn = true;
    this.excludeFilters = [];
    this.includeFilters = [];
    this.filterMap = {};
    storageGet("includeFilterOn")
      .then(this.setIncludeFilterOn_)
      .catch(console.error);
    storageGet("excludeFilterOn")
      .then(this.setExcludeFilterOn_)
      .catch(console.error);
    storageGet("excludeFilters")
      .then(this.setExcludeFilters_)
      .catch(console.error);
    storageGet("includeFilters")
      .then(this.setIncludeFilters_)
      .catch(console.error);
  }

  @action setIncludeFilterOn_(value) {
    this.includeFilterOn = value;
    storageSet("includeFilterOn", value);
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

  @action setIncludeFilters_(rawFilters) {
    console.warn("setIncludeFilters_", rawFilters, typeof rawFilters);
    let filterMap = {};
    let filters = [];
    for (let rawFilter of rawFilters) {
      filterMap[rawFilter.value] = 1;
      filters.push(rawFilter);
    }
    this.includeFilters = filters;
    storageSet("includeFilters", filters);
  }
}
