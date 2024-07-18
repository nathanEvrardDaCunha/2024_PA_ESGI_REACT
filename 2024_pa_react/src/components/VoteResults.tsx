import * as React from "react";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import Footer from "../components/Footer.tsx";
// @ts-ignore
import SideBar from "../components/SideBar.tsx";

interface ChoiceResult {
    description: string;
    voteCount: number;
}

interface TopicResult {
    topicLabel: string;
    topicDescription: string;
    choices: ChoiceResult[];
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

const VoteResults: React.FC = () => {
    const { assemblyId } = useParams<{ assemblyId: string }>();
    const [results, setResults] = useState<TopicResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies/${assemblyId}/results`);
                const data = await response.json();
                if (response.ok) {
                    setResults(data);
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError('Failed to fetch results');
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchResults();
    }, [assemblyId]);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    
    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }
        
        if (error) {
            return <Alert variant="danger">Error: {error}</Alert>;
        }
        
        return results.map((topicResult, index) => (
            <Card key={index} className="mb-4">
                <Card.Header as="h3">{topicResult.topicLabel}</Card.Header>
                <Card.Body>
                    <Card.Text>{topicResult.topicDescription}</Card.Text>
                    <ListGroup variant="flush">
                        {topicResult.choices.map((choice, idx) => (
                            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                                {choice.description}
                                <Badge bg="primary" pill>
                                    {choice.voteCount} votes
                                </Badge>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        ));
    };
    
    return (
        <ComposedBackground>
            <Navbar />
            <div className="d-flex min-vh-100">
                {isSidebarOpen && <SideBar onClose={closeSidebar} />}
                <div className={`flex-grow-1 ${isSidebarOpen ? "ms-auto" : ""}`}>
                    <ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
                    <Container className="py-5">
                        <Row>
                            <Col>
                                <h1 className="text-center mb-4">Vote Results for Assembly</h1>
                                {renderContent()}
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <Footer />
        </ComposedBackground>
    );
};

export default VoteResults;