// @ts-ignore
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, ListGroup } from 'react-bootstrap';
// @ts-ignore
import Cookies from 'js-cookie';
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import Footer from "../components/Footer.tsx";
// @ts-ignore
import SideBar from "../components/SideBar.tsx";

interface Group {
    id: string;
    name: string;
    description?: string;
}

interface Document {
    id: string;
    title: string;
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

const AssignDocumentPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [selectedDocument, setSelectedDocument] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'danger'>('success');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/groups`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-id': userId!,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }
                
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error('Error fetching groups:', error);
                setMessage('Error fetching groups');
                setMessageType('danger');
            }
        };
        
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/documents`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-id': userId!,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }
                
                const data = await response.json();
                setDocuments(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
                setMessage('Error fetching documents');
                setMessageType('danger');
            }
        };
        
        fetchGroups();
        fetchDocuments();
    }, [token, userId]);
    
    const handleAssign = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!selectedGroup || !selectedDocument) {
            setMessage('Please select both a group and a document.');
            setMessageType('danger');
            return;
        }
        
        const selectedGroupName = groups.find(group => group.id === selectedGroup)?.name;
        
        if (!selectedGroupName) {
            setMessage('Selected group not found.');
            setMessageType('danger');
            return;
        }
        
        const path = `/groupDocument/${selectedGroupName}`;
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/groups/${selectedGroup}/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'user-id': userId!,
                },
                body: JSON.stringify({ documentId: selectedDocument, path: path }),
            });
            
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Failed to assign document to group:', errorMessage);
                throw new Error('Failed to assign document to group');
            }
            
            setMessage('Document assigned to group successfully');
            setMessageType('success');
        } catch (error) {
            console.error('Error assigning document to group:', error);
            setMessage('Error assigning document to group');
            setMessageType('danger');
        }
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
                        <h1>Assign Document to Group</h1>
                        {message && (
                            <Alert variant={messageType} onClose={() => setMessage(null)} dismissible>
                                {message}
                            </Alert>
                        )}
                        <Row>
                            <Col md={6}>
                                <Card className="mb-4">
                                    <Card.Body>
                                        <Form onSubmit={handleAssign}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Group</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={selectedGroup}
                                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                                >
                                                    <option value="">Select a group</option>
                                                    {groups.map(group => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Document</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={selectedDocument}
                                                    onChange={(e) => setSelectedDocument(e.target.value)}
                                                >
                                                    <option value="">Select a document</option>
                                                    {documents.map(document => (
                                                        <option key={document.id} value={document.id}>
                                                            {document.title}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Button variant="primary" type="submit">
                                                Assign Document
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card>
                                    <Card.Body>
                                        <h2>Group List</h2>
                                        <ListGroup>
                                            {groups.map(group => (
                                                <ListGroup.Item key={group.id}>
                                                    <h5>{group.name}</h5>
                                                    <p className="mb-0">{group.description}</p>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
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

export default AssignDocumentPage;