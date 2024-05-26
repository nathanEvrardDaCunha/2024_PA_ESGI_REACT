import { useState, useEffect } from 'react';
// @ts-ignore
import AssemblyDetails from '../components/AssemblyDetails.tsx';
// @ts-ignore
import Cookies from 'js-cookie';  // Utilisé pour récupérer l'ID de l'utilisateur des cookies

const UserAssembliesPage = () => {
    const [assemblies, setAssemblies] = useState([]);
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
            } catch (error) {
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
