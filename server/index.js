const express = require('express');
const app = express();
const host = "localhost";
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, host, () => {
  console.log(`Example app listening on port ${host}:${port}`)
})