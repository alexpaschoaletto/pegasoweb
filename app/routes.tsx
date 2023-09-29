import { MemoryRouter, Routes, Route } from "react-router-dom";
import SettingsPage from "./scenes/Settings";
import Controller from "./scenes/Controller";

export default function Router(){
    return (
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<SettingsPage />} />
                <Route path="/controller" element={<Controller/>} />
            </Routes>
        </MemoryRouter>
    )
}