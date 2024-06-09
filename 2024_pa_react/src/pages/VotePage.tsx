import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';

interface Choice {
    id: string;
    description: string;
}

interface Topic {
    id: string;
    label: string;
    description: string;
    choices: Choice[];
}

const VotePage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [selectedChoice, setSelectedChoice] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/topics/${topicId}`);
                setTopic(response.data);
            } catch (error) {
                console.error('Error fetching topic:', error);
            }
        };

        fetchTopic();
    }, [topicId]);

    const handleVote = async () => {
        try {
            const personId = Cookies.get('userId'); // Remplace par le nom correct du cookie si nécessaire
            if (!personId) {
                console.error('User ID not found in cookies');
                return;
            }

            await axios.post('http://localhost:3000/vote', {
                personId,
                topicId: topic?.id,
                choiceId: selectedChoice,
            });
            navigate('/');
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    };

    if (!topic) return <div>Loading...</div>;

    return (
        <div>
            <h1>{topic.label}</h1>
            <p>{topic.description}</p>
            <div>
                {topic.choices.map(choice => (
                    <div key={choice.id}>
                        <input
                            type="radio"
                            name="choice"
                            value={choice.id}
                            checked={selectedChoice === choice.id}
                            onChange={(e) => setSelectedChoice(e.target.value)}
                        />
                        <label>{choice.description}</label>
                    </div>
                ))}
            </div>
            <button onClick={handleVote}>Submit Vote</button>
        </div>
    );
};

export default VotePage;
