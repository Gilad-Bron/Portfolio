import './App.css';
import { AppRouter } from './Components/AppRouter/AppRouter';
import { BrowserRouter } from "react-router";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
