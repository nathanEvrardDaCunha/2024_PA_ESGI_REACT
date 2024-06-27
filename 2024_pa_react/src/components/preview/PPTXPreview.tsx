interface PPTXPreviewProps {
    fileUrl: string;
}

const PPTXPreview: React.FC<PPTXPreviewProps> = ({ fileUrl }) => {
    const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    return (
        <div style={{ height: '100%' }}>
            <iframe src={googleDocsViewerUrl} style={{ width: '100%', height: '100%' }} frameBorder="0"></iframe>
        </div>
    );
};

export default PPTXPreview;
