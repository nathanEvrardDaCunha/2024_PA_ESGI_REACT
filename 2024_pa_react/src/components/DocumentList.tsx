import{ useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList: React.FC = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        axios.get('/api/documents').then((response) => {
            setDocuments(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Documents</h1>
            <ul>
                {documents.map((document) => (
                    <li key={document.id}>
                        <h2>{document.title}</h2>
                        <p>{document.description}</p>
                        <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">View Document</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentList;
