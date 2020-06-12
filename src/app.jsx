import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './scss/main.scss';
import { AppContextProvider } from './Context';
import Navbar from './components/utility/Navbar';
import Routes from './components/Routes';

function App() {
  return (
    <AppContextProvider>
      <Router>
        <div>
          <header>
            <Navbar />
          </header>
          <main className="appContainer">
            <Routes />
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
