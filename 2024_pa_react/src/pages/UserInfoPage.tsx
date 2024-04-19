// @ts-ignoreimport Navbar from "../components/NavBar.tsx";// @ts-ignoreimport ComposedBackground from "../components/ComposedBackground.tsx";// @ts-ignoreimport Footer from "../components/Footer.tsx";// @ts-ignoreimport SideBar from "../components/SideBar.tsx";import * as React from "react";import { useState } from "react";// @ts-ignoreimport LeftContentImage from "../components/LeftContentImage.tsx";// @ts-ignoreimport RightContentImage from "../components/RightContentImage.tsx";const ToggleSidebarButton = ({ onClick, isOpen }) => (	<button		className={`bg-dark d-flex align-items-center ${isOpen ? 'active' : ''}`}		onClick={onClick}	>		<i className={`bi bi-list${isOpen ? 'bi-x' : ''}`}></i>		<span className={'text-light'}>X</span>	</button>);const UserInfoPage = () => {	const [isSidebarOpen, setIsSidebarOpen] = useState(false);		const toggleSidebar = () => {		setIsSidebarOpen(!isSidebarOpen);	};		const closeSidebar = () => {		setIsSidebarOpen(false);	};		return (		<ComposedBackground>			<Navbar />			<div className="d-flex">				{isSidebarOpen && <SideBar onClose={closeSidebar} />}				<div className={`flex-grow-1 ${isSidebarOpen ? "mx-0" : ""}`}>					<ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />					<div>						<LeftContentImage							heading={"That a good title"}							description={"Join the new world order in order to consume all your ennemies for eternity"}							imageUrl={"https://placehold.co/250"}							imageAlt={"A good alt"}						/>						<RightContentImage							heading={"That a good title"}							description={"Join the new world order in order to consume all your ennemies for eternity"}							imageUrl={"https://placehold.co/250"}							imageAlt={"A good alt"}						/>					</div>				</div>			</div>			<Footer />		</ComposedBackground>	);};export default UserInfoPage;