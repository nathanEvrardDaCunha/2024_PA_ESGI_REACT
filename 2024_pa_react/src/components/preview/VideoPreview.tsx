interface VideoPreviewProps {
    fileUrl: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ fileUrl }) => {
    return (
        <video controls style={{ maxWidth: '100%', height: 'auto' }}>
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoPreview;
