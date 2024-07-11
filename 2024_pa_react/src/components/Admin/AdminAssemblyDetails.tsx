// @ts-ignore
import React from "react";


interface AdminAssemblyDetailsProps {
    assembly: {
        id: string;
        name: string;
        meetingDate: string;
        status: string;
        outcome: string;
        creationDate: string;
        endingDate: string;
    };
}

const AdminAssemblyDetails: React.FC<AdminAssemblyDetailsProps> = ({ assembly }) => {
    return (
        <div>
            <h2>Assembly Details</h2>
            <p><strong>Name:</strong> {assembly.name}</p>
            <p><strong>Meeting Date:</strong> {new Date(assembly.meetingDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {assembly.status}</p>
            <p><strong>Outcome:</strong> {assembly.outcome}</p>
            <p><strong>Creation Date:</strong> {new Date(assembly.creationDate).toLocaleDateString()}</p>
            <p><strong>Ending Date:</strong> {new Date(assembly.endingDate).toLocaleDateString()}</p>
        </div>
    );
};

export default AdminAssemblyDetails;
