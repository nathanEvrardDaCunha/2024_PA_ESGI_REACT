import * as React from "react";
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
// @ts-ignore
import Cookies from "js-cookie";
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import Footer from "../components/Footer.tsx";
// @ts-ignore
import SideBar from "../components/SideBar.tsx";

interface Person {
    id: string;
    firstName: string;
    lastName: string;
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

const CreateGroupPage: React.FC = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'danger'>('success');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    
    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/persons`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-id': userId!,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch persons');
                }
                
                const data = await response.json();
                setPersons(data);
            } catch (error) {
                console.error('Error fetching persons:', error);
                setMessage('Error fetching persons');
                setMessageType('danger');
            }
        };
        
        fetchPersons();
    }, [token, userId]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const newGroup = {
            name: groupName,
            description: groupDescription,
            memberIds: selectedPersons,
        };
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'user-id': userId!,
                },
                body: JSON.stringify(newGroup),
            });
            
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Failed to create group:', errorMessage);
                throw new Error('Failed to create group');
            }
            
            setMessage('Group created successfully');
            setMessageType('success');
        } catch (error) {
            console.error('Error creating group:', error);
            setMessage('Error creating group');
            setMessageType('danger');
        }
    };
    
    const handlePersonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions);
        // @ts-ignore
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedPersons(selectedIds);
    };
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    
    return (
        <ComposedBackground>
            <Navbar />
            <div className="d-flex min-vh-100">
                {isSidebarOpen && <SideBar onClose={closeSidebar} />}
                <div className={`flex-grow-1 ${isSidebarOpen ? "mx-0" : ""}`}>
                    <ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
                    <Container fluid className="mt-3">
                        <h1>Create Group</h1>
                        {message && (
                            <Alert variant={messageType} onClose={() => setMessage(null)} dismissible>
                                {message}
                            </Alert>
                        )}
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Group Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Group Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={groupDescription}
                                            onChange={(e) => setGroupDescription(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Members</Form.Label>
                                        <Form.Control
                                            as="select"
                                            multiple
                                            value={selectedPersons}
                                            // @ts-ignore
                                            onChange={handlePersonChange}
                                        >
                                            {persons.map(person => (
                                                <option key={person.id} value={person.id}>
                                                    {person.firstName} {person.lastName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Create Group
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
            </div>
            <Footer />
        </ComposedBackground>
    );
};

export default CreateGroupPage;