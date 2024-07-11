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
import DonationBeforePage from "./pages/DonationBeforePage.tsx";
import MembershipBeforePage from "./pages/MembershipBeforePage.tsx";
import UserMembership from "./pages/UserMembership.tsx";
import GeneralAssemblyPage from "./pages/GeneralAssemblyPage.tsx";
import GeneralAssemblyPeoplePage from "./pages/GeneralAssemblyPeoplePage.tsx";
import LinkPeopleToAssemblyPage from "./components/LinkPeopleToAssemblyPage.tsx";
import UserAssembliesPage from "./pages/UserAssembliesPage.tsx";
import UploadDocument from "./pages/UploadDocument.tsx";
import DocumentsPage from "./pages/DocumentsPage.tsx";
import CreateGroupPage from "./pages/CreateGroupPage.tsx";
import AssignDocumentPage from "./pages/AssignDocumentPage.tsx";
import UserDocumentsPage from "./pages/UserDocumentsPage.tsx";
import GeneralAssemblyForm from "./components/GeneralAssemblyForm.tsx";
import VoteResults from "./components/VoteResults.tsx";
import AssembliesList from "./pages/AssembliesList.tsx";
import AssemblyDetails from "./components/AssemblyDetails.tsx";
import RegisterLocationPage from "./pages/RegisterLocationPage.tsx";
import DonationSuccessPage from "./pages/DonationSuccessPage.tsx";
import MembershipSuccessPage from "./pages/MembershipSuccessPage.tsx";
import AssemblyPage from "./pages/AssemblyPage.tsx";
import AdminAssemblyPage from "./components/Admin/AdminAssemblyPage.tsx";
import AdminAssembliesList from "./components/Admin/AdminAssembliesList.tsx";

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
                <Route path="/register-location" element={<RegisterLocationPage />} />
                <Route path="/donation" element={<DonationPage />} />
                <Route path="/groups" element={<CreateGroupPage />} />
                <Route path="/groups/document" element={<AssignDocumentPage />} />
                <Route path="/donation-success" element={<DonationSuccessPage />} />
                <Route path="/membership-success" element={<MembershipSuccessPage />} />
                <Route path="/document/upload" element={<UploadDocument />} />
                <Route path="/document" element={<UserDocumentsPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/assembly/list" element={<GeneralAssemblyPage />} /> //page avec la liste des assemblé pour les assignée
                <Route path="/assembly" element={<GeneralAssemblyForm />} />
                <Route path="/assemblies/:assemblyId/results" element={<VoteResults />} />
                <Route path="/admin/assemblies/:assemblyId" element={<AdminAssemblyPage />} />
                <Route path="/admin/assemblies" element={<AdminAssembliesList />} />//liste assemblé pour admin
                <Route path="/assemblies/:id" element={<AssemblyPage/>} /> // page qui affiche le contenue de l'assemblée
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />
                <Route path="/assemblies/:assemblyId/link-people" element={<LinkPeopleToAssemblyPage />} />
                <Route path="/user/assemblies" element={
                    <PrivateRoute>
                        <UserAssembliesPage />
                    </PrivateRoute>} />

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
                <Route
                    path="/before-donation"
                    element={
                        <PrivateRoute>
                            <DonationBeforePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/before-membership"
                    element={
                        <PrivateRoute>
                            <MembershipBeforePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/membership"
                    element={
                        <PrivateRoute>
                            <UserMembership />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;