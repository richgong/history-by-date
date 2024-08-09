import { action, observable, computed } from "mobx";

import { storageGet, storageSet } from "./storage.js";

export default class Store {
  @observable accessor domainFilterOn;
  @observable accessor domainFilters;
  @observable accessor filterMap;
  @observable accessor search;

  constructor() {
    this.setDomainFilterOn_ = this.setDomainFilterOn_.bind(this);
    this.setDomainFilters_ = this.setDomainFilters_.bind(this);
    this.setSearch_ = this.setSearch_.bind(this);
    this.domainFilters = [];
    this.filterMap = {};
    this.search = "";
    storageGet("domainFilterOn")
      .then(this.setDomainFilterOn_)
      .catch(console.error);
    storageGet("domainFilters")
      .then(this.setDomainFilters_)
      .catch(console.error);
    storageGet("search")
      .then(this.setSearch_)
      .catch(console.error);
  }

  @action setSearch_(value) {
    // get lowercase
    this.search = (value || '').toLowerCase();
    storageSet("search", value);
  }

  @action setDomainFilterOn_(value) {
    this.domainFilterOn = value;
    storageSet("domainFilterOn", value);
  }

  @action setDomainFilters_(rawFilters) {
    console.warn("setDomainFilters_", rawFilters, typeof rawFilters);
    let filterMap = {};
    let filters = [];
    for (let rawFilter of rawFilters) {
      filterMap[rawFilter.value] = 1;
      filters.push(rawFilter);
    }
    this.filterMap = filterMap;
    this.domainFilters = filters;
    storageSet("domainFilters", filters);
  }
}
