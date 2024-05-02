// @ts-ignore
import React from "react";

interface Person {
    id: string;
    firstName: string;
    lastName: string;
}

interface PersonSelectorProps {
    persons: Person[];
    selectedPersonIds: string[];
    togglePerson: (personId: string) => void;
}

const PersonSelector: React.FC<PersonSelectorProps> = ({ persons, selectedPersonIds, togglePerson }) => {
    return (
        <div>
            <h3>Select People:</h3>
            {persons.map(person => (
                <div key={person.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedPersonIds.includes(person.id)}
                            onChange={() => togglePerson(person.id)}
                        />
                        {person.firstName} {person.lastName}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default PersonSelector;
