const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const getMetrics = (request, response) => {
  pool.query('SELECT * FROM perf_metrics', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addMetric = (request, response) => {
  const {url, TTFB,  FCP, domLoad, windowLoad, dateTime} = request.body

  pool.query(
    'INSERT INTO perf_metrics (url, TTFB, FCP, domLoad, windowLoad, dateTime) VALUES ($1, $2, $3, $4, $5, $6)',
    [url, TTFB, FCP, domLoad, windowLoad, dateTime],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Data added.'})
    },
  )
}

app
  .route('/perf_metrics')
  // GET endpoint
  .get(getMetrics)
  // POST endpoint
  .post(addMetric)

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})