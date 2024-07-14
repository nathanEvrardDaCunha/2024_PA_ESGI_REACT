import * as React from "react";
import { useEffect, useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
// @ts-ignore
import Cookies from 'js-cookie';

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

interface SurveyResponseFormProps {
    assemblyId: string;
}

const SurveyResponseForm: React.FC<SurveyResponseFormProps> = ({ assemblyId }) => {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [responses, setResponses] = useState<{ [key: string]: string | string[] }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await fetch(`http://localhost:3000/assemblies/${assemblyId}/survey`);
                if (!response.ok) {
                    throw new Error('Failed to fetch survey');
                }
                const data = await response.json();
                if (data.length > 0) {
                    setSurvey(data[0]);  // Assuming only one survey per assembly
                }
            } catch (error) {
                setError('Failed to fetch survey. Please try again later.');
                console.error('Failed to fetch survey:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSurvey();
    }, [assemblyId]);
    
    const handleResponseChange = (questionId: string, response: string | string[]) => {
        setResponses({ ...responses, [questionId]: response });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const personId = Cookies.get('userId');
        if (!personId) {
            setError('User ID not found in cookies');
            return;
        }
        
        const surveyResponse = {
            surveyId: survey?.id,
            respondentId: personId,
            answers: Object.entries(responses).map(([questionId, answer]) => ({
                questionId,
                answer: Array.isArray(answer) ? answer.join(', ') : answer,
            })),
        };
        
        try {
            const response = await fetch('http://localhost:3000/surveys/response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(surveyResponse),
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }
            
            alert('Survey response submitted successfully!');
        } catch (error: any) {
            setError(`Failed to submit survey response: ${error.message}`);
        }
    };
    
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
        return <Alert variant="danger">{error}</Alert>;
    }
    
    if (!survey) {
        return <Alert variant="info">No survey available for this assembly.</Alert>;
    }
    
    return (
        <Card>
            <Card.Body>
                <Card.Title>{survey.title}</Card.Title>
                <Card.Text>{survey.description}</Card.Text>
                <Form onSubmit={handleSubmit}>
                    {survey.questions.map((question) => (
                        <Form.Group key={question.id} className="mb-3">
                            <Form.Label>{question.label}</Form.Label>
                            {question.type === 'TEXT' && (
                                <Form.Control
                                    type="text"
                                    value={responses[question.id] as string || ''}
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                />
                            )}
                            {question.type === 'MULTIPLE_CHOICE' && (
                                question.options.map((option, index) => (
                                    <Form.Check
                                        key={index}
                                        type="radio"
                                        id={`${question.id}-${index}`}
                                        name={question.id}
                                        label={option}
                                        value={option}
                                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                    />
                                ))
                            )}
                            {question.type === 'CHECKBOX' && (
                                question.options.map((option, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        id={`${question.id}-${index}`}
                                        label={option}
                                        value={option}
                                        onChange={(e) => {
                                            const currentResponses = responses[question.id] as string[] || [];
                                            if (e.target.checked) {
                                                handleResponseChange(question.id, [...currentResponses, option]);
                                            } else {
                                                handleResponseChange(question.id, currentResponses.filter(r => r !== option));
                                            }
                                        }}
                                    />
                                ))
                            )}
                        </Form.Group>
                    ))}
                    <Button variant="primary" type="submit">Submit Survey</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default SurveyResponseForm;