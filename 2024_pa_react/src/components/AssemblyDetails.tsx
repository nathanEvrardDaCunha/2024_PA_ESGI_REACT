import { useEffect, useState } from 'react';
// @ts-ignore
import Cookies from 'js-cookie';
// @ts-ignore
import SurveyResponseForm from "./Survey/SurveyResponseForm.tsx";
// @ts-ignore
import EndVoteButton from "./Admin/EndVoteButton.tsx";
interface AssemblyDetailsProps {
    assembly: {
        id: string;
        name: string;
        meetingDate: Date;
        status: string;
        outcome: string;
        creationDate: Date;
        endingDate: Date;
        topics: Topic[];
        surveys: Survey[];
        person: Person[];
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
    voters: Person[];
}

interface Person {
    id: string;
}

interface Survey {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

interface Question {
    id: string;
    label: string;
    type: string;
    options: string[];
}

const AssemblyDetails: React.FC<AssemblyDetailsProps> = ({ assembly }) => {
    const [topics, setTopics] = useState<Topic[]>(assembly.topics || []);
    const [persons, setPersons] = useState<Person[]>(assembly.person || []);

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
            fetchTopics();
        } catch (error: any) {
            alert(`Failed to record vote: ${error.message}`);
        }
    };

    const fetchTopics = async () => {
        try {
            const response = await fetch(`http://localhost:3000/assemblies/${assembly.id}/filtered-topics/`);
            const data = await response.json();
            setTopics(data.topics);
            setPersons(data.person);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <div>
            <h2>{assembly.name}</h2>
            <p>Meeting Date: {assembly.meetingDate.toLocaleDateString()}</p>
            <p>Status: {assembly.status}</p>
            <p>Outcome: {assembly.outcome}</p>
            <p>Participants: {persons?.length || 0}</p>
            {topics.length > 0 ? (
                topics.map(topic => (
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
                        <EndVoteButton topicId={topic.id} onEndVote={fetchTopics} />
                    </div>
                ))
            ) : (
                <p>No topics available.</p>
            )}
            <SurveyResponseForm assemblyId={assembly.id} />
        </div>
    );
};

export default AssemblyDetails;