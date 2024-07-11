// @ts-ignore
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @ts-ignore
import AdminAssemblyDetails from './AdminAssemblyDetails.tsx';
// @ts-ignore
import VoteResults from './VoteResults.tsx';
// @ts-ignore
import SurveyResults from './SurveyResults.tsx';
// @ts-ignore
import EndVoteButton from "./EndVoteButton.tsx";

interface Assembly {
    id: string;
    name: string;
    meetingDate: string;
    status: string;
    outcome: string;
    creationDate: string;
    endingDate: string;
    topics: Topic[];
    surveys: { id: string }[];
}

interface Topic {
    id: string;
    label: string;
    currentRound: number;
    totalRounds: number;
    quorum: number;
    choices: Choice[];
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

const AdminAssemblyPage: React.FC = () => {
    const { assemblyId } = useParams<{ assemblyId: string }>();
    const [assembly, setAssembly] = useState<Assembly | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssembly = async () => {
            try {
                const response = await fetch(`http://localhost:3000/assemblies/${assemblyId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assembly');
                }
                const data = await response.json();
                console.log('Assembly Data:', data);
                setAssembly(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssembly();
    }, [assemblyId]);

    const fetchTopics = async () => {
        if (!assembly) return;
        try {
            const response = await fetch(`http://localhost:3000/assemblies/${assembly.id}/filtered-topics/`);
            const data = await response.json();
            setAssembly({ ...assembly, topics: data.topics });
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        }
    };

    if (loading) {
        return <p>Loading assembly details...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!assembly) {
        return <p>No assembly found</p>;
    }

    return (
        <div>
            <AdminAssemblyDetails assembly={assembly} />
            <VoteResults assemblyId={assemblyId} />
            {assembly.surveys && assembly.surveys.length > 0 ? (
                assembly.surveys.map(survey => (
                    <SurveyResults key={survey.id} surveyId={survey.id} />
                ))
            ) : (
                <p>No surveys found</p>
            )}
        </div>
    );
};

export default AdminAssemblyPage;