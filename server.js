const express = require('express')
var cors = require('cors')
const data = require('./index')

const api = express()

//Allow all cors requests
api.use(cors())

const HOST = 'localhost'
const PORT = 8888

api.get('/', (req,res) => {
    res.send('Welcome')
})

api.get('/tournaments', async (req,res) => {
    res.status(200).json(await data.tournaments())
})

api.get('/matches', async (req,res) => {
    res.status(200).json(await data.matches())
})

//todo .env
api.listen(PORT, () => console.log(`API running at ${HOST}:${PORT}!`))
