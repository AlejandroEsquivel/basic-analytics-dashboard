import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import bodyParser from 'body-parser';

import config from '~/src/config';

import AnalyticsClient from '~/src/clients/Analytics';
import AnalyticsController from '~/src/controllers/Analytics'

const { PORT, NODE_ENV } = config;

const app = express();
const controller = new AnalyticsController({ client: new AnalyticsClient() });

app.use(helmet());
app.use(cors());

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/accounts',controller.getAccounts);
app.get('/accounts/:accountId/properties',controller.getProperties);
app.get('/accounts/:accountId/properties/:webPropertyId/views',controller.getViews);
app.get('/accounts/:accountId/properties/:webPropertyId/views/:viewId/metrics',controller.getMetrics);

//shorter route name without redundant route parameters
app.get('/views/:viewId/metrics',controller.getMetrics);


// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Route not found.');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { 
  res
    .status(err.status || 500)
    .json({
        message: err.message
    });
});

// Show server configuration during boot-up
console.log('Server Configuration:')
console.log(config);

app.listen(PORT, () => console.log(`\nServer listening on port ${PORT}...\n`)); 


