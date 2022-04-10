import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Listen from "./pages/Listen";
import Actions from "./pages/Actions";
import Speeches from "./pages/Speeches";
import Associations from "./pages/Associations";
import AppBar from "./components/AppBar";

function App() {
    return (
        <Router>
            <CssBaseline />
            <AppBar />
            <Routes>
                <Route
                    path="/actions"
                    element={<Actions />}
                />
                <Route
                    path="/speeches"
                    element={<Speeches />}
                />
                <Route
                    path="/associations"
                    element={<Associations />}
                />
                <Route
                    path="/"
                    element={<Listen />}
                />
            </Routes>
        </Router>
    );
}

export default App;
