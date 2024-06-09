import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ChoiceResult {
    description: string;
    voteCount: number;
}

interface TopicResult {
    topicLabel: string;
    topicDescription: string;
    choices: ChoiceResult[];
}

const VoteResults = () => {
    const { assemblyId } = useParams<{ assemblyId: string }>();
    const [results, setResults] = useState<TopicResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`http://localhost:3000/assemblies/${assemblyId}/results`);
                const data = await response.json();
                if (response.ok) {
                    setResults(data);
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError('Failed to fetch results');
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [assemblyId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Vote Results for Assembly</h2>
            {results.map((topicResult, index) => (
                <div key={index}>
                    <h3>{topicResult.topicLabel}</h3>
                    <p>{topicResult.topicDescription}</p>
                    <ul>
                        {topicResult.choices.map((choice, idx) => (
                            <li key={idx}>
                                {choice.description}: {choice.voteCount} votes
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default VoteResults;