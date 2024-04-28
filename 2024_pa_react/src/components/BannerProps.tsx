import * as React from "react";import 'bootstrap/dist/js/bootstrap.bundle.min';import { loadStripe } from "@stripe/stripe-js";// @ts-ignoreimport Cookies from "js-cookie";interface BannerProps {	title: string;	buttonText: string;	gradientStart: string;	gradientEnd: string;}const stripePromise = loadStripe('pk_test_51PAYakGNSIKaQBU9d6qGi3iQZzHaQWoRZ5V1RJWQkTplLuMRPEOBgjVuooqWsxZQ73SankPXEhgwQwsos4arhe6u00inH6IXaS');const Banner: React.FC<BannerProps> = ({	                                       title,	                                       buttonText,	                                       gradientStart,	                                       gradientEnd                                       }) => {	const gradientStyle = {		minHeight: '50vh',		background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`	};		const handleDonateClick = async () => {		try {			// When the customer clicks on the button, redirect them to Checkout.			const stripe = await stripePromise;			const userId = Cookies.get("userId"); // Get the user ID from the cookie						const response = await fetch('http://localhost:3000/donations/create-checkout-session', {				method: 'POST',				headers: {					'Content-Type': 'application/json',				},				body: JSON.stringify({					// Set the donation amount here (in cents or the smallest currency unit)					amount: 1000, // $10.00					userId // Include the user ID in the request body				}),			});						if (!response.ok) {				throw new Error('An error occurred while creating the checkout session');			}						const session = await response.json();						const result = await stripe.redirectToCheckout({				sessionId: session.id,			});						if (result.error) {				console.log(result.error.message);			}		} catch (error) {			console.error('Error:', error);			// Handle the error appropriately (e.g., show an error message to the user)		}	};		return (		<div className="banner py-5 d-flex align-items-center shadow-lg" style={gradientStyle}>			<div className="container">				<div className="row justify-content-center">					<div className="col-md-8 text-center">						<h2 className="text-white mb-4">{title}</h2>						<button className="btn btn-light btn-lg" onClick={handleDonateClick}>{buttonText}</button>					</div>				</div>			</div>		</div>	);};export default Banner;