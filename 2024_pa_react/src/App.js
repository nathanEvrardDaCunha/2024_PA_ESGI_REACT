import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import DonationPage from "./pages/DonationPage.tsx";
import MembershipPage from "./pages/MembershipPage.tsx";
import UserInfoPage from "./pages/UserInfoPage.tsx";
import UserDonation from "./pages/UserDonation.tsx";

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/donation" element={<DonationPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/user/info" element={<UserInfoPage />} />
            <Route path="/user/donation" element={<UserDonation />} />
        </Routes>
      </Router>
  );
}

export default App;
