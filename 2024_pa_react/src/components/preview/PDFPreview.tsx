interface PDFPreviewProps {
    fileUrl: string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ fileUrl }) => {
    const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    return (
        <div style={{ height: '100%' }}>
            <iframe src={googleDocsViewerUrl} style={{ width: '100%', height: '100%' }} frameBorder="0"></iframe>
        </div>
    );
};

export default PDFPreview;
