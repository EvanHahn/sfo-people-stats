const parseCsv = require('csv-parse')
const fs = require('fs')
const path = require('path')
const uglify = require('uglify-js')

const DIST_PATH = path.resolve(__dirname, 'dist', 'data.js')

module.exports = function () {
  return parseFileIntoArray()
    .then(convertArrayToObjects)
    .then(convertNumbers)
    .then(createData)
    .then(writeData)
}

function parseFileIntoArray () {
  return new Promise(function (resolve, reject) {
    const result = []

    const csvParser = parseCsv({ delimiter: '\t' })
    const dataPath = path.resolve(__dirname, 'data.tsv')

    csvParser.on('readable', () => {
      let record = csvParser.read()

      while (record) {
        result.push(record)
        record = csvParser.read()
      }
    })

    csvParser.on('error', reject)

    csvParser.on('finish', () => {
      resolve(result)
    })

    fs.createReadStream(dataPath).pipe(csvParser)
  })
}

function convertArrayToObjects (arr) {
  const keys = arr[0]

  return arr.slice(1).map((el) => {
    return el.reduce((result, value, index) => {
      result[keys[index]] = value
      return result
    }, {})
  })
}

function convertNumbers (arr) {
  return arr.map((el) => {
    let period = el['Activity Period']
    period = `${period.slice(0, 4)}-${period.slice(4)}-01`

    return Object.assign({}, el, {
      'Activity Period': period,
      'Passenger Count': parseInt(el['Passenger Count'])
    })
  })
}

function createData (arr) {
  return {
    enplanedAndDeplaned: computeEnplanedAndDeplaned(arr)
  }
}

function computeEnplanedAndDeplaned (arr) {
  const enplaned = arr.filter((e) => e['Activity Type Code'] === 'Enplaned')
  const deplaned = arr.filter((e) => e['Activity Type Code'] === 'Deplaned')

  return {
    enplaned: computeDataFor(enplaned),
    deplaned: computeDataFor(deplaned)
  }
}

function computeDataFor (arr) {
  const periodHash = arr.reduce((result, el) => {
    const date = el['Activity Period']
    const amount = el['Passenger Count']

    if (!result[date]) {
      result[date] = 0
    }
    result[date] += amount

    return result
  }, {})

  const dates = Object.keys(periodHash).sort()

  return dates.map((date) => {
    return {
      x: date,
      y: periodHash[date]
    }
  })
}

function writeData (data) {
  return new Promise((resolve, reject) => {
    let js = 'window.data = ' + JSON.stringify(data)
    js = uglify.minify(js, { fromString: true }).code

    fs.writeFile(DIST_PATH, js, 'utf8', (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
