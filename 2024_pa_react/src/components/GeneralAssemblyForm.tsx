import * as React from 'react';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
// @ts-ignore
import TopicForm from './TopicForm.tsx';
// @ts-ignore
import { GeneralAssembly, Topic, Survey, Question, QuestionType } from './Types.tsx';
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import Footer from "../components/Footer.tsx";
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

const GeneralAssemblyForm: React.FC = () => {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [generalAssembly, setGeneralAssembly] = useState<GeneralAssembly>({
        meetingDate: new Date().toISOString().substr(0, 10),
        status: '',
        outcome: '',
        creationDate: new Date().toISOString().substr(0, 10),
        endingDate: new Date().toISOString().substr(0, 10),
        topics: [],
        surveys: []
    });
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setGeneralAssembly(prev => ({ ...prev, [name]: value }));
    };
    
    const addTopic = () => {
        setGeneralAssembly(prev => ({
            ...prev,
            topics: [...prev.topics, {
                label: '',
                description: '',
                status: '',
                isAnonyme: false,
                modality: '',
                quorum: 50,
                totalRounds: 1,
                choices: [{ description: '' }]
            }]
        }));
    };
    
    const handleTopicChange = (index: number, updatedTopic: Topic) => {
        const newTopics = [...generalAssembly.topics];
        newTopics[index] = updatedTopic;
        setGeneralAssembly(prev => ({ ...prev, topics: newTopics }));
    };
    
    const addSurvey = () => {
        setGeneralAssembly(prev => ({
            ...prev,
            surveys: [...prev.surveys, {
                title: '',
                description: '',
                questions: []
            }]
        }));
    };
    
    const handleSurveyChange = (index: number, updatedSurvey: Survey) => {
        const newSurveys = [...generalAssembly.surveys];
        newSurveys[index] = updatedSurvey;
        setGeneralAssembly(prev => ({ ...prev, surveys: newSurveys }));
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        const submissionData = {
            ...generalAssembly,
            meetingDate: new Date(generalAssembly.meetingDate),
            creationDate: new Date(generalAssembly.creationDate),
            endingDate: new Date(generalAssembly.endingDate)
        };
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create Assembly');
            }
            
            setSuccess("Assembly created successfully");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error during registration");
            console.error("Error:", error);
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
                <div className={`flex-grow-1 ${isSidebarOpen ? "ms-250" : ""}`} style={{ transition: 'margin 0.3s' }}>
                    <ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
                    <Container className="py-5">
                        <h2 className="mb-4">Create General Assembly</h2>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Meeting Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="meetingDate"
                                            value={generalAssembly.meetingDate}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            name="status"
                                            value={generalAssembly.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select a status</option>
                                            <option value="scheduled">Scheduled</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Outcome</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="outcome"
                                    value={generalAssembly.outcome}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            
                            <h4 className="mt-4 mb-3">Topics</h4>
                            {generalAssembly.topics.map((topic, index) => (
                                <TopicForm
                                    key={index}
                                    topic={topic}
                                    onChange={(updatedTopic) => handleTopicChange(index, updatedTopic)}
                                />
                            ))}
                            <Button variant="outline-secondary" onClick={addTopic} className="mb-4">Add Topic</Button>
                            
                            <h4 className="mt-4 mb-3">Surveys</h4>
                            {generalAssembly.surveys.map((survey, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Survey Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={survey.title}
                                                onChange={(e) => handleSurveyChange(index, { ...survey, title: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Survey Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={survey.description}
                                                onChange={(e) => handleSurveyChange(index, { ...survey, description: e.target.value })}
                                            />
                                        </Form.Group>
                                        {survey.questions.map((question, qIndex) => (
                                            <Card key={qIndex} className="mb-2">
                                                <Card.Body>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Question {qIndex + 1}</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={question.label}
                                                            onChange={(e) => {
                                                                const newQuestions = [...survey.questions];
                                                                newQuestions[qIndex] = { ...question, label: e.target.value };
                                                                handleSurveyChange(index, { ...survey, questions: newQuestions });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Question Type</Form.Label>
                                                        <Form.Select
                                                            value={question.type}
                                                            onChange={(e) => {
                                                                const newQuestions = [...survey.questions];
                                                                newQuestions[qIndex] = { ...question, type: e.target.value as QuestionType };
                                                                handleSurveyChange(index, { ...survey, questions: newQuestions });
                                                            }}
                                                        >
                                                            <option value={QuestionType.TEXT}>Text</option>
                                                            <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                                                            <option value={QuestionType.CHECKBOX}>Checkbox</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                    {(question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX) && (
                                                        <div>
                                                            {question.options.map((option, oIndex) => (
                                                                <Form.Group key={oIndex} className="mb-2">
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={option}
                                                                        placeholder={`Option ${oIndex + 1}`}
                                                                        onChange={(e) => {
                                                                            const newOptions = [...question.options];
                                                                            newOptions[oIndex] = e.target.value;
                                                                            const newQuestions = [...survey.questions];
                                                                            newQuestions[qIndex] = { ...question, options: newOptions };
                                                                            handleSurveyChange(index, { ...survey, questions: newQuestions });
                                                                        }}
                                                                    />
                                                                </Form.Group>
                                                            ))}
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newQuestions = [...survey.questions];
                                                                    newQuestions[qIndex] = { ...question, options: [...question.options, ''] };
                                                                    handleSurveyChange(index, { ...survey, questions: newQuestions });
                                                                }}
                                                            >
                                                                Add Option
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        ))}
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => {
                                                const newQuestions = [...survey.questions, { label: '', type: QuestionType.TEXT, options: [] }];
                                                handleSurveyChange(index, { ...survey, questions: newQuestions });
                                            }}
                                        >
                                            Add Question
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                            <Button variant="outline-sefcondary" onClick={addSurvey} className="mb-4">Add Survey</Button>
                            
                            <div>
                                <Button variant="primary" type="submit">Create General Assembly</Button>
                            </div>
                        </Form>
                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
                    </Container>
                </div>
            </div>
            <Footer />
        </ComposedBackground>
    );
};

export default GeneralAssemblyForm;