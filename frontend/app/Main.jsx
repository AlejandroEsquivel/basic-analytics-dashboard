import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import HomeRoute from '~/app/views/Home.jsx';
import MetricsRoute from '~/app/views/Metrics.jsx';
import AuthedRoute from '~/app/components/AuthedRoute.jsx';
import { AppProvider } from '~/app/AppContext.jsx';

ReactDOM.render(
	<AppProvider>
		<Router>
			<Switch>
				<Route path="/" exact component={AuthedRoute(HomeRoute)}/>
				<Route path="/metrics" exact component={AuthedRoute(MetricsRoute)} />
			</Switch>
		</Router>
	</AppProvider>,
  document.getElementById('app')
);