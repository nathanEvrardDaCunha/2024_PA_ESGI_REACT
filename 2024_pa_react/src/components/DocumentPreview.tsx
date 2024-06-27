import { useState, useEffect } from 'react';

const DocumentPreview = ({ fileUrl, fileType }) => {
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        const fetchThumbnail = async () => {
            try {
                const response = await fetch(`/documents/preview?fileUrl=${encodeURIComponent(fileUrl)}&fileType=${fileType}`);
                const blob = await response.blob();
                setThumbnail(URL.createObjectURL(blob));
            } catch (error) {
                console.error('Error fetching thumbnail:', error);
            }
        };

        fetchThumbnail();
    }, [fileUrl, fileType]);

    return (
        <div>
            {thumbnail ? (
                <img src={thumbnail} alt="Document Thumbnail" />
            ) : (
                <p>Loading preview...</p>
            )}
        </div>
    );
};

export default DocumentPreview;
