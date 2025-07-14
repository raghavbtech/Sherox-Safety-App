import React from "react";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import RoutePlanner from "./pages/RoutePlanner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/route" element={<RoutePlanner/>}/>
      </Routes>
    </Router>
  );
}

export default App;
