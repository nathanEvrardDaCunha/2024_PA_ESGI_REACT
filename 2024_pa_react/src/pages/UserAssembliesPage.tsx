import * as React from "react";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Badge, Alert } from 'react-bootstrap';
// @ts-ignore
import Cookies from 'js-cookie';
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import Footer from "../components/Footer.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import SideBar from "../components/SideBar.tsx";
// @ts-ignore
import { GeneralAssembly } from './Types.tsx';
import {Survey, Topic} from "../components/Types";

// Extend GeneralAssembly to include an id
interface AssemblyWithId extends GeneralAssembly {
    id: string;
    meetingDate: string;
    status: string;
    outcome: string;
    creationDate: string;
    endingDate: string;
    topics: Topic[];
    surveys: Survey[];
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

const UserAssembliesPage: React.FC = () => {
    const [assemblies, setAssemblies] = useState<AssemblyWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        const fetchAssemblies = async () => {
            setLoading(true);
            const userId = Cookies.get('userId');
            if (!userId) {
                setError('User ID not found in cookies');
                setLoading(false);
                return;
            }
            
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies/person/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assemblies');
                }
                const data: AssemblyWithId[] = await response.json();
                setAssemblies(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAssemblies();
    }, []);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    
    const getStatusBadge = (status: string) => {
        switch(status.toLowerCase()) {
            case 'scheduled':
                return <Badge bg="primary">Scheduled</Badge>;
            case 'in progress':
                return <Badge bg="warning">In Progress</Badge>;
            case 'completed':
                return <Badge bg="success">Completed</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
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
                    <Row className="justify-content-center my-5">
                        <Col md={8}>
                            <h1 className="text-center mb-4">Your Assemblies</h1>
                            {assemblies.length > 0 ? (
                                <ListGroup>
                                    {assemblies.map((assembly) => (
                                        <ListGroup.Item
                                            key={assembly.id}
                                            action
                                            as={Link}
                                            to={`/assemblies/${assembly.id}`}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <h5>Assembly on {new Date(assembly.meetingDate).toLocaleDateString()}</h5>
                                                <small>Created: {new Date(assembly.creationDate).toLocaleDateString()}</small>
                                                {assembly.endingDate && (
                                                    <small className="ms-2">
                                                        Ended: {new Date(assembly.endingDate).toLocaleDateString()}
                                                    </small>
                                                )}
                                            </div>
                                            <div>
                                                {getStatusBadge(assembly.status)}
                                                <i className="bi bi-chevron-right ms-2"></i>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <Alert variant="info">No assemblies found.</Alert>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </ComposedBackground>
    );
};

export default UserAssembliesPage;