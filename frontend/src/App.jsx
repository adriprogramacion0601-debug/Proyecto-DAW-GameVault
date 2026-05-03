import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Biblioteca from './pages/Biblioteca';
import Listas from "./pages/Listas.jsx";
import JuegoDetalle from './pages/JuegoDetalle';
import Estadisticas from './pages/Estadisticas';

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="gamevault-ui-theme">
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <PrivateRoute><Layout><Home /></Layout></PrivateRoute>
                        } />
                        <Route path="/biblioteca" element={
                            <PrivateRoute><Layout><Biblioteca /></Layout></PrivateRoute>
                        } />
                        <Route path="/listas" element={
                            <PrivateRoute><Layout><Listas /></Layout></PrivateRoute>
                        } />
                        <Route path="/juego/:id" element={
                            <PrivateRoute><Layout><JuegoDetalle /></Layout></PrivateRoute>
                        } />
                        <Route path="/estadisticas" element={
                            <PrivateRoute><Layout><Estadisticas /></Layout></PrivateRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
                <Toaster position="top-right" theme="system" richColors closeButton />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;