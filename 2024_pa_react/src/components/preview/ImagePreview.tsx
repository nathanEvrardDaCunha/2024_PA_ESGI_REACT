import { useState } from 'react';

const ImagePreview = ({ fileUrl }) => {
    return <img src={fileUrl} alt="Image Preview" style={{ maxWidth: '100%', height: 'auto' }} />;
};

export default ImagePreview;
