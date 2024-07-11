import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @ts-ignore
import AssemblyDetails from '../components/AssemblyDetails.tsx';
interface Assembly {
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

const AssemblyPage = () => {
    const { id } = useParams<{ id: string }>();
    const [assembly, setAssembly] = useState<Assembly | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssembly = async () => {
            setLoading(true);

            try {
                const response = await fetch(`http://localhost:3000/assemblies/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assembly');
                }
                const data = await response.json();

                // Convert date strings to Date objects
                data.meetingDate = new Date(data.meetingDate);
                data.creationDate = new Date(data.creationDate);
                data.endingDate = new Date(data.endingDate);

                setAssembly(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssembly();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!assembly) {
        return <div>No assembly found.</div>;
    }

    return (
        <div>
            <AssemblyDetails assembly={assembly} />
        </div>
    );
};

export default AssemblyPage;