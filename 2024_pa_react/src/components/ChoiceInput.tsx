import * as React from "react";
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Choice } from "./Types";

interface ChoiceInputProps {
    index: number;
    choice: Choice;
    handleChoiceChange: (index: number, value: string) => void;
    removeChoice: (index: number) => void;
}

const ChoiceInput: React.FC<ChoiceInputProps> = ({ index, choice, handleChoiceChange, removeChoice }) => (
    <InputGroup className="mb-3">
        <Form.Control
            type="text"
            placeholder="Enter choice description"
            value={choice.description}
            onChange={(e) => handleChoiceChange(index, e.target.value)}
        />
        <Button
            variant="outline-danger"
            onClick={() => removeChoice(index)}
        >
            <i className="bi bi-trash"></i>
        </Button>
    </InputGroup>
);

export default ChoiceInput;