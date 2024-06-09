import { useState, ChangeEvent, FormEvent } from 'react';
// @ts-ignore
import TopicForm from './TopicForm.tsx';
// @ts-ignore
import { GeneralAssembly, Topic } from './Types.tsx';

const GeneralAssemblyForm: React.FC = () => {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [generalAssembly, setGeneralAssembly] = useState<GeneralAssembly>({
        meetingDate: new Date(),
        status: '',
        outcome: '',
        creationDate: new Date(),
        endingDate: new Date(),
        topics: []
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGeneralAssembly({ ...generalAssembly, [e.target.name]: e.target.value });
    };

    const addTopic = () => {
        const newTopics = [...generalAssembly.topics, { label: '', description: '', status: '', isAnonyme: false, modality: '', quorum: 0, totalRounds:1, choices: [] }];
        setGeneralAssembly({ ...generalAssembly, topics: newTopics });
    };

    const handleTopicChange = (index: number, topic: Topic) => {
        const newTopics = [...generalAssembly.topics];
        newTopics[index] = topic;
        setGeneralAssembly({ ...generalAssembly, topics: newTopics });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Submitting assembly:", generalAssembly);

        try {
            const response = await fetch("http://localhost:3000/assemblies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(generalAssembly),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(`Failed to create Assembly: ${errorData.error}`);
                console.error("Failed to create Assembly:", errorData);
            } else {
                setSuccess("Assembly created successfully");
                console.log("Assembly created successfully");
            }
        } catch (error) {
            setError("Error during registration");
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create General Assembly</h2>
            <label>
                Meeting Date:
                <input type="date" name="meetingDate" value={generalAssembly.meetingDate.toISOString().substr(0, 10)} onChange={handleInputChange} />
            </label>
            <label>
                Status:
                <input type="text" name="status" value={generalAssembly.status} onChange={handleInputChange} />
            </label>
            <label>
                Outcome:
                <textarea name="outcome" value={generalAssembly.outcome} onChange={handleInputChange} />
            </label>
            {generalAssembly.topics.map((topic, index) => (
                <TopicForm key={index} topic={topic} onChange={(updatedTopic) => handleTopicChange(index, updatedTopic)} />
            ))}
            <button type="button" onClick={addTopic}>Add Topic</button>
            <button type="submit">Submit</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
        </form>
    );
};

export default GeneralAssemblyForm;