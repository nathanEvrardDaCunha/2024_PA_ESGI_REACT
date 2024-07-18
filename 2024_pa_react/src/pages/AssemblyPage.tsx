import * as React from "react";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
// @ts-ignore
import AssemblyDetails from '../components/AssemblyDetails.tsx';
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import Footer from "../components/Footer.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import SideBar from "../components/SideBar.tsx";

interface Assembly {
    id: string;
    name: string;
    meetingDate: Date;
    status: string;
    outcome: string;
    creationDate: Date;
    endingDate: Date;
    topics: Topic[];
    surveys: Survey[];
    person: Person[];
}

interface Topic {
    id: string;
    label: string;
    choices: Choice[];
    currentRound: number;
    totalRounds: number;
    quorum: number;
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

interface Survey {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

interface Question {
    id: string;
    label: string;
    type: string;
    options: string[];
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

const AssemblyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [assembly, setAssembly] = useState<Assembly | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        const fetchAssembly = async () => {
            setLoading(true);
            
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assembly');
                }
                const data = await response.json();
                
                // Convert date strings to Date objects
                data.meetingDate = new Date(data.meetingDate);
                data.creationDate = new Date(data.creationDate);
                data.endingDate = new Date(data.endingDate);
                
                setAssembly(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAssembly();
    }, [id]);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    if (loading) {
        return (
            <ComposedBackground>
                <Navbar />
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
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
                <Container className="mt-5v min-vh-100">
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
                {isSidebarOpen && <SideBar onClose={() => setIsSidebarOpen(false)} />}
                <Container fluid className={`flex-grow-1 ${isSidebarOpen ? "ms-auto" : ""}`}>
                    <ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
                    <Row className="justify-content-center my-5">
                        <Col md={10}>
                            <Card>
                                <Card.Body>
                                    <AssemblyDetails assembly={assembly} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </ComposedBackground>
    );
};

export default AssemblyPage;