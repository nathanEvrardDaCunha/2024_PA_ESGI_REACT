// @ts-ignore
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
// @ts-ignore
import ComposedBackground from "../ComposedBackground.tsx";
// @ts-ignore
import Navbar from "../NavBar.tsx";
// @ts-ignore
import Footer from "../Footer.tsx";
// @ts-ignore
import SideBar from "../SideBar.tsx";
// @ts-ignore
import AdminAssemblyDetails from "./AdminAssemblyDetails.tsx";
// @ts-ignore
import VoteResults from "./VoteResults.tsx";
// @ts-ignore
import SurveyResults from "./SurveyResults.tsx";
// @ts-ignore
import EndVoteButton from "./EndVoteButton.tsx";

interface Assembly {
    id: string;
    name: string;
    meetingDate: string;
    status: string;
    outcome: string;
    creationDate: string;
    endingDate: string;
    topics: Topic[];
    surveys: { id: string }[];
}

interface Topic {
    id: string;
    label: string;
    currentRound: number;
    totalRounds: number;
    quorum: number;
    choices: Choice[];
}

interface Choice {
    id: string;
    description: string;
    voteCount: number;
    voters: Person[];
}

interface Person {
    id: string;
}

const ToggleSidebarButton = ({ onClick, isOpen }) => (
    <button
        className={`bg-dark d-flex align-items-center ${isOpen ? 'active' : ''}`}
        onClick={onClick}
    >
        <i className={`bi bi-list${isOpen ? 'bi-x' : ''}`}></i>
        <span className={'text-light'}>X</span>
    </button>
);

const AdminAssemblyPage: React.FC = () => {
    const { assemblyId } = useParams<{ assemblyId: string }>();
    const [assembly, setAssembly] = useState<Assembly | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        const fetchAssembly = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies/${assemblyId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assembly');
                }
                const data = await response.json();
                console.log('Assembly Data:', data);
                setAssembly(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAssembly();
    }, [assemblyId]);
    
    const fetchTopics = async () => {
        if (!assembly) return;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies/${assembly.id}/filtered-topics/`);
            const data = await response.json();
            setAssembly({ ...assembly, topics: data.topics });
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        }
    };
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    
    if (loading) {
        return (
            <ComposedBackground>
                <Navbar />
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading assembly details...</span>
                    </Spinner>
                </Container>
                <Footer />
            </ComposedBackground>
        );
    }
    
    if (error) {
        return (
            <ComposedBackground>
                <Navbar />
                <Container className="mt-5 min-vh-100">
                    <Alert variant="danger">Error: {error}</Alert>
                </Container>
                <Footer />
            </ComposedBackground>
        );
    }
    
    if (!assembly) {
        return (
            <ComposedBackground>
                <Navbar />
                <Container className="mt-5 min-vh-100">
                    <Alert variant="info">No assembly found.</Alert>
                </Container>
                <Footer />
            </ComposedBackground>
        );
    }
    
    return (
        <ComposedBackground>
            <Navbar />
            <div className="d-flex min-vh-100">
                {isSidebarOpen && <SideBar onClose={closeSidebar} />}
                <div className={`flex-grow-1 ${isSidebarOpen ? "mx-0" : ""}`}>
                    <ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
                    <Container className="my-5">
                        <Row>
                            <Col>
                                <Card className="mb-4">
                                    <Card.Body>
                                        <AdminAssemblyDetails assembly={assembly} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card className="mb-4">
                                    <Card.Body>
                                        <VoteResults assemblyId={assemblyId} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card className="mb-4">
                                    <Card.Body>
                                        {assembly.surveys && assembly.surveys.length > 0 ? (
                                            <SurveyResults surveyId={assembly.surveys[0].id} />
                                        ) : (
                                            <Alert variant="info">No survey result found</Alert>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <Footer />
        </ComposedBackground>
    );
};

export default AdminAssemblyPage;