import * as React from "react";import { useState } from "react";import { useNavigate } from "react-router-dom";const RegisterForm = () => {	const [email, setEmail] = useState('');	const [password, setPassword] = useState('');	const [firstName, setFirstName] = useState('');	const [lastName, setLastName] = useState('');	const [birthDate, setBirthDate] = useState('');	const [phoneNumber, setPhoneNumber] = useState('');	const navigate = useNavigate();		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {		e.preventDefault();				const newPerson = {			email,			password,			firstName,			lastName,			birthDate: new Date(birthDate).toISOString(),			phoneNumber,			role: 'user'		};				fetch('http://localhost:3000/persons/auth/signup', {			method: 'POST',			headers: {				'Content-Type': 'application/json',			},			body: JSON.stringify(newPerson),		})			.then((response) => {				if (response.ok) {					console.log('Person created successfully');					navigate('/login');				} else {					console.error('Failed to create person');				}			})			.catch((error) => {				console.error('Error:', error);			});	};		return (		<div className="d-flex justify-content-center align-items-center vh-100">			<div className="container">				<div className="row justify-content-center">					<div className="col-md-6">						<form onSubmit={handleSubmit} className="p-1 p-md-5 bg-light rounded">							<div className="mb-4">								<label htmlFor="email" className="form-label">									Email Address*								</label>								<input									type="email"									id="email"									className="form-control"									value={email}									onChange={(e) => setEmail(e.target.value)}									required								/>							</div>							<div className="mb-4">								<label htmlFor="password" className="form-label">									Password*								</label>								<input									type="password"									id="password"									className="form-control"									value={password}									onChange={(e) => setPassword(e.target.value)}									required								/>							</div>							<div className="mb-4">								<label htmlFor="firstName" className="form-label">									First Name*								</label>								<input									type="text"									id="firstName"									className="form-control"									value={firstName}									onChange={(e) => setFirstName(e.target.value)}									required								/>							</div>							<div className="mb-4">								<label htmlFor="lastName" className="form-label">									Last Name*								</label>								<input									type="text"									id="lastName"									className="form-control"									value={lastName}									onChange={(e) => setLastName(e.target.value)}									required								/>							</div>							<div className="mb-4">								<label htmlFor="birthDate" className="form-label">									Birth Date*								</label>								<input									type="date"									id="birthDate"									className="form-control"									value={birthDate}									onChange={(e) => setBirthDate(e.target.value)}									required								/>							</div>							<div className="mb-4">								<label htmlFor="phoneNumber" className="form-label">									Phone Number*								</label>								<input									type="tel"									id="phoneNumber"									className="form-control"									value={phoneNumber}									onChange={(e) => setPhoneNumber(e.target.value)}									maxLength={10}									required								/>							</div>							<button type="submit" className="btn btn-dark w-100">								Register							</button>						</form>					</div>				</div>			</div>		</div>	);};export default RegisterForm;