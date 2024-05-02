import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LinkPeopleToAssemblyPage = () => {
    const { assemblyId } = useParams();
    const [persons, setPersons] = useState([]);
    const [selectedPersonIds, setSelectedPersonIds] = useState([]);

    useEffect(() => {
        const fetchPersons = async () => {
            const response = await fetch('http://localhost:3000/persons');
            const data = await response.json();
            setPersons(data);
        };

        fetchPersons();
    }, []);

    const handleTogglePerson = (personId) => {
        setSelectedPersonIds(prev => {
            if (prev.includes(personId)) {
                return prev.filter(id => id !== personId);
            }
            return [...prev, personId];
        });
    };

    const handleSubmit = async () => {
        await fetch(`http://localhost:3000/assemblies/${assemblyId}/link-people`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ personIds: selectedPersonIds })
        });
        alert('People linked successfully!');
    };

    return (
        <div>
            <h1>Link People to Assembly</h1>
            {persons.map(person => (
                <div key={person.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedPersonIds.includes(person.id)}
                            onChange={() => handleTogglePerson(person.id)}
                        />
                        {person.firstName} {person.lastName}
                    </label>
                </div>
            ))}
            <button onClick={handleSubmit}>Link Selected People</button>
        </div>
    );
};

export default LinkPeopleToAssemblyPage;
