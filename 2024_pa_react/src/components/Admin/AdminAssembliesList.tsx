import * as React from "react";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Badge, Spinner, Alert, Form } from 'react-bootstrap';
// @ts-ignore
import Navbar from "../NavBar.tsx";
// @ts-ignore
import Footer from "../Footer.tsx";
// @ts-ignore
import ComposedBackground from "../ComposedBackground.tsx";
// @ts-ignore
import SideBar from "../SideBar.tsx";

interface Assembly {
    id: string;
    name: string;
    meetingDate: string;
    status: string;
    endingDate: string;
}

const ToggleSidebarButton: React.FC<{ onClick: () => void; isOpen: boolean }> = ({ onClick, isOpen }) => (
    <button
        className={`bg-dark d-flex align-items-center ${isOpen ? 'active' : ''}`}
        onClick={onClick}
    >
        <i className={`bi bi-list${isOpen ? 'bi-x' : ''}`}></i>
        <span className={'text-light'}>X</span>
    </button>
);

const AdminAssembliesList: React.FC = () => {
    const [assemblies, setAssemblies] = useState<Assembly[]>([]);
    const [filteredAssemblies, setFilteredAssemblies] = useState<Assembly[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "",
    });
    
    useEffect(() => {
        const fetchAssemblies = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assemblies');
                }
                const data = await response.json();
                setAssemblies(data);
                setFilteredAssemblies(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAssemblies();
    }, []);
    
    useEffect(() => {
        const applyFilters = () => {
            let filtered = assemblies;
            
            if (filters.startDate !== "") {
                filtered = filtered.filter(
                    (assembly) => new Date(assembly.meetingDate) >= new Date(filters.startDate)
                );
            }
            
            if (filters.endDate !== "") {
                filtered = filtered.filter(
                    (assembly) => new Date(assembly.endingDate) <= new Date(filters.endDate)
                );
            }
            
            if (filters.status !== "") {
                filtered = filtered.filter(
                    (assembly) => assembly.status.toLowerCase() === filters.status.toLowerCase()
                );
            }
            
            setFilteredAssemblies(filtered);
        };
        
        applyFilters();
    }, [assemblies, filters]);
    
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
    
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };
    
    if (loading) {
        return (
            <ComposedBackground>
                <Navbar />
                <Container className="d-flex justify-content-center align-items-center min-vh-100">
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
                <Container className="min-vh-100">
                    <Alert variant="danger" className="mt-5">Error: {error}</Alert>
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
                <Container fluid>
                    <ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <h1 className="text-center mb-4">Assemblies List</h1>
                            <Row className="mb-4">
                                <Col md={4}>
                                    <Form.Control
                                        type="date"
                                        placeholder="Start Date"
                                        name="startDate"
                                        value={filters.startDate}
                                        // @ts-ignore
                                        onChange={handleFilterChange}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="date"
                                        placeholder="End Date"
                                        name="endDate"
                                        value={filters.endDate}
                                        // @ts-ignore
                                        onChange={handleFilterChange}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Select
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Status</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            {filteredAssemblies.length === 0 ? (
                                <Alert variant="info">No assemblies match the selected filters.</Alert>
                            ) : (
                                <ListGroup>
                                    {filteredAssemblies.map((assembly, index) => (
                                        <ListGroup.Item
                                            key={assembly.id}
                                            action
                                            as={Link}
                                            to={`/admin/assemblies/${assembly.id}`}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <h5>Assembly {index + 1}</h5>
                                                <small>Date: {new Date(assembly.meetingDate).toLocaleDateString()}</small>
                                            </div>
                                            <div className="text-end">
                                                {getStatusBadge(assembly.status)}
                                                <i className="bi bi-chevron-right ms-2"></i>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </ComposedBackground>
    );
};

export default AdminAssembliesList;