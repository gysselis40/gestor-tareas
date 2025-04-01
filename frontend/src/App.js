import logo from './logo.svg';
import './App.css';
import Tasks from './Tasks';

function App() {
  return (
      <div className="App">
          <h1>Gestor de Tareas</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <Tasks />
      </div>
  );
}

export default App;
