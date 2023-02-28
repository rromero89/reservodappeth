import logo from './logo.svg';
import './App.css';
import  MetamaskProvider  from './utils/wallet';


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reservoapp.com/"
          target="_blank"
          rel="noopener noreferrer">
          Reservo app
        </a>
        <MetamaskProvider>
           Connect to Wallet 
        </MetamaskProvider>
      </header>
    </div>
  );
}

export default App;
// Copia del Archivo App.js