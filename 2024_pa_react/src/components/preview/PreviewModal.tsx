// @ts-ignore
import Modal from 'react-modal';
// @ts-ignore
import ImagePreview from './ImagePreview.tsx';
// @ts-ignore
import PDFPreview from './PDFPreview.tsx';
// @ts-ignore
import VideoPreview from './VideoPreview.tsx';
// @ts-ignore
import PPTXPreview from "./PPTXPreview.tsx";
// @ts-ignore
import WordPreview from "./WordPreview.tsx";

interface PreviewModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    fileUrl: string;
    fileType: string;
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
    },
};

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onRequestClose, fileUrl, fileType }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="File Preview">
            <button onClick={onRequestClose}>Close</button>
            {fileType === 'image' && <ImagePreview fileUrl={fileUrl} />}
            {fileType === 'pdf' && <PDFPreview fileUrl={fileUrl} />}
            {fileType === 'video' && <VideoPreview fileUrl={fileUrl} />}
            {fileType === 'pptx' && <PPTXPreview fileUrl={fileUrl} />}
            {fileType === 'word' && <WordPreview fileUrl={fileUrl} />}
        </Modal>
    );
};

export default PreviewModal;