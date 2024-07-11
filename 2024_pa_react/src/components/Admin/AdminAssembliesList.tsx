import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Assembly {
    id: string;
    name: string;
    meetingDate: string;
}

const AdminAssembliesList: React.FC = () => {
    const [assemblies, setAssemblies] = useState<Assembly[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssemblies = async () => {
            try {
                const response = await fetch('http://localhost:3000/assemblies');
                if (!response.ok) {
                    throw new Error('Failed to fetch assemblies');
                }
                const data = await response.json();
                setAssemblies(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssemblies();
    }, []);

    if (loading) {
        return <p>Loading assemblies...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Assemblies List</h1>
            <ul>
                {assemblies.map((assembly) => (
                    <li key={assembly.id}>
                        <Link to={`/admin/assemblies/${assembly.id}`}>
                            {assembly.name} - {new Date(assembly.meetingDate).toLocaleDateString()}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminAssembliesList;
