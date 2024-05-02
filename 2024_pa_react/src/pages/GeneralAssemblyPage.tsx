import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GeneralAssembliesPage = () => {
    const [assemblies, setAssemblies] = useState([]);

    useEffect(() => {
        const fetchAssemblies = async () => {
            const response = await fetch('http://localhost:3000/assemblies');
            const data = await response.json();
            setAssemblies(data);
        };

        fetchAssemblies();
    }, []);

    return (
        <div>
            <h1>General Assemblies</h1>
            <ul>
                {assemblies.map(assembly => (
                    <li key={assembly.id}>
                        <Link to={`/assemblies/${assembly.id}/link-people`}>
                            {assembly.name} - {new Date(assembly.meetingDate).toLocaleDateString()}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GeneralAssembliesPage;
