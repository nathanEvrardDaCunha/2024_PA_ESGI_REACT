import * as React from "react";import { useState } from "react";import { useNavigate } from "react-router-dom";import * as Yup from "yup";// @ts-ignoreimport Cookies from "js-cookie";// @ts-ignoreimport AlertMessage from "./AlertMessage.tsx";const RegisterLocationForm = () => {	const [address, setAddress] = useState("");	const [country, setCountry] = useState("");	const [city, setCity] = useState("");	const [postalCode, setPostalCode] = useState("");	const [error, setError] = useState("");	const [success, setSuccess] = useState("");	const navigate = useNavigate();		const validationSchema = Yup.object().shape({		address: Yup.string().matches(/^[A-Za-z0-9\s]+$/, "Address cannot contain special characters").required("Address is required"),		country: Yup.string().required("Country is required"),		city: Yup.string().matches(/^[A-Za-z\s]+$/, "City can only contain letters and spaces").required("City is required"),		postalCode: Yup.string()			.matches(/^[A-Za-z0-9-]+$/, "Postal code can only contain letters, numbers, and hyphens")			.required("Postal code is required"),	});		// @ts-ignore	const handleSubmit = (e) => {		e.preventDefault();		setError("");		setSuccess("");				validationSchema			.validate(				{					address,					country,					city,					postalCode,				},				{ abortEarly: false }			)			.then(() => {				const userEmail = Cookies.get("userEmail");								const newLocation = {					address,					country,					city,					postalCode,					type: "user-home",					capacity: 999,					status: "unavailable",					email: userEmail,				};								fetch("http://localhost:3000/locations/user", {					method: "POST",					headers: {						"Content-Type": "application/json",					},					body: JSON.stringify(newLocation),				})					.then((response) => {						if (response.ok) {							setSuccess("Location created successfully");							console.log("Location created successfully");							navigate("/login");						} else {							setError("Failed to create location");							console.error("Failed to create location");						}					})					.catch((error) => {						setError("Error during location creation");						console.error("Error:", error);					});			})			.catch((validationErrors) => {				// @ts-ignore				const errors = validationErrors.inner.map((error) => error.message);				setError(errors.join(", "));			});	};		return (		<div className="d-flex justify-content-center align-items-center vh-100">			<div className="container">				<div className="row justify-content-center">					<div className="col-md-6">						{error && <AlertMessage message={error} type="error" />}						{success && <AlertMessage message={success} type="success" />}						<form onSubmit={handleSubmit} className="p-1 p-md-5 bg-light rounded">							<div className="mb-4">								<label htmlFor="address" className="form-label">									Address*								</label>								<input									type="text"									id="address"									className="form-control"									value={address}									onChange={(e) => setAddress(e.target.value)}									required								/>							</div>							<div className="mb-4">								<label htmlFor="country" className="form-label">									Country*								</label>								<select									id="country"									className="form-control"									value={country}									onChange={(e) => setCountry(e.target.value)}									required								>									<option value="">Select a country</option>									<option value="United States">United States</option>									<option value="Canada">Canada</option>									<option value="United Kingdom">United Kingdom</option>									<option value="Australia">Australia</option>									<option value="Germany">Germany</option>									<option value="France">France</option>									<option value="Spain">Spain</option>									<option value="Italy">Italy</option>									<option value="Japan">Japan</option>									<option value="China">China</option>								</select>							</div>							<div className="mb-4">								<label htmlFor="city" className="form-label">									City*								</label>								<input									type="text"									id="city"									className="form-control"									value={city}									onChange={(e) => setCity(e.target.value)}									required								/>							</div>							<div className="mb-4">								<label htmlFor="postalCode" className="form-label">									Postal Code*								</label>								<input									type="text"									id="postalCode"									className="form-control"									value={postalCode}									onChange={(e) => setPostalCode(e.target.value)}									required								/>							</div>							<button type="submit" className="btn btn-dark w-100">								Create Location							</button>						</form>					</div>				</div>			</div>		</div>	);};export default RegisterLocationForm;