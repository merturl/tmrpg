import React from 'react';
import { hot } from 'react-hot-loader'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';

import Loading from './Loading';

const AsyncHome = importedComponent(
  () => import(/* webpackChunkName:'DynamicPage' */ './Home'),
  {
    LoadingComponent: Loading
  }
);

const AsyncGame = importedComponent(
  () => import(/* webpackChunkName:'DynamicPage' */ './pharserjs/PhaserContainer'),
  {
    LoadingComponent: Loading
  }
);

const AsyncThreeScene = importedComponent(
  () => import(/* webpackChunkName:'DynamicPage' */ './threejs/ThreeScene'),
  {
    LoadingComponent: Loading
  }
);

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={AsyncHome} />
          <Route exact path="/game" component={AsyncGame} />
          <Route exact path="/three" component={AsyncThreeScene} />
        </Switch>
      </div>
    </Router>
  );
};

export default hot(module)(App)
