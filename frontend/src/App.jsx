import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Biblioteca from './pages/Biblioteca';
import Listas from "./pages/Listas.jsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <PrivateRoute><Home /></PrivateRoute>
                    } />
                    <Route path="/biblioteca" element={
                        <PrivateRoute><Biblioteca /></PrivateRoute>
                    } />
                    <Route path="/listas" element={
                        <PrivateRoute><Listas /></PrivateRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;