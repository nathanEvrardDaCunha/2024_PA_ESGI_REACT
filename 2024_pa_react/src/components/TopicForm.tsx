import * as React from "react";
import { useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import ChoiceInput from "./ChoiceInput.tsx";
import {TopicFormProps} from "./Types";

const TopicForm: React.FC<TopicFormProps> = ({ topic, onChange }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const [topicData, setTopicData] = useState({
        label: '',
        description: '',
        status: '',
        isAnonyme: false,
        modality: '',
        choices: [{ description: '' }]
    });

    // Synchroniser le state interne avec les props lors du montage et à chaque mise à jour de `topic`
    useEffect(() => {
        setTopicData(topic);
    }, [topic]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const updatedTopicData = { ...topicData, [e.target.name]: e.target.value };
        setTopicData(updatedTopicData);
        onChange(updatedTopicData);
    };

    const handleCheckboxChange = () => {
        const updatedTopicData = { ...topicData, isAnonyme: !topicData.isAnonyme };
        setTopicData(updatedTopicData);
        onChange(updatedTopicData);
    };

    const handleChoiceChange = (index, description) => {
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

    const removeChoice = (index) => {
        const newChoices = topicData.choices.filter((_, idx) => idx !== index);
        const updatedTopicData = { ...topicData, choices: newChoices };
        setTopicData(updatedTopicData);
        onChange(updatedTopicData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        fetch("http://localhost:3000/topics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(topicData),
        })
            .then((response) => {
                if (response.ok) {
                    setSuccess("Topic created successfully");
                    console.log("Topic created successfully");

                } else {
                    setError("Failed to create topic");
                    console.error("Failed to create topic");
                }
            })
            .catch((error) => {
                setError("Error during registration");
                console.error("Error:", error);
            });
        console.log(topicData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="label" placeholder="Label" value={topicData.label} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={topicData.description} onChange={handleInputChange} />
            <input type="text" name="status" placeholder="Status" value={topicData.status} onChange={handleInputChange} />
            <input type="text" name="modality" placeholder="Modality" value={topicData.modality} onChange={handleInputChange} />
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
            <button type="submit">Submit</button>
        </form>
    );
};

export default TopicForm;
