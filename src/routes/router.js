import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from '../user/login/Login';
import { Register } from '../user/register/Register';
import ChatAppPage from "../pages/ChatAppPage";
import JoySignInSideTemplate from "../components/login-register/Login-new";
import SignUp from "../components/login-register/RegisterNew";

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/chat" element={<ChatAppPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<JoySignInSideTemplate />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;