import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { Raw, Home } from "./pages";

function App() {
    return (
        <>
            <h1>TITLE</h1>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="raw" element={<Raw />} />
            </Routes>
        </>
    );
}

export default App;
