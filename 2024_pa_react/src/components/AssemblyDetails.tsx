import * as React from "react";
import { useEffect, useState } from 'react';
import { Card, Badge, Button, ListGroup, ProgressBar, Alert, Row, Col } from 'react-bootstrap';
import { Link, LinkProps } from 'react-router-dom';
// @ts-ignore
import Cookies from 'js-cookie';
// @ts-ignore
import SurveyResponseForm from "./Survey/SurveyResponseForm.tsx";
// @ts-ignore
import EndVoteButton from "./Admin/EndVoteButton.tsx";

interface AssemblyDetailsProps {
    assembly: {
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
    };
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

const ButtonLink = React.forwardRef<HTMLAnchorElement, LinkProps & React.ComponentPropsWithoutRef<typeof Button>>((props, ref) => (
    <Button as={Link} ref={ref} {...props} />
));

const AssemblyDetails: React.FC<AssemblyDetailsProps> = ({ assembly }) => {
    const [topics, setTopics] = useState<Topic[]>(assembly.topics || []);
    const [persons, setPersons] = useState<Person[]>(assembly.person || []);
    const [loading, setLoading] = useState(true);
    
    const fetchTopics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/assemblies/${assembly.id}/filtered-topics/`);
            const data = await response.json();
            setTopics(data.topics);
            setPersons(data.person);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchTopics();
    }, [assembly.id]);
    
    const handleVote = async (topicId: string, choiceId: string) => {
        const personId = Cookies.get('userId');
        if (!personId) {
            alert('User ID not found in cookies');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3000/topics/${topicId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ choiceId, personId }),
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }
            
            alert('Vote recorded!');
            fetchTopics();
        } catch (error: any) {
            alert(`Failed to record vote: ${error.message}`);
        }
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
    
    const renderTopics = () => {
        if (loading) {
            return <Alert variant="info">Loading topics...</Alert>;
        }
        
        if (topics.length === 0) {
            return (
                <>
                    <Alert variant="info">No topics available for this assembly.</Alert>
                    <ButtonLink
                        to={`/assemblies/${assembly.id}/results`}
                        variant="primary"
                        className="mt-3"
                    >
                        View Vote Results
                    </ButtonLink>
                </>
            );
        }
        
        return topics.map(topic => (
            <Card key={topic.id} className="mb-4">
                <Card.Header>
                    <h5>{topic.label}</h5>
                    <small>Round: {topic.currentRound} / {topic.totalRounds}</small>
                    <ProgressBar
                        now={(topic.currentRound / topic.totalRounds) * 100}
                        label={`${Math.round((topic.currentRound / topic.totalRounds) * 100)}%`}
                        className="mt-2"
                    />
                </Card.Header>
                <Card.Body>
                    <p>Quorum: {topic.quorum}%</p>
                    <ListGroup className="mb-3">
                        {topic.choices?.map(choice => (
                            <ListGroup.Item key={choice.id} className="d-flex justify-content-between align-items-center">
                                <span>{choice.description}</span>
                                <div>
                                    <Badge bg="secondary" className="me-2">
                                        {choice.voteCount} votes ({choice.voters?.length || 0} voters)
                                    </Badge>
                                    <Button size="sm" variant="outline-primary" onClick={() => handleVote(topic.id, choice.id)}>
                                        Vote
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <EndVoteButton topicId={topic.id} onEndVote={fetchTopics} />
                </Card.Body>
            </Card>
        ));
    };
    
    return (
        <Card>
            <Card.Body>
                <Card.Title className="h3 mb-3">{assembly.name}</Card.Title>
                <Row className="mb-4">
                    <Col md={6}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Meeting Date:</strong> {assembly.meetingDate.toLocaleDateString()}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Status:</strong> {getStatusBadge(assembly.status)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Outcome:</strong> {assembly.outcome || 'Not available'}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={6}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Creation Date:</strong> {assembly.creationDate.toLocaleDateString()}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Ending Date:</strong> {assembly.endingDate ? assembly.endingDate.toLocaleDateString() : 'Not ended'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Participants:</strong> {persons?.length || 0}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                
                <h4 className="mb-3">Topics</h4>
                {renderTopics()}
                
                <h4 className="mb-3">Surveys</h4>
                <SurveyResponseForm assemblyId={assembly.id} />
            </Card.Body>
        </Card>
    );
};

export default AssemblyDetails;