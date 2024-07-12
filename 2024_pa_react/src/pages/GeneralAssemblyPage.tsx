import * as React from "react";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Badge, Form } from 'react-bootstrap';
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

const GeneralAssembliesPage = () => {
    const [assemblies, setAssemblies] = useState([]);
    const [filteredAssemblies, setFilteredAssemblies] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "",
    });
    
    useEffect(() => {
        const fetchAssemblies = async () => {
            try {
                const response = await fetch('http://localhost:3000/assemblies');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAssemblies(data);
                setFilteredAssemblies(data);
            } catch (error) {
                setError("Error fetching assemblies: " + error.message);
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
    
    const getStatusBadge = (status) => {
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
    
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error}</div>;
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
                            <h1 className="text-center mb-4">General Assemblies</h1>
                            <Row className="mb-4">
                                <Col md={4}>
                                    <Form.Control
                                        type="date"
                                        placeholder="Start Date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="date"
                                        placeholder="End Date"
                                        name="endDate"
                                        value={filters.endDate}
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
                                <p>No assemblies match the selected filters.</p>
                            ) : (
                                <ListGroup>
                                    {filteredAssemblies.map((assembly, index) => (
                                        <ListGroup.Item
                                            key={assembly.id}
                                            action
                                            as={Link}
                                            to={`/assemblies/${assembly.id}/link-people`}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <h5>Assembly {index + 1}</h5>
                                                <div>
                                                    <small className="me-2">Start: {new Date(assembly.meetingDate).toLocaleDateString()}</small>
                                                    <small>End: {new Date(assembly.endingDate).toLocaleDateString()}</small>
                                                </div>
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

export default GeneralAssembliesPage;