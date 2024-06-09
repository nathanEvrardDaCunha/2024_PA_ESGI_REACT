import { useEffect, useState } from 'react';

interface Document {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    authorFirstName: string;
    authorLastName: string;
    creationDate: string;
    lastModified?: string;
    type: string;
    accessLevel: string;
    version: number;
    status: string;
}

const DocumentsPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('http://localhost:3000/documents', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'user-id': localStorage.getItem('userId') || '',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }

                const data = await response.json();
                setDocuments(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchDocuments();
    }, []);

    const handleDownload = (fileUrl: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop() || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1>Documents</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {documents.map(document => (
                    <li key={document.id}>
                        <h2>{document.title}</h2>
                        <p>{document.description}</p>
                        <p>Author: {document.authorFirstName} {document.authorLastName}</p>
                        <p>Created on: {new Date(document.creationDate).toLocaleDateString()}</p>
                        <button onClick={() => handleDownload(document.fileUrl)}>Download</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentsPage;
