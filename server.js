const express = require('express')
const app = express()

const sql = require('mysql')

const scon =  sql.createPool({
    host: 'localhost',
    database: 'qqpublic',
    user: 'root',
    password: 'toorquvia',
    
})

app.get('/', function (req, res) {
    res.send('hello world')
})
app.post('/worker', (req, res) => {
    if (!(req.name)) return res.send({ok: false, msg: ''})
   scon.query(`SELECT * FROM ${req.name}`, (err, result) => {
        res.send(result)
   })
})




app.all("/test", (req, res) => {
    res.send('hey')
})
app.all("/bodyshow", (req, res) => {
    res.send(req.body)
})





app.listen(7551)