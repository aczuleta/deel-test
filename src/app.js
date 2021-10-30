const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const {sequelize} = require('./model');
const fs = require('fs');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(helmet.frameguard());
app.use(helmet.noSniff());
app.use(compression());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

routes.forEach(route => {
    app.use(`/${route.path}`, route.router);
});

app.use(errorHandler);

module.exports = app;
