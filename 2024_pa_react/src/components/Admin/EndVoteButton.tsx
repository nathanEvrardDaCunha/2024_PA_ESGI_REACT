import * as React from "react";
import { useState } from 'react';
import { Button, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface EndVoteButtonProps {
    topicId: string;
    onEndVote: () => void;
}

const EndVoteButton: React.FC<EndVoteButtonProps> = ({ topicId, onEndVote }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleEndVote = async () => {
        setIsLoading(true);
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
            
            alert('Voting processed successfully!');
            onEndVote();
        } catch (error: any) {
            alert(`Failed to process voting: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const tooltipMessage = "Click to end the current voting round or finalize the topic if it's the last round.";
    
    return (
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${topicId}`}>{tooltipMessage}</Tooltip>}
        >
            <Button
                variant="warning"
                onClick={handleEndVote}
                disabled={isLoading}
                className="mt-3"
            >
                {isLoading ? (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                        />
                        Processing...
                    </>
                ) : (
                    'End Voting Round'
                )}
            </Button>
        </OverlayTrigger>
    );
};

export default EndVoteButton;