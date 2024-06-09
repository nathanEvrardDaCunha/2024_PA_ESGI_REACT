import { useState, useEffect } from 'react';
// @ts-ignore
import AssemblyDetails from '../components/AssemblyDetails.tsx';
// @ts-ignore
import Cookies from 'js-cookie';

interface Assembly {
    id: string;
    name: string;
    topics: Topic[];
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
                    <AssemblyDetails key={assembly.id} assembly={assembly} />
                ))
            ) : (
                <div>No assemblies found.</div>
            )}
        </div>
    );
};

export default UserAssembliesPage;
