const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')

const authRoute = require('./routes/user.routes')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

app.use('/api/v1', authRoute)

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
  });





