// @ts-ignore
import React from "react";
import { Choice } from "./Types";

interface ChoiceInputProps {
    index: number;
    choice: Choice;
    handleChoiceChange: (index: number, value: string) => void;
    removeChoice: (index: number) => void;
}

const ChoiceInput: React.FC<ChoiceInputProps> = ({ index, choice, handleChoiceChange, removeChoice }) => (
    <div>
        <input
            type="text"
            placeholder="Description"
            value={choice.description}
            onChange={(e) => handleChoiceChange(index, e.target.value)}
        />
        <button type="button" onClick={() => removeChoice(index)}>Remove</button>
    </div>
);

export default ChoiceInput;
