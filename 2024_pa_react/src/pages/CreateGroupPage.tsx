import { useState, useEffect } from 'react';
// @ts-ignore
import Cookies from "js-cookie";

interface Person {
    id: string;
    firstName: string;
    lastName: string;
}

const CreateGroupPage: React.FC = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await fetch('http://localhost:3000/persons', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-id': userId!,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch persons');
                }

                const data = await response.json();
                setPersons(data);
            } catch (error) {
                console.error('Error fetching persons:', error);
            }
        };

        fetchPersons();
    }, [token, userId]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newGroup = {
            name: groupName,
            description: groupDescription,
            memberIds: selectedPersons,
        };

        console.log('Submitting group:', newGroup);

        try {
            const response = await fetch('http://localhost:3000/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'user-id': userId!,
                },
                body: JSON.stringify(newGroup),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Failed to create group:', errorMessage);
                throw new Error('Failed to create group');
            }

            setMessage('Group created successfully');
        } catch (error) {
            console.error('Error creating group:', error);
            setMessage('Error creating group');
        }
    };

    const handlePersonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions);
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedPersons(selectedIds);
    };

    return (
        <div>
            <h1>Create Group</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Group Name</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Group Description</label>
                    <input
                        type="text"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Members</label>
                    <select multiple value={selectedPersons} onChange={handlePersonChange}>
                        {persons.map(person => (
                            <option key={person.id} value={person.id}>
                                {person.firstName} {person.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroupPage;