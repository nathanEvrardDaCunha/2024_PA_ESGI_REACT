import { useEffect, useState } from 'react';

const LinkPeopleToAssemblyForm = ({ assemblies, persons }) => {
    const [selectedAssemblyId, setSelectedAssemblyId] = useState('');
    const [selectedPersons, setSelectedPersons] = useState([]);

    const handlePersonCheckboxChange = (personId) => {
        setSelectedPersons(prev => {
            if (prev.includes(personId)) {
                return prev.filter(id => id !== personId);
            }
            return [...prev, personId];
        });
    };

    const handleAssemblySelect = (e) => {
        setSelectedAssemblyId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Assume there's an API endpoint to link persons to an assembly
        console.log("Linking persons:", selectedPersons, "to assembly:", selectedAssemblyId);
        // API call to link persons to assembly would go here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="assemblySelect">Select Assembly:</label>
                <select id="assemblySelect" value={selectedAssemblyId} onChange={handleAssemblySelect}>
                    {assemblies.map((assembly) => (
                        <option key={assembly.id} value={assembly.id}>{assembly.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <fieldset>
                    <legend>Select Persons:</legend>
                    {persons.map((person) => (
                        <div key={person.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedPersons.includes(person.id)}
                                    onChange={() => handlePersonCheckboxChange(person.id)}
                                />
                                {person.firstName} {person.lastName}
                            </label>
                        </div>
                    ))}
                </fieldset>
            </div>
            <button type="submit">Link Persons</button>
        </form>
    );
};
