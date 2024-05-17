const express = require('express');
var cors = require('cors')
const app = express();

app.use(cors())


app.use(express.static('public'))

app.use(express.json());   
app.use(express.urlencoded({ extended: true })); 

const workersRouter = require('./endpoints/workers.route');
const WorkersAPIBaseURL = '/api/v1/workers';
app.use(WorkersAPIBaseURL, workersRouter);


const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}${WorkersAPIBaseURL}`)
})
