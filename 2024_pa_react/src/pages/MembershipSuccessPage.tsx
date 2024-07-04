import * as React from "react";import { useLocation, useNavigate } from 'react-router-dom';// @ts-ignoreimport Navbar from "../components/NavBar.tsx";// @ts-ignoreimport Footer from "../components/Footer.tsx";// @ts-ignoreimport ComposedBackground from "../components/ComposedBackground.tsx";// @ts-ignoreimport AlertMessage from "../components/AlertMessage.tsx";import {useEffect, useState} from "react";const MembershipSuccessPage: React.FC = () => {	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');	const [membershipDetails, setMembershipDetails] = useState<any>(null);	const location = useLocation();	const navigate = useNavigate();		useEffect(() => {		const searchParams = new URLSearchParams(location.search);		const sessionId = searchParams.get('session_id');				if (sessionId) {			let isMounted = true;			const timer = setTimeout(() => {				fetch(`http://localhost:3000/memberships/membership-success`, {					method: 'POST',					headers: {						'Content-Type': 'application/json',					},					body: JSON.stringify({ session_id: sessionId }),					credentials: 'include'				})					.then(response => {						if (!response.ok) {							throw new Error(`HTTP error! status: ${response.status}`);						}						return response.json();					})					.then(data => {						console.log('Success response:', data);						if (isMounted) {							if (data.error) {								console.error('Error details:', data);								setStatus('error');							} else {								setStatus('success');								setMembershipDetails(data.membership);							}						}					})					.catch((error) => {						console.error('Fetch error:', error);						if (isMounted) {							setStatus('error');						}					});			}, 1000); // 1 second delay						return () => {				isMounted = false;				clearTimeout(timer);			};		} else {			console.error('No session ID found in URL');			setStatus('error');		}	}, [location]);		return (		<ComposedBackground>			<Navbar />			<div className="d-flex justify-content-center align-items-center min-vh-100">				<div className="container">					<div className="row justify-content-center">						<div className="col-md-6">							{status === 'loading' && <AlertMessage message="Processing your membership..." type={"success"}/>}							{status === 'error' && <AlertMessage message="There was an error processing your membership. Please try again." type="error" />}							{status === 'success' && (								<div className="p-4 bg-light rounded text-center">									<h1>Thank you for your membership!</h1>									<p>Your membership has been successfully processed.</p>									{membershipDetails && (										<div className="mt-4">											<h2>Membership Details</h2>											<p>Type: {membershipDetails.type}</p>											<p>Join Date: {new Date(membershipDetails.joinDate).toLocaleDateString()}</p>											<p>Expiry Date: {new Date(membershipDetails.expiryDate).toLocaleDateString()}</p>											<p>Status: {membershipDetails.status}</p>											<p>Access Level: {membershipDetails.accessLevel}</p>											<p>Fees: €{membershipDetails.fees}</p>										</div>									)}									<button onClick={() => navigate('/')} className="btn btn-dark mt-3">										Return to Home									</button>								</div>							)}						</div>					</div>				</div>			</div>			<Footer />		</ComposedBackground>	);};export default MembershipSuccessPage;