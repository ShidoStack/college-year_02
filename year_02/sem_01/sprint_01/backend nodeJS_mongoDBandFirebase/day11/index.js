const express = require('express')
const fs = require('fs')

const app = express()

// app.get('/home', (req, res) => {
//   fs.readFile('./data.json', 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).send('Error reading data')
//     }

//     const jsonData = JSON.parse(data)

//     res.json(jsonData)
//   })
// })


app.get('/home' , (req,res) => {
  const data = fs.readFileSync('data.json' , 'utf-8')
  res.send(data)
})


app.post('/senddata' , (req,res) => {
  res.send('batman or spiderman')
})


app.listen(4000, () => {
  console.log('server is running on port 4000')
})
