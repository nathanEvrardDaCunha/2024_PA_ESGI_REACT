import { useState, useEffect } from 'react';
// @ts-ignore
import Cookies from 'js-cookie';

// @ts-ignore
import PreviewModal from '../components/preview/PreviewModal.tsx';

interface Document {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    authorFirstName: string;
    authorLastName: string;
    creationDate: string;
    lastModified?: string;
    type: string;
    accessLevel: string;
    version: number;
    status: string;
    path: string;
}

interface Folder {
    name: string;
    path: string;
    children: Folder[];
    documents: Document[];
}

const UserDocumentsPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newFolderName, setNewFolderName] = useState<string>('');
    const [filterPath, setFilterPath] = useState<string>('');
    const [draggedItem, setDraggedItem] = useState<Folder | Document | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
    const [selectedFileType, setSelectedFileType] = useState<string>('');
    const userId = Cookies.get('userId');
    const token = Cookies.get('authToken');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`http://localhost:3000/documents/user/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-id': userId!,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }

                const data = await response.json();
                setDocuments(data);
                const tree = buildTree(data);
                setFolders(tree);
                setFilteredFolders(tree);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchDocuments();
    }, [userId, token]);

    const handleDownload = (fileUrl: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop() || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePreview = (fileUrl: string, fileType: string) => {
        setSelectedFileUrl(fileUrl);
        setSelectedFileType(fileType);
        setModalIsOpen(true);
    };

    const buildTree = (documents: Document[]): Folder[] => {
        const root: Folder = { name: 'root', path: '', children: [], documents: [] };

        documents.forEach(document => {
            const parts = document.path.split('/').filter(Boolean);
            let currentFolder = root;

            parts.forEach((part, index) => {
                let folder = currentFolder.children.find(child => child.name === part);
                if (!folder) {
                    folder = { name: part, path: `${currentFolder.path}/${part}`, children: [], documents: [] };
                    currentFolder.children.push(folder);
                }
                if (index === parts.length - 1) {
                    folder.documents.push(document);
                }
                currentFolder = folder;
            });
        });

        return root.children;
    };

    const renderTree = (folders: Folder[], parentPath = '') => (
        <ul>
            {folders.map(folder => (
                <li key={folder.name} draggable onDragStart={(e) => handleDragStart(e, folder)} onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, parentPath, folder)}>
                    <h3>{folder.name}</h3>
                    {folder.children && renderTree(folder.children, `${parentPath}/${folder.name}`)}
                    {folder.documents.length > 0 && (
                        <ul>
                            {folder.documents.map(doc => (
                                <li key={doc.id} draggable onDragStart={(e) => handleDragStart(e, doc)}>
                                    <h2>{doc.title}</h2>
                                    <p>{doc.description}</p>
                                    <p>Author: {doc.authorFirstName} {doc.authorLastName}</p>
                                    <p>Created on: {new Date(doc.creationDate).toLocaleDateString()}</p>
                                    <div>
                                        <button onClick={() => handlePreview(doc.fileUrl, doc.type)}>Prévisualiser</button>
                                    </div>
                                    <button onClick={() => handleDownload(doc.fileUrl)}>Download</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );

    const handleDragStart = (e: React.DragEvent, item: Folder | Document) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        console.log('Drag started:', item);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, parentPath: string, targetFolder: Folder) => {
        e.preventDefault();
        if (!draggedItem) return;

        let newPath = `${parentPath}/${targetFolder.name}`;

        if ('title' in draggedItem) {
            // Handle document drop
            const document = draggedItem;
            newPath += `/${document.title}`;

            // Update path in database
            try {
                await fetch(`http://localhost:3000/documents/${document.id}/path`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-id': userId!,
                    },
                    body: JSON.stringify({ path: newPath, personId: userId }),
                });

                // Update path in local state
                setDocuments(docs => docs.map(doc => doc.id === document.id ? { ...doc, path: newPath } : doc));
                const tree = buildTree(documents.map(doc => doc.id === document.id ? { ...doc, path: newPath } : doc));
                setFolders(tree);
                setFilteredFolders(tree);
            } catch (error: any) {
                setError(error.message);
            }
        } else {
            // Handle folder drop
            const folder = draggedItem;
            const updatedFolders = moveFolder(folders, folder.path, newPath);
            setFolders(updatedFolders);
            setFilteredFolders(updatedFolders);

            // Update paths in database
            updateFolderPathsInDatabase(folder, newPath);
        }

        setDraggedItem(null);
    };

    const moveFolder = (folders: Folder[], oldPath: string, newPath: string): Folder[] => {
        const findAndMoveFolder = (nodes: Folder[]): Folder[] => {
            return nodes.map(node => {
                if (node.path === oldPath) {
                    return { ...node, path: newPath, children: findAndMoveFolder(node.children), documents: node.documents };
                } else {
                    return { ...node, children: findAndMoveFolder(node.children) };
                }
            });
        };

        return findAndMoveFolder(folders);
    };

    const updateFolderPathsInDatabase = async (folder: Folder, newPath: string) => {
        const updatePathsRecursively = async (node: Folder | Document) => {
            if ('title' in node) {
                // Update document path
                try {
                    await fetch(`http://localhost:3000/documents/${node.id}/path`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'user-id': userId!,
                        },
                        body: JSON.stringify({ path: `${newPath}/${node.title}`, personId: userId }),
                    });
                } catch (error: any) {
                    setError(error.message);
                }
            } else {
                // Update folder path and children paths
                try {
                    await fetch(`http://localhost:3000/documents/folders/${encodeURIComponent(node.path)}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'user-id': userId!,
                        },
                        body: JSON.stringify({ newPath: `${newPath}/${node.name}` }),
                    });
                } catch (error: any) {
                    setError(error.message);
                }
                for (const child of node.children) {
                    await updatePathsRecursively(child);
                }
                for (const doc of node.documents) {
                    await updatePathsRecursively(doc);
                }
            }
        };

        await updatePathsRecursively(folder);
    };

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFolderName.trim() === '') return;
        setFolders([...folders, { name: newFolderName.trim(), path: `/${newFolderName.trim()}`, children: [], documents: [] }]);
        setNewFolderName('');
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filterValue = e.target.value;
        setFilterPath(filterValue);

        if (filterValue.trim() === '') {
            setFilteredFolders(folders);
        } else {
            const filtered = filterTree(folders, filterValue);
            setFilteredFolders(filtered);
        }
    };

    const filterTree = (folders: Folder[], filterPath: string): Folder[] => {
        const filterPathParts = filterPath.split('/').filter(Boolean);

        const filterRecursive = (nodes: Folder[], currentPathParts: string[]): Folder[] => {
            return nodes
                .filter(node => currentPathParts.length === 0 || node.name === currentPathParts[0])
                .map(node => {
                    const remainingPathParts = currentPathParts.slice(1);
                    if (remainingPathParts.length === 0) {
                        return node;
                    } else {
                        return {
                            ...node,
                            children: filterRecursive(node.children, remainingPathParts),
                        };
                    }
                })
                .filter(node => node.children.length > 0 || node.documents.length > 0);
        };

        return filterRecursive(folders, filterPathParts);
    };

    return (
        <div>
            <h1>User Documents</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleCreateFolder}>
                <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                />
                <button type="submit">Create Folder</button>
            </form>
            <div>
                <input
                    type="text"
                    value={filterPath}
                    onChange={handleFilterChange}
                    placeholder="Filter by path"
                />
            </div>
            {filteredFolders && renderTree(filteredFolders)}
            <PreviewModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                fileUrl={selectedFileUrl}
                fileType={selectedFileType}
            />
        </div>
    );
};

export default UserDocumentsPage;