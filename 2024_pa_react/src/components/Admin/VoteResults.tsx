import  { useEffect, useState } from 'react';
// @ts-ignore
import EndVoteButton from "./EndVoteButton.tsx";

interface Vote {
    topicLabel: string;
    topicDescription: string;
    choices: {
        id:string;
        description: string;
        voteCount: number;
        round:number;
    }[];
    id: string;
    currentRound: number;
    totalRounds: number;
    quorum: number;
}

interface VoteResultsProps {
    assemblyId: string;
}

const VoteResults: React.FC<VoteResultsProps> = ({ assemblyId }) => {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [topics, setTopics] = useState<Vote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const response = await fetch(`http://localhost:3000/assemblies/${assemblyId}/results`);
                if (!response.ok) {
                    throw new Error('Failed to fetch votes');
                }
                const data = await response.json();
                setVotes(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVotes();
    }, [assemblyId]);

    const fetchTopics = async () => {
        try {
            const response = await fetch(`http://localhost:3000/assemblies/${assemblyId}/filtered-topics/`);
            const data = await response.json();
            setVotes(data.topics);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        }
    };

    if (loading) {
        return <p>Loading votes...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h3>Vote Results</h3>
            {votes.map((vote, index) => (
                <div key={index}>
                    <h4>{vote.topicLabel}</h4>
                    <p>{vote.topicDescription}</p>
                    {[...Array(vote.totalRounds)].map((_, roundIndex) => (
                        <div key={roundIndex}>
                            <h5>Round {roundIndex + 1}</h5>
                            <ul>
                                {vote.choices
                                    .filter(choice => choice.round === roundIndex + 1)
                                    .map((choice, idx) => (
                                        <li key={idx}>{choice.description}: {choice.voteCount} votes</li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                    <p>Current Round: {vote.currentRound} / {vote.totalRounds}</p>
                    <p>Quorum: {vote.quorum}%</p>
                    <EndVoteButton topicId={vote.id} onEndVote={fetchTopics} />
                </div>
            ))}
        </div>
    );
};

export default VoteResults;
