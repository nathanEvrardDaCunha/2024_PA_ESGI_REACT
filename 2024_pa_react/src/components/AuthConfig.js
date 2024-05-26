import { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';

const UploadDocument: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            const blobServiceClient = new BlobServiceClient(`https://<your-storage-account-name>.blob.core.windows.net`, new Azure.Storage.SharedKeyCredential('<accountName>', '<accountKey>'));
            const containerClient = blobServiceClient.getContainerClient('<your-container-name>');
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);

            await blockBlobClient.uploadBrowserData(file);

            const fileUrl = blockBlobClient.url;

            await axios.post('/api/documents', {
                title,
                description,
                fileUrl,
                authorFirstName: 'John', // You should get this from the authenticated user's data
                authorLastName: 'Doe',
            });
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadDocument;