import { useState, useEffect } from 'react';
// @ts-ignore
import Cookies from 'js-cookie';

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
    const [error, setError] = useState<string | null>(null);
    const [newFolderName, setNewFolderName] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<Folder | Document | null>(null);
    const [targetFolder, setTargetFolder] = useState<Folder | null>(null);
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
                <li key={folder.path} onClick={(e) => { e.stopPropagation(); handleFolderClick(folder); }}>
                    <h3>{folder.name}</h3>
                    {folder.children && renderTree(folder.children, `${parentPath}/${folder.name}`)}
                    {folder.documents.length > 0 && (
                        <ul>
                            {folder.documents.map(doc => (
                                <li key={doc.id} onClick={(e) => { e.stopPropagation(); handleDocumentClick(doc); }}>
                                    <h2>{doc.title}</h2>
                                    <p>{doc.description}</p>
                                    <p>Author: {doc.authorFirstName} {doc.authorLastName}</p>
                                    <p>Created on: {new Date(doc.creationDate).toLocaleDateString()}</p>
                                    <button onClick={() => handleDownload(doc.fileUrl)}>Download</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );

    const handleFolderClick = (folder: Folder) => {
        if (selectedItem && !targetFolder) {
            setTargetFolder(folder);
        } else {
            setSelectedItem(folder);
        }
    };

    const handleDocumentClick = (document: Document) => {
        if (selectedItem) {
            setTargetFolder(null);
        } else {
            setSelectedItem(document);
        }
    };

    const handleConfirmMove = async () => {
        if (selectedItem && targetFolder) {
            let newPath;
            if ('title' in selectedItem) {
                // Si selectedItem est un Document
                newPath = `${targetFolder.path}`;
                const updatedDocuments = documents.map(doc =>
                    doc.id === selectedItem.id ? { ...doc, path: newPath } : doc
                );
                setDocuments(updatedDocuments);
                console.log("id :"+selectedItem.id);
                await updateDocumentPathInDatabase(selectedItem, newPath);
            } else {
                // Si selectedItem est un Folder
                console.log("path: " + targetFolder.path + "/" + selectedItem.name);
                newPath = `${targetFolder.path}/${selectedItem.name}`;
                const updatedFolders = moveFolder(folders, selectedItem.path, newPath);
                setFolders(updatedFolders);
                await updateFolderPathsInDatabase(selectedItem, newPath, selectedItem.path);
            }
            setSelectedItem(null);
            setTargetFolder(null);
        }
    };

    const moveFolder = (folders: Folder[], oldPath: string, newPath: string): Folder[] => {
        const findAndMoveFolder = (nodes: Folder[]): Folder[] => {
            return nodes.map(node => {
                if (node.path.startsWith(oldPath)) {
                    const updatedPath = node.path.replace(oldPath, newPath);
                    return {
                        ...node,
                        path: updatedPath,
                        children: findAndMoveFolder(node.children),
                        documents: node.documents.map(doc => ({
                            ...doc,
                            path: doc.path.replace(oldPath, updatedPath)
                        }))
                    };
                } else if (node.children.length > 0) {
                    return { ...node, children: findAndMoveFolder(node.children) };
                } else {
                    return node;
                }
            });
        };

        return findAndMoveFolder(folders);
    };

    const updateDocumentPathInDatabase = async (document: Document, newPath: string) => {
        console.log("title :"+document.title);
        console.log("id :"+document.id);
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
        } catch (error: any) {
            setError(error.message);
        }
    };

    const updateFolderPathsInDatabase = async (folder: Folder, newPath: string, oldPath: string) => {
        const updatePathsRecursively = async (node: Folder | Document, currentPath: string, newBasePath: string) => {
            if ('title' in node) {
                // Update document path
                const newDocPath = node.path.replace(currentPath, newBasePath);
                try {
                    await fetch(`http://localhost:3000/documents/${node.id}/path`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'user-id': userId!,
                        },
                        body: JSON.stringify({ path: newDocPath, personId: userId }),
                    });
                } catch (error: any) {
                    setError(error.message);
                }
            } else {
                // Update folder path and children paths
                const updatedPath = node.path.replace(currentPath, newBasePath);
                try {
                    await fetch(`http://localhost:3000/documents/folders/${encodeURIComponent(node.path)}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'user-id': userId!,
                        },
                        body: JSON.stringify({ newPath: updatedPath }),
                    });
                } catch (error: any) {
                    setError(error.message);
                }
                for (const child of node.children) {
                    await updatePathsRecursively(child, node.path, updatedPath);
                }
                for (const doc of node.documents) {
                    await updatePathsRecursively(doc, node.path, updatedPath);
                }
            }
        };

        await updatePathsRecursively(folder, oldPath, newPath);
    };

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFolderName.trim() === '') return;
        setFolders([...folders, { name: newFolderName.trim(), path: `/${newFolderName.trim()}`, children: [], documents: [] }]);
        setNewFolderName('');
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
            {selectedItem && targetFolder && (
                <div>
                    <p>Move <strong>{'title' in selectedItem ? selectedItem.title : selectedItem.name}</strong> to <strong>{targetFolder.name}</strong>?</p>
                    <button onClick={handleConfirmMove}>Confirm Move</button>
                    <button onClick={() => { setSelectedItem(null); setTargetFolder(null); }}>Cancel</button>
                </div>
            )}
            {folders && renderTree(folders)}
        </div>
    );
};

export default UserDocumentsPage;
