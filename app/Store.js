import React from "react";
import { action, observable, computed } from "mobx";

import { storageGet, storageSet } from "./storage.js";
import { getDayHistory } from "./chromeHistory.js";
import moment from "moment";

class Chunk {
  @observable accessor expanded = false;
  @observable accessor filteredEvents = [];
  @observable accessor summary = [];

  rank = [];
  events = [];
  startTime = null;
  endTime = null;
  stats = {};

  calcStats() {
    if (this.rank.length || !this.events.length) return;
    let rank = Object.keys(this.stats).map((key) => [key, this.stats[key]]);
    rank.sort((a, b) => b[1] - a[1]);
    this.rank = rank.slice(0, 5);
    return this.endTime - this.startTime;
  }

  @action setExpanded(expanded) {
    this.expanded = expanded;
  }

  add(event) {
    if (
      !this.startTime ||
      event.lastVisitTime - this.endTime < 15 * 60 * 1000
    ) {
      if (!this.startTime) this.startTime = event.lastVisitTime;
      this.endTime = event.lastVisitTime + 30 * 1000;
      this.events.push(event);
      if (this.stats[event.domain]) this.stats[event.domain] += 1;
      else this.stats[event.domain] = 1;
      return true;
    } else {
      return false;
    }
  }

  @action updateFilteredEvents() {
    let { search, domainFilters } = window.store;

    let numShow = 0;

    let filteredEvents = [];

    let { filterType, filterMap } = window.store;
    for (let event of this.events) {
      if (
        search &&
        !(
          event.title.toLowerCase().includes(search) ||
          event.url.toLowerCase().includes(search)
        )
      ) {
        continue;
      }
      if (
        !domainFilters.length ||
        (filterType == "exclude" && !(event.domain in filterMap)) ||
        (filterType == "include" && event.domain in filterMap)
      ) {
        filteredEvents.push(event);
        ++numShow;
      }
    }
    this.filteredEvents = filteredEvents;

    this.summary = this.rank.map((r, i) => {
      let domain = r[0];
      let count = r[1];
      let show =
        !domainFilters.length ||
        (filterType == "exclude" && !(domain in filterMap)) ||
        (filterType == "include" && domain in filterMap);
      if (!show) return null;
      return (
        <span key={i}>
          {domain}={count}{" "}
        </span>
      );
    });

    return numShow;
  }
}

export default class Store {
  @observable accessor filterType;
  @observable accessor domainFilters;
  @observable accessor filterMap;
  @observable accessor search;

  @observable accessor date = moment();
  @observable accessor chunks = [];
  @observable accessor total = 0;
  @observable accessor totalFiltered = 0;
  @observable accessor totalTime = 0;
  @observable accessor domains = ["google.com", "facebook.com"].map(
    (domain) => ({
      label: domain,
      value: domain,
    })
  );

  constructor() {
    this.setDate_ = this.setDate_.bind(this);
    this.setFilterType_ = this.setFilterType_.bind(this);
    this.setDomainFilters_ = this.setDomainFilters_.bind(this);
    this.setSearch_ = this.setSearch_.bind(this);
    this.domainFilters = [];
    this.filterMap = {};
    this.search = "";
    storageGet("filterType").then(this.setFilterType_).catch(console.error);
    storageGet("domainFilters")
      .then(this.setDomainFilters_)
      .catch(console.error);
    storageGet("search").then(this.setSearch_).catch(console.error);
  }

  @action updateFilteredEvents() {
    let { chunks } = this;
    let totalFiltered = 0;
    for (let chunk of chunks) {
      totalFiltered += chunk.updateFilteredEvents();
    }
    this.totalFiltered = totalFiltered;
  }

  @action setSearch_(value) {
    // get lowercase
    this.search = (value || "").toLowerCase();
    storageSet("search", value);
    this.updateFilteredEvents();
  }

  @action setFilterType_(value) {
    this.filterType = value;
    storageSet("filterType", value);
    this.updateFilteredEvents();
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
    this.updateFilteredEvents();
  }

  @action setDate_(date) {
    this.date = date;
    getDayHistory(date.toDate(), "", (results) => {
      if (!results) {
        console.error(
          "No Chrome history API found: maybe not running as Chrome extension?"
        );
        return;
      }

      let chunks = [];
      let totalTime = 0;
      let domains = [];

      if (results.length) {
        let domainMap = {};
        let chunk = new Chunk();
        chunks.push(chunk);
        for (let e of results) {
          domainMap[e.domain] = 1;
          if (!chunk.add(e)) {
            chunk = new Chunk();
            chunk.add(e);
            chunks.push(chunk);
          }
        }

        for (let chunk of chunks) {
          totalTime += chunk.calcStats();
        }

        for (let domain in domainMap) {
          domains.push({ label: domain, value: domain });
        }
      }
      this.chunks = chunks;
      this.totalTime = totalTime;
      this.total = results.length;
      this.domains = domains;
      this.updateFilteredEvents();
    });
  }

  @action toggleExpandAll() {
    let { chunks } = this;
    let expanded = chunks.length && !chunks[0].expanded;
    for (let chunk of chunks) {
      chunk.setExpanded(expanded);
    }
  }
}
