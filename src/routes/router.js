import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Login} from '../user/Login';
// import Home from '../Home';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login/>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;