import { useEffect, useState } from 'react';
// @ts-ignore
import Cookies from 'js-cookie';
interface AssemblyDetailsProps {
    assembly: {
        id: string;
        name: string;
        topics: Topic[];
        person: Person[]; // Ajouter cette propriété pour afficher le nombre de personnes associées
    };
}

interface Topic {
    id: string;
    label: string;
    choices: Choice[];
    currentRound: number;
    totalRounds: number;
    quorum: number;
}

interface Choice {
    id: string;
    description: string;
    voteCount: number;
    voters: Person[]; // Ajouter cette propriété pour afficher le nombre de votants
}

interface Person {
    id: string;
}

const AssemblyDetails: React.FC<AssemblyDetailsProps> = ({ assembly }) => {
    const [topics, setTopics] = useState<Topic[]>(assembly.topics);
    const [persons, setPersons] = useState<Person[]>(assembly.person);

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
            // Refresh the topics to reflect the new vote count
            fetchTopics();
        } catch (error: any) {
            alert(`Failed to record vote: ${error.message}`);
        }
    };

    const fetchTopics = async () => {
        try {
            const response = await fetch(`http://localhost:3000/assemblies/${assembly.id}/filtered-topics/`);
            const data = await response.json();
            console.log(data);
            setTopics(data.topics);
            setPersons(data.person);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        }
    };

    const handleEndVote = async (topicId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/topics/${topicId}/next-round-or-end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            alert('Voting processed!');
            // Refresh the topics to reflect the changes
            fetchTopics();
        } catch (error: any) {
            alert(`Failed to process voting: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);
    console.log("nb :"+persons);
    return (
        <div>
            <h2>{assembly.name}</h2>

            <p>Person: {persons?.length || 0}</p>
            {topics.map(topic => (
                <div key={topic.id}>
                    <h3>{topic.label}</h3>
                    <p>Current Round: {topic.currentRound} / {topic.totalRounds}</p>
                    <p>Quorum: {topic.quorum}%</p>
                    {topic.choices?.map(choice => (
                        <div key={choice.id}>
                            <button onClick={() => handleVote(topic.id, choice.id)}>
                                Vote for {choice.description} ({choice.voteCount} votes, {choice.voters?.length || 0} voters)
                            </button>
                        </div>
                    ))}
                    <button onClick={() => handleEndVote(topic.id)}>
                        {topic.currentRound < topic.totalRounds ? 'Next Round' : 'End Voting'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AssemblyDetails;
