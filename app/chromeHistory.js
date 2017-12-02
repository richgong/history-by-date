export function getSessions(callback) {
  chrome.sessions.getDevices(callback)
}

function getHistory(options, callback) {
  let calls = 0
  let results = []

  if (!(chrome.history && chrome.history.search))
    return callback(false)

  function wrappedCallback(visits) {
    calls += 1
    results = results.concat(visits)
    if (calls == 2 || !(chrome.downloads && chrome.downloads.search))
      callback(results)
  }

  chrome.history.search(options, wrappedCallback)
  if (chrome.downloads && chrome.downloads.search) {
    let downloadOptions = {}
    if (options.startTime && options.endTime) {
      downloadOptions = {
        startedAfter: new Date(options.startTime).toISOString(),
        endedBefore: new Date(options.endTime).toISOString()
      }
    }
    chrome.downloads.search(downloadOptions, wrappedCallback)
  }
}

// sanitize

function sanitizeRange(results, options) {
  console.log(results, options)
  let out = []
  for (let result of results) {
    if (result) {
      let time = ensureEventTime(result)
      if (time > options.startTime && time < options.endTime)
        out.push(result)
    }
  }
  out.sort(sortByTime)
  return out
}


function sortByTime(a, b) {
  let aTime = ensureEventTime(a)
  let bTime = ensureEventTime(b)
  if (aTime > bTime)
    return -1
  if (aTime < bTime)
    return 1
  return 0
}


function ensureEventTime(result) {
  if (!result.lastVisitTime) {
    console.log(result.startTime, result)
    result.lastVisitTime = new Date(result.startTime).getTime()
  }
  return result.lastVisitTime
}

// groom

function groom(results) {
  for (let result of results) {
    if (result.filename) {
      result.host = getDomain(result.url)
      result.title = getFileName(result.url)
      result.size = calculateMB(result.totalBytes)
    } else {
      result.host = getDomain(result.url)
      if (!result.title)
        result.title = '(No title)'
    }
    let regex = /<(.|\n)*?>/ig
    result.title = result.title.replace(regex, "")
    result.url = result.url.replace(regex, "")
  }
  return results
}


function getDomain(url) {
  let match = url.match(/\w+:\/\/(.*?)\//)
  if (match)
    return match[0]
  return null
}


function getFileName(url) {
  let match = url.match(/[^//]*$/)
  if (match)
    return match[0]
  return null
}


function calculateMB(bytes) {
  return (bytes / 1048576).toFixed(2)
}


export function getDayHistory(date, callback) {
  date.setHours(0,0,0,0)
  let startTime = date.getTime()

  date.setHours(23,59,59,999)
  let endTime = date.getTime()

  let options = {
    startTime: startTime,
    endTime: endTime,
    text: '',
    maxResults: 5000
  }
  getHistory(options,
      results => {
      window.results = results // for debugging
      if (!results)
        return callback(false)

      results = sanitizeRange(results, options)
      results = groom(results)
      callback(results)
    })
}
