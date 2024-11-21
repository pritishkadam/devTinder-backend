const express = require('express');

const app = express();

const PORT_NO = 3000;

app.use('/', (req, res) => {
  res.send('Hello from the server');
});

app.listen(PORT_NO, () => {
  console.log(`Server is listening on http://localhost:${PORT_NO}`);
});
