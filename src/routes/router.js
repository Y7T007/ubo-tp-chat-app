import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from '../user/login/Login';
import { Register } from '../user/register/Register';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;