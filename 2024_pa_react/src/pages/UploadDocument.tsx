import { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
// @ts-ignore
import Cookies from 'js-cookie';

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
    console.log('REACT_APP_AZURE_SAS_URL:', process.env.REACT_APP_AZURE_SAS_URL);
    const sasUrl = process.env.REACT_APP_AZURE_SAS_URL!;
    const containerName = process.env.REACT_APP_AZURE_CONTAINER_NAME!;
    const authorId = Cookies.get('userId');
    const token = Cookies.get('authToken');

    console.log('SAS URL:', sasUrl);
    console.log('Container Name:', containerName);

    if (!sasUrl || !containerName || !authorId || !token) {
      console.error('Missing SAS URL, Container Name, authorId, or token');
      return;
    }

    if (file) {
      console.log('Uploading file:', file.name);
      try {
        const blobServiceClient = new BlobServiceClient(sasUrl);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);

        console.log('BlockBlobClient URL:', blockBlobClient.url);

        await blockBlobClient.uploadBrowserData(file);

        const fileUrl = blockBlobClient.url;

        console.log('File URL:', fileUrl);

        // Vérification de l'accès direct à l'URL du blob
        /*
        const verifyResponse = await fetch(fileUrl, { method: 'HEAD' });
        if (verifyResponse.ok) {
          console.log('File successfully uploaded and accessible at:', fileUrl);
        } else {
          console.error('Uploaded file not accessible:', verifyResponse.statusText);
        }
        */
        const response = await fetch('http://localhost:3000/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user-id': authorId!,
          },
          body: JSON.stringify({
            title,
            description,
            fileUrl,
            authorId
          }),
        });

        if (!response.ok) {
          console.error('Failed to upload document metadata:', response.statusText);
        } else {
          console.log('Document metadata uploaded successfully');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
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
