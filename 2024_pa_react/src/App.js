import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import DonationPage from "./pages/DonationPage.tsx";
import MembershipPage from "./pages/MembershipPage.tsx";
import UserInfoPage from "./pages/UserInfoPage.tsx";
import UserDonation from "./pages/UserDonation.tsx";
import NotAuthorizedPage from "./pages/NotAuthorizedPage.tsx";
import Cookies from "js-cookie";
import TaskPage from "./pages/TaskPage.tsx";
import ActivityPage from "./pages/ActivityPage.tsx";

const PrivateRoute = ({ children }) => {
    const authToken = Cookies.get("authToken");
    return authToken ? children : <Navigate to="/not-authorized" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/donation" element={<DonationPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />
                <Route
                    path="/user/info"
                    element={
                        <PrivateRoute>
                            <UserInfoPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/donation"
                    element={
                        <PrivateRoute>
                            <UserDonation />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/task"
                    element={
                        <PrivateRoute>
                            <TaskPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/activity"
                    element={
                        <PrivateRoute>
                            <ActivityPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;