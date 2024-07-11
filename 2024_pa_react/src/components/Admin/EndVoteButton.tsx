// @ts-ignore
import React from 'react';

interface EndVoteButtonProps {
    topicId: string;
    onEndVote: () => void;
}

const EndVoteButton: React.FC<EndVoteButtonProps> = ({ topicId, onEndVote }) => {
    const handleEndVote = async () => {
        try {
            const response = await fetch(`http://localhost:3000/topics/${topicId}/next-round-or-end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            alert('Voting processed!');
            onEndVote();
        } catch (error: any) {
            alert(`Failed to process voting: ${error.message}`);
        }
    };

    return (
        <button onClick={handleEndVote}>
            End Voting
        </button>
    );
};

export default EndVoteButton;
