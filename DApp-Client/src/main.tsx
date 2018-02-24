import * as React from 'react';
import * as ReactDOM from 'react-dom';
import observer from './services/observer'
import { Router, Route, HashRouter, Redirect, Switch } from 'react-router-dom';
import { createHashHistory } from 'history';
import { App } from './аpp';
import { HomeComponent } from './components/home/home.component';
import { EventsComponent } from './components/events/events.component';
import { BetsComponent } from './components/bets/bets.component';
import { OrdersComponent } from './components/orders/orders.component';
import { NotFoundComponent } from "./components/common/not-found.component";

const history = createHashHistory();

ReactDOM.render(
  <HashRouter>
    <Router history={history} >
      <App>
        <Switch>
          <Route path="/" exact={true} component={HomeComponent} />
          <Route path="/events" component={EventsComponent} />
          <Route path="/history" component={HomeComponent} />
          <Route path="/bet/:address" component={BetsComponent} />
          <Route component={NotFoundComponent} />
        </Switch>
      </App>
    </Router>
  </HashRouter>

  ,
  document.getElementById('root')
);
