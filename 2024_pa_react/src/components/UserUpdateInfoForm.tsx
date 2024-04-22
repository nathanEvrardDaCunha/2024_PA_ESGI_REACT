import * as React from "react";import {useState, useEffect} from "react";// @ts-ignoreimport Cookies from "js-cookie";interface UserData {	email: string;	password: string;	firstName: string;	lastName: string;	birthDate: Date | null;	phoneNumber: string;}interface LocationData {	address: string;	country: string;	city: string;	postalCode: string;	type: string;	capacity: number;	status: string;}const UserUpdateInfoForm = () => {	const [email, setEmail] = useState("");	const [password, setPassword] = useState("");	const [firstName, setFirstName] = useState("");	const [lastName, setLastName] = useState("");	const [birthDate, setBirthDate] = useState<Date>();	const [phoneNumber, setPhoneNumber] = useState("");	const [address, setAddress] = useState("");	const [country, setCountry] = useState("");	const [city, setCity] = useState("");	const [postalCode, setPostalCode] = useState("");	const [type, setType] = useState("user-home");	const [capacity, setCapacity] = useState(0);	const [status, setStatus] = useState("unavailable");		useEffect(() => {		fetchUserData();	}, []);		const fetchUserData = () => {		// Fetch user data from the database and update the state variables		// ...	};		const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {		e.preventDefault();				const userId = Cookies.get("userId");		if (!userId) {			console.error("User ID not found in cookies");			return;		}				const updatedFields: Partial<UserData> = {			email: email,			password: password,			firstName: firstName,			lastName: lastName,			birthDate: birthDate,			phoneNumber: phoneNumber,		};		const nonEmptyUpdatedFields = Object.fromEntries(			Object.entries(updatedFields).filter(([_, value]) => value !== "")		);				if (Object.keys(nonEmptyUpdatedFields).length === 0) {			console.log("No fields were modified");			return;		}				try {			const response = await fetch(`http://localhost:3000/persons/${userId}`, {				method: "PATCH",				headers: {					"Content-Type": "application/json",				},				body: JSON.stringify(nonEmptyUpdatedFields),			});						if (response.ok) {				console.log("User data updated successfully");			} else {				const errorMessage = await response.text();				console.error("Failed to update user data:", errorMessage);			}		} catch (error) {			console.error("Error:", error);		}	};		const handleUpdateLocation = async (e: React.FormEvent<HTMLFormElement>) => {		e.preventDefault();				const userId = Cookies.get("userId");		if (!userId) {			console.error("User ID not found in cookies");			return;		}				const updatedLocation: LocationData = {			address,			country,			city,			postalCode,			type: "user-home",			capacity,			status: "unavailable",		};				try {			const response = await fetch(`http://localhost:3000/persons/${userId}/location`, {				method: "PATCH",				headers: {					"Content-Type": "application/json",				},				body: JSON.stringify(updatedLocation),			});						if (response.ok) {				console.log("Location updated successfully");			} else {				const errorMessage = await response.text();				console.error("Failed to update location:", errorMessage);			}		} catch (error) {			console.error("Error:", error);		}	};		const handleDeleteUser = async () => {		const userId = Cookies.get("userId");		if (!userId) {			console.error("User ID not found in cookies");			return;		}				try {			const response = await fetch(`http://localhost:3000/persons/${userId}`, {				method: "DELETE",			});						if (response.ok) {				console.log("User deleted successfully");			} else {				const errorMessage = await response.text();				console.error("Failed to delete user:", errorMessage);			}		} catch (error) {			console.error("Error:", error);		}	};		return (		<div className="container my-5 min-vh-100">			<h2 className="mb-4">User Information</h2>			<form onSubmit={handleSubmit}>				<div className="mb-4">					<label htmlFor="email" className="form-label">						Email Address					</label>					<input						type="email"						id="email"						className="form-control"						value={email}						onChange={(e) => setEmail(e.target.value)}					/>				</div>				<div className="mb-4">					<label htmlFor="password" className="form-label">						Password					</label>					<input						type="password"						id="password"						className="form-control"						value={password}						onChange={(e) => setPassword(e.target.value)}					/>				</div>				<div className="mb-4">					<label htmlFor="firstName" className="form-label">						First Name					</label>					<input						type="text"						id="firstName"						className="form-control"						value={firstName}						onChange={(e) => setFirstName(e.target.value)}					/>				</div>				<div className="mb-4">					<label htmlFor="lastName" className="form-label">						Last Name					</label>					<input						type="text"						id="lastName"						className="form-control"						value={lastName}						onChange={(e) => setLastName(e.target.value)}					/>				</div>				<div className="mb-4">					<label htmlFor="birthDate" className="form-label">						Birth Date					</label>					<input						type="date"						id="birthDate"						className="form-control"						value={birthDate ? birthDate.toISOString().split("T")[0] : ""}						onChange={(e) => setBirthDate(new Date(e.target.value))}					/>				</div>				<div className="mb-4">					<label htmlFor="phoneNumber" className="form-label">						Phone Number					</label>					<input						type="tel"						id="phoneNumber"						className="form-control"						value={phoneNumber}						onChange={(e) => setPhoneNumber(e.target.value)}						maxLength={10}					/>				</div>				<button type="submit" className="btn btn-dark w-100 mb-3">					Update Informations				</button>			</form>						<h2 className="mt-5 mb-4">Location</h2>			<form onSubmit={handleUpdateLocation}>				<div className="mb-4">					<label htmlFor="address" className="form-label">						Address					</label>					<input						type="text"						id="address"						className="form-control"						value={address}						onChange={(e) => setAddress(e.target.value)}					/>				</div>				<div className="mb-4">					<label htmlFor="country" className="form-label">						Country					</label>					<input						type="text"						id="country"						className="form-control"						value={country}						onChange={(e) => setCountry(e.target.value)}					/>				</div>				<div className="mb-4">					<label htmlFor="city" className="form-label">						City					</label>					<input						type="text"						id="city"						className="form-control"						value={city}						onChange={(e) => setCity(e.target.value)}					/>				</div>				<div className="mb-4">					<label htmlFor="postalCode" className="form-label">						Postal Code					</label>					<input						type="text"						id="postalCode"						className="form-control"						value={postalCode}						onChange={(e) => setPostalCode(e.target.value)}					/>				</div>				<div className="mb-4">					<label htmlFor="capacity" className="form-label">						Capacity					</label>					<input						type="number"						id="capacity"						className="form-control"						value={capacity}						onChange={(e) => setCapacity(parseInt(e.target.value))}					/>				</div>				<button type="submit" className="btn btn-dark w-100 mb-3">					Update Location				</button>			</form>		</div>	);};export default UserUpdateInfoForm;