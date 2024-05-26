// @ts-ignore
import Cookies from 'js-cookie';
const AssemblyDetails = ({ assembly }) => {
    const handleVote = async (topicId, choiceId) => {
        const personId = Cookies.get('userId');
        const response = await fetch(`http://localhost:3000/topics/${topicId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ choiceId,personId }),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Vote recorded!');
        } else {
            alert(`Failed to record vote: ${data.error}`);
        }
    };

    return (
        <div>
            <h2>{assembly.name}</h2>
            {assembly.topics.map(topic => (
                <div key={topic.id}>
                    <h3>{topic.label}</h3>
                    {topic.choices?.map(choice => (
                        <button key={choice.id} onClick={() => handleVote(topic.id, choice.id)}>
                            Vote for {choice.description}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AssemblyDetails;
