const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
//const cors = require('cors')
const {pool} = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(compression())
app.use(helmet())
//app.use(cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

  /* if (!request.header('apiKey') || request.header('apiKey') !== process.env.API_KEY) {
    return response.status(401).json({status: 'error', message: 'Unauthorized.'})
  } */

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