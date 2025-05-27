import logo from "./logo.svg";
import "./App.css";
import Main from "./Component/Main";
import Room from "./Component/Room";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/Room" element={<Room />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
    // <div>
    //   <BrowserRouter>
    //     <Room />
    //   </BrowserRouter>
    // </div>
  );
}

export default App;
