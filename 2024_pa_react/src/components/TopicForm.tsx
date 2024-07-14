import * as React from "react";
import { useEffect, useState, ChangeEvent } from "react";
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
// @ts-ignore
import ChoiceInput from "./ChoiceInput.tsx";
// @ts-ignore
import { Topic, TopicFormProps } from "./Types.tsx";

const TopicForm: React.FC<TopicFormProps> = ({ topic, onChange }) => {
    const [topicData, setTopicData] = useState<Topic>({
        label: '',
        description: '',
        status: '',
        isAnonyme: false,
        modality: '',
        quorum: 50,
        totalRounds: 1,
        choices: [{ description: '' }]
    });
    
    useEffect(() => {
        setTopicData(topic);
    }, [topic]);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        const updatedTopicData = { ...topicData, [e.target.name]: value };
        setTopicData(updatedTopicData);
        onChange(updatedTopicData);
    };
    
    const handleCheckboxChange = () => {
        const updatedTopicData = { ...topicData, isAnonyme: !topicData.isAnonyme };
        setTopicData(updatedTopicData);
        onChange(updatedTopicData);
    };
    
    const handleChoiceChange = (index: number, description: string) => {
        const newChoices = [...topicData.choices];
        newChoices[index] = { ...newChoices[index], description };
        const updatedTopicData = { ...topicData, choices: newChoices };
        setTopicData(updatedTopicData);
        onChange(updatedTopicData);
    };
    
    const addChoice = () => {
        const newChoices = [...topicData.choices, { description: '' }];
        const updatedTopicData = { ...topicData, choices: newChoices };
        setTopicData(updatedTopicData);
        onChange(updatedTopicData);
    };
    
    const removeChoice = (index: number) => {
        const newChoices = topicData.choices.filter((_, idx) => idx !== index);
        const updatedTopicData = { ...topicData, choices: newChoices };
        setTopicData(updatedTopicData);
        onChange(updatedTopicData);
    };
    
    return (
        <Card className="mb-4">
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Label</Form.Label>
                        <Form.Control type="text" name="label" placeholder="Enter label" value={topicData.label} onChange={handleInputChange} />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" placeholder="Enter description" value={topicData.description} onChange={handleInputChange} />
                    </Form.Group>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select name="status" value={topicData.status} onChange={handleInputChange}>
                                    <option value="">Select status</option>
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                    <option value="pending">Pending</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Modality</Form.Label>
                                <Form.Select name="modality" value={topicData.modality} onChange={handleInputChange}>
                                    <option value="">Select modality</option>
                                    <option value="vote">Vote</option>
                                    <option value="discussion">Discussion</option>
                                    <option value="presentation">Presentation</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Quorum (%)</Form.Label>
                                <Form.Control type="number" name="quorum" placeholder="Enter quorum" value={topicData.quorum} onChange={handleInputChange} min={0} max={100} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Total Rounds</Form.Label>
                                <Form.Control type="number" name="totalRounds" placeholder="Enter total rounds" value={topicData.totalRounds} onChange={handleInputChange} min={1} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3 pt-2">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Anonymous"
                                    checked={topicData.isAnonyme}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <h5 className="mt-4 mb-3">Choices</h5>
                    {topicData.choices.map((choice, index) => (
                        <ChoiceInput
                            key={index}
                            index={index}
                            choice={choice}
                            handleChoiceChange={handleChoiceChange}
                            removeChoice={removeChoice}
                        />
                    ))}
                    <Button variant="outline-secondary" size="sm" onClick={addChoice} className="mt-2">
                        Add Choice
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TopicForm;