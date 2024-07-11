import { useState, useEffect } from 'react';
// @ts-ignore
import AssemblyDetails from '../components/AssemblyDetails.tsx';
// @ts-ignore
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import {Survey} from "../components/Types";

export interface Assembly {
    id:string;
    meetingDate: Date;
    status: string;
    outcome: string;
    creationDate: Date;
    endingDate: Date;
    topics: Topic[];
    surveys: Survey[];
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

const UserAssembliesPage = () => {
    const [assemblies, setAssemblies] = useState<Assembly[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssemblies = async () => {
            setLoading(true);
            const userId = Cookies.get('userId');
            if (!userId) {
                setError('User ID not found in cookies');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/assemblies/person/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch assemblies');
                }
                const data = await response.json();
                setAssemblies(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssemblies();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Your Assemblies</h1>
            {assemblies.length > 0 ? (
                assemblies.map(assembly => (
                    <div key={assembly.id}>
                        <Link to={`/assemblies/${assembly.id}`}>
                            <h2>{new Date(assembly.meetingDate).toLocaleDateString()}</h2>
                        </Link>
                    </div>
                ))
            ) : (
                <div>No assemblies found.</div>
            )}
        </div>
    );
};

export default UserAssembliesPage;
