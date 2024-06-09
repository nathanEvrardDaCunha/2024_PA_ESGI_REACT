// @ts-ignore
import React from 'react';
// @ts-ignore
import Cookies from 'js-cookie';

interface AssemblyDetailsProps {
    assembly: {
        id: string;
        name: string;
        topics: Topic[];
    };
}

interface Topic {
    id: string;
    label: string;
    choices: Choice[];
}

interface Choice {
    id: string;
    description: string;
}

const AssemblyDetails: React.FC<AssemblyDetailsProps> = ({ assembly }) => {
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
        } catch (error: any) {
            alert(`Failed to record vote: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>{assembly.name}</h2>
            {assembly.topics.map(topic => (
                <div key={topic.id}>
                    <h3>{topic.label}</h3>
                    {topic.choices?.map(choice => (
                        <button key={choice.id} onClick={() => handleVote(topic.id, choice.id)}>
                            Vote for {choice.description}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AssemblyDetails;
