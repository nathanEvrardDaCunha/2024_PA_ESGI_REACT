import * as React from "react";import { useNavigate } from 'react-router-dom';// @ts-ignoreimport ComposedBackground from "../components/ComposedBackground.tsx";// @ts-ignoreimport Navbar from "../components/NavBar.tsx";// @ts-ignoreimport Footer from "../components/Footer.tsx";const NotAuthorizedPage = () => {	const navigate = useNavigate();		const handleGoHome = () => {		navigate('/');	};		return (		<ComposedBackground>			<Navbar />			<div className="container d-flex justify-content-center align-items-center vh-100">				<div className="text-center">					<h1 className="mb-4">Not Authorized</h1>					<p className="mb-4">You don't have permission to access this page.</p>					<button className="btn btn-primary" onClick={handleGoHome}>						Go to Home Page					</button>				</div>			</div>			<Footer />		</ComposedBackground>	);};export default NotAuthorizedPage;