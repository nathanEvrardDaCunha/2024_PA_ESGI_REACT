import { useState, useEffect } from 'react';
// @ts-ignore
import Cookies from 'js-cookie';

interface Group {
    id: string;
    name: string;
    description?: string;
}

interface Document {
    id: string;
    title: string;
}

const AssignDocumentPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [selectedDocument, setSelectedDocument] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('http://localhost:3000/groups', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-id': userId!,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }

                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        const fetchDocuments = async () => {
            try {
                const response = await fetch('http://localhost:3000/documents', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-id': userId!,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }

                const data = await response.json();
                setDocuments(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchGroups();
        fetchDocuments();
    }, [token, userId]);

    const handleAssign = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedGroup || !selectedDocument) {
            setMessage('Please select both a group and a document.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/groups/${selectedGroup}/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'user-id': userId!,
                },
                body: JSON.stringify({ documentId: selectedDocument }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Failed to assign document to group:', errorMessage);
                throw new Error('Failed to assign document to group');
            }

            setMessage('Document assigned to group successfully');
        } catch (error) {
            console.error('Error assigning document to group:', error);
            setMessage('Error assigning document to group');
        }
    };

    return (
        <div>
            <h1>Assign Document to Group</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleAssign}>
                <div>
                    <label>Group</label>
                    <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        <option value="">Select a group</option>
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Document</label>
                    <select value={selectedDocument} onChange={(e) => setSelectedDocument(e.target.value)}>
                        <option value="">Select a document</option>
                        {documents.map(document => (
                            <option key={document.id} value={document.id}>
                                {document.title}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Assign Document</button>
            </form>
            <h2>Group List</h2>
            <ul>
                {groups.map(group => (
                    <li key={group.id}>
                        <h3>{group.name}</h3>
                        <p>{group.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssignDocumentPage;
