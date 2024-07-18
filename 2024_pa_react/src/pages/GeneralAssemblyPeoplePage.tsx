import { useState, useEffect } from 'react';
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import PersonSelector from '../components/PersonSelector.tsx';

const GeneralAssemblyPeoplePage = () => {
    const [persons, setPersons] = useState([]);
    const [selectedPersonIds, setSelectedPersonIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPersons = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/persons`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPersons(data);
            } catch (error) {
                setError('Failed to load persons: ' + error.message);
            }
            setLoading(false);
        };

        fetchPersons();
    }, []);

    const togglePerson = (personId) => {
        setSelectedPersonIds(prev => {
            if (prev.includes(personId)) {
                return prev.filter(id => id !== personId);
            }
            return [...prev, personId];
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ComposedBackground>
            <Navbar />
            <h1>Link People to General Assembly</h1>
            <PersonSelector
                persons={persons}
                selectedPersonIds={selectedPersonIds}
                togglePerson={togglePerson}
            />
            <button onClick={() => console.log("Link these people:", selectedPersonIds)}>Link Selected People</button>
        </ComposedBackground>
    );
};

export default GeneralAssemblyPeoplePage;
