const os = require("os");

const WorkersAPIBaseURL = '/api/workers';
const port = 3000;
const hostname = "localhost";


const swaggerOptions = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Discord Bot Management Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a REST API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Vincent BUENO",
          email: "vbueno@enssat.fr",
        },
      },
      servers: [
        {
          url: `http://${hostname}:${port}${WorkersAPIBaseURL}`,
        },
      ],
    },
    apis: ["./endpoints/*.js", "./models/*.js"],
  };

  
module.exports = { swaggerOptions, WorkersAPIBaseURL, hostname, port };