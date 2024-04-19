// @ts-ignoreimport ComposedBackground from "../components/ComposedBackground.tsx";// @ts-ignoreimport Navbar from "../components/NavBar.tsx";// @ts-ignoreimport Footer from "../components/Footer.tsx";// @ts-ignoreimport DonationKeys from "../components/DonationKeys.tsx";// @ts-ignoreimport BannerProps from "../components/BannerProps.tsx";const DonationPage = () => {	return (		<ComposedBackground>			<Navbar />			<BannerProps  buttonText={"Donate Now"} gradientEnd={"#0f8888"} gradientStart={"#62a89c"} title={"Support Our Cause"}/>			<DonationKeys />			<Footer />		</ComposedBackground>	);};export default DonationPage;