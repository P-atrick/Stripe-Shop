import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './scss/main.scss';
import { AppContextProvider } from './Context';
import Navbar from './components/utility/Navbar';
import Routes from './components/Routes';
import Login from './components/auth/LoginForm';
import Register from './components/auth/RegisterForm';

function App() {
  return (
    <AppContextProvider>
      <Router>
        <div>
          <header>
            <Navbar />
          </header>
          <main className="appContainer">
            <Switch>
              <Route path="/login" component={ Login } />
              <Route path="/register" component={ Register } />
              <Routes />
            </Switch>
          </main>
        </div>
      </Router>
    </AppContextProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
