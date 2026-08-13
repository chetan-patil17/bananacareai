import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Plantations from "./pages/Plantations";
import Diagnose from "./pages/Diagnose";
import DiagnosisHistory from "./pages/DiagnosisHistory";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/farms"
                    element={<Farms />}
                />

                <Route
                    path="/farms/:farmId/plantations"
                    element={<Plantations />}
                />

                <Route
                    path="/diagnose"
                    element={<Diagnose />}
                />

                <Route
                    path="/history"
                    element={<DiagnosisHistory />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;