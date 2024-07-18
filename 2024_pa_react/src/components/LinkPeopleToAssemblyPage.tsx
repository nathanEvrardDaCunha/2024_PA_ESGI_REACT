import * as React from "react";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import Footer from "../components/Footer.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import SideBar from "../components/SideBar.tsx";

const ToggleSidebarButton = ({ onClick, isOpen }) => (
    <button
        className={`bg-dark d-flex align-items-center ${isOpen ? 'active' : ''}`}
        onClick={onClick}
    >
        <i className={`bi bi-list${isOpen ? 'bi-x' : ''}`}></i>
        <span className={'text-light'}>X</span>
    </button>
);

const LinkPeopleToAssemblyPage = () => {
    const { assemblyId } = useParams();
    const [persons, setPersons] = useState([]);
    const [selectedPersonIds, setSelectedPersonIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/persons`);
                if (!response.ok) {
                    throw new Error('Failed to fetch persons');
                }
                const data = await response.json();
                setPersons(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPersons();
    }, []);
    
    const handleTogglePerson = (personId) => {
        setSelectedPersonIds(prev => {
            if (prev.includes(personId)) {
                return prev.filter(id => id !== personId);
            }
            return [...prev, personId];
        });
    };
    
    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies/${assemblyId}/link-people`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ personIds: selectedPersonIds })
            });
            if (!response.ok) {
                throw new Error('Failed to link people');
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        }
    };
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }
    
    if (error) {
        return <Alert variant="danger" className="mt-5">Error: {error}</Alert>;
    }
    
    return (
        <ComposedBackground>
            <Navbar />
            <div className="d-flex min-vh-100">
                {isSidebarOpen && <SideBar onClose={closeSidebar} />}
                <Container fluid className={`flex-grow-1 ${isSidebarOpen ? "ms-auto" : ""}`}>
                    <ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <h1 className="text-center mb-4 mt-5">Link People to Assembly</h1>
                            <Card>
                                <Card.Body>
                                    <Form>
                                        {persons.map(person => (
                                            <Form.Check
                                                key={person.id}
                                                type="checkbox"
                                                id={`person-${person.id}`}
                                                label={`${person.firstName} ${person.lastName}`}
                                                checked={selectedPersonIds.includes(person.id)}
                                                onChange={() => handleTogglePerson(person.id)}
                                                className="mb-2"
                                            />
                                        ))}
                                        <Button
                                            variant="primary"
                                            onClick={handleSubmit}
                                            className="mt-3"
                                            disabled={selectedPersonIds.length === 0}
                                        >
                                            Link Selected People
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                            {success && (
                                <Alert variant="success" className="mt-3">
                                    People linked successfully!
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </ComposedBackground>
    );
};

export default LinkPeopleToAssemblyPage;