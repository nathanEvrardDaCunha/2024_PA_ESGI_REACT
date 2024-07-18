import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AssembliesList = () => {
    const [assemblies, setAssemblies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssemblies = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assemblies`);
                const data = await response.json();
                if (response.ok) {
                    setAssemblies(data);
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError('Failed to fetch assemblies');
                console.error('Error fetching assemblies:', error);
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
            <h2>Assemblies List</h2>
            <ul>
                {assemblies.map((assembly) => (
                    <li key={assembly.id}>
                        <Link to={`/assemblies/${assembly.id}/results`}>{assembly.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssembliesList;