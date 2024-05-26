// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import TopicForm from "../components/TopicForm.tsx";  // Assurez-vous que le chemin est correct
// @ts-ignore
import Footer from "../components/Footer.tsx";

const TopicPage = () => {
    return (
        <ComposedBackground>
            <Navbar />
            <TopicForm />
            <Footer />
        </ComposedBackground>
    );
};

export default TopicPage;
