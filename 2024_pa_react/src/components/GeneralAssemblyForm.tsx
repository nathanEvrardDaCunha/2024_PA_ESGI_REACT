import { useState } from 'react';
// @ts-ignore
import TopicForm from './TopicForm.tsx';  // Assurez-vous d'avoir ce fichier

interface Choice {
    description: string;
}

interface Topic {
    label: string;
    description: string;
    status: string;
    isAnonyme: boolean;
    modality: string;
    choices: Choice[];
}

interface GeneralAssembly {
    meetingDate: Date;
    status: string;
    outcome: string;
    creationDate: Date; // S'assurer que cette propriété est présente
    endingDate: Date;
    topics: Topic[];
    // autres champs selon besoin
}

const GeneralAssemblyForm: React.FC = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [generalAssembly, setGeneralAssembly] = useState<GeneralAssembly>({
        meetingDate: new Date(),
        status: '',
        outcome: '',
        creationDate: new Date(), // Initialiser creationDate à la date courante
        endingDate: new Date(),
        topics: []
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGeneralAssembly({ ...generalAssembly, [e.target.name]: e.target.value });
    };

    const addTopic = () => {
        const newTopics = [...generalAssembly.topics, { label: '', description: '', status: '', isAnonyme: false, modality: '', choices: [] }];
        setGeneralAssembly({ ...generalAssembly, topics: newTopics });
    };

    const handleTopicChange = (index: number, topic: Topic) => {
        const newTopics = [...generalAssembly.topics];
        newTopics[index] = topic;
        setGeneralAssembly({ ...generalAssembly, topics: newTopics });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch("http://localhost:3000/assemblies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(generalAssembly),
        })
            .then((response) => {
                if (response.ok) {
                    setSuccess("Assembly created successfully");
                    console.log("Assembly created successfully");

                } else {
                    setError("Failed to create Assembly");
                    console.error("Failed to create Assembly");
                }
            })
            .catch((error) => {
                setError("Error during registration");
                console.error("Error:", error);
            });
        console.log(generalAssembly);
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
                <TopicForm key={index} topic={topic} onChange={topic => handleTopicChange(index, topic)} />
            ))}
            <button type="button" onClick={addTopic}>Add Topic</button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default GeneralAssemblyForm;
