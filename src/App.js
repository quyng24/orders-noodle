import Home from './components/Home';
import NotFound404 from './components/NotFound404';
import Orders from './components/Orders';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </Router>
  );
}

export default App;
