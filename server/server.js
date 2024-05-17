const express = require('express');
var cors = require('cors')
const app = express();

// Génération de la doc avec swagger
const { swaggerOptions, WorkersAPIBaseURL, hostname, port } = require('./config')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const specs = swaggerJsdoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {explorer:true})
);

app.use(cors())

app.use(express.static('public'))

app.use(express.json());   
app.use(express.urlencoded({ extended: true })); 

const workersRouter = require('./endpoints/workers.route');
app.use(WorkersAPIBaseURL, workersRouter);


app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}${WorkersAPIBaseURL}`)
  console.log(`Documentation is on  http://localhost:${port}/api-docs`);
})
