import * as React from "react";
import {useEffect, useState} from "react";
import { BlobServiceClient } from '@azure/storage-blob';
// @ts-ignore
import Cookies from 'js-cookie';
// @ts-ignore
import Navbar from "../components/NavBar.tsx";
// @ts-ignore
import ComposedBackground from "../components/ComposedBackground.tsx";
// @ts-ignore
import Footer from "../components/Footer.tsx";
// @ts-ignore
import SideBar from "../components/SideBar.tsx";

const ToggleSidebarButton = ({ onClick, isOpen }) => (
    <button
        className={`bg-dark d-flex align-items-center ${isOpen ? 'active' : ''}`}
        onClick={onClick}
    >
      <i className={`bi bi-list${isOpen ? 'bi-x' : ''}`}></i>
      <span className={'text-light'}>X</span>
    </button>
);

const UploadDocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setFileType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      const mimeType = selectedFile.type;
      const extension = mimeType.split('/')[1];
      setFileType(extension);
    }
  };
  
  const handleUpload = async () => {
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    
    const sasUrl = process.env.REACT_APP_AZURE_SAS_URL!;
    const containerName = process.env.REACT_APP_AZURE_CONTAINER_NAME!;
    const authorId = Cookies.get('userId');
    const token = Cookies.get('authToken');
    
    if (!sasUrl || !containerName || !authorId || !token) {
      setUploadError('Missing required configuration. Please try again later.');
      setIsUploading(false);
      return;
    }
    
    if (file) {
      try {
        const blobServiceClient = new BlobServiceClient(sasUrl);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        
        await blockBlobClient.uploadBrowserData(file);
        
        const fileUrl = blockBlobClient.url;
        
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/documents`, {
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
            type,
            authorId
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        
        setUploadSuccess(true);
        setTitle('');
        setDescription('');
        setFile(null);
        setFileType('');
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError('Failed to upload document. Please try again.');
      }
    } else {
      setUploadError('No file selected. Please choose a file to upload.');
    }
    setIsUploading(false);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
      <ComposedBackground>
        <Navbar />
        <div className="d-flex min-vh-100">
          {isSidebarOpen && <SideBar onClose={closeSidebar} />}
          <div className={`flex-grow-1 ${isSidebarOpen ? "mx-0" : ""}`}>
            <ToggleSidebarButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
            <div className="container mt-4">
              <h1 className="mb-4">Upload Document</h1>
              <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }} className="mb-4">
                <div className="mb-3">
                  <label htmlFor="file" className="form-label">Choose File</label>
                  <input type="file" className="form-control" id="file" onChange={handleFileChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter document title"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                      className="form-control"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter document description"
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </form>
              {uploadSuccess && (
                  <div className="alert alert-success" role="alert">
                    Document uploaded successfully!
                  </div>
              )}
              {uploadError && (
                  <div className="alert alert-danger" role="alert">
                    {uploadError}
                  </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </ComposedBackground>
  );
};

export default UploadDocument;