import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Topic {
    id: string;
    label: string;
}

const TopicsPage: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('http://localhost:3000/topics');
                setTopics(response.data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    }, []);

    return (
        <div>
            <h1>Topics</h1>
            <ul>
                {topics.map(topic => (
                    <li key={topic.id}>
                        <Link to={`/vote/${topic.id}`}>{topic.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopicsPage;
