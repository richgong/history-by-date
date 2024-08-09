let storageGet, storageSet


if (chrome.storage && chrome.storage.local) {
  storageGet = key => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, items => {
        if (chrome.runtime.lastError)
          return reject(chrome.runtime.lastError)
        let value = items[key]
        console.log("Storage.get:", key, value)
        if (value == null)
          return reject("Not found in Chrome storage: " + key)
        return resolve(JSON.parse(value))
      })
    })
  }

  storageSet = (key, object) => {
    let keyValue = {[key]: JSON.stringify(object)}
    console.log("Storage.set:", keyValue)
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(keyValue,
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

export {storageGet, storageSet}
