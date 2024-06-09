import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// @ts-ignore
import ChoiceInput from "./ChoiceInput.tsx";
// @ts-ignore
import { Topic, Choice, TopicFormProps } from "./Types.tsx";
const TopicForm: React.FC<TopicFormProps> = ({ topic, onChange }) => {
    const [topicData, setTopicData] = useState<Topic>({
        label: '',
        description: '',
        status: '',
        isAnonyme: false,
        modality: '',
        quorum: 50,
        totalRounds: 1,   // Initialiser le nombre total de rounds
        choices: [{ description: '' }]
    });

    useEffect(() => {
        setTopicData(topic);
    }, [topic]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const updatedTopicData = { ...topicData, [e.target.name]: e.target.value };
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
        <div>
            <input type="text" name="label" placeholder="Label" value={topicData.label} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={topicData.description} onChange={handleInputChange} />
            <input type="text" name="status" placeholder="Status" value={topicData.status} onChange={handleInputChange} />
            <input type="text" name="modality" placeholder="Modality" value={topicData.modality} onChange={handleInputChange} />
            <input type="number" name="quorum" placeholder="Quorum" value={topicData.quorum} onChange={handleInputChange} />
            <input type="number" name="totalRounds" placeholder="Total Rounds" value={topicData.totalRounds} onChange={handleInputChange} />
            <label>
                Is Anonyme:
                <input type="checkbox" checked={topicData.isAnonyme} onChange={handleCheckboxChange} />
            </label>
            {topicData.choices.map((choice, index) => (
                <ChoiceInput
                    key={index}
                    index={index}
                    choice={choice}
                    handleChoiceChange={handleChoiceChange}
                    removeChoice={removeChoice}
                />
            ))}
            <button type="button" onClick={addChoice}>Add Choice</button>
        </div>
    );
};

export default TopicForm;