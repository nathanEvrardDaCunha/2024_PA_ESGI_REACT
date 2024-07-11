import { useEffect, useState } from 'react';
// @ts-ignore
import Cookies from 'js-cookie';

interface Survey {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

interface Question {
    id: string;
    label: string;
    type: string;
    options: string[];
}

interface SurveyResponseFormProps {
    assemblyId: string;
}

const SurveyResponseForm: React.FC<SurveyResponseFormProps> = ({ assemblyId }) => {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [responses, setResponses] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await fetch(`http://localhost:3000/assemblies/${assemblyId}/survey`);
                if (!response.ok) {
                    throw new Error('Failed to fetch survey');
                }
                const data = await response.json();
                if (data.length > 0) {
                    setSurvey(data[0]);  // Assuming only one survey per assembly
                }
            } catch (error) {
                console.error('Failed to fetch survey:', error);
            }
        };

        fetchSurvey();
    }, [assemblyId]);

    const handleResponseChange = (questionId: string, response: string) => {
        setResponses({ ...responses, [questionId]: response });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const personId = Cookies.get('userId');
        if (!personId) {
            alert('User ID not found in cookies');
            return;
        }

        const surveyResponse = {
            surveyId: survey?.id,
            respondentId: personId,
            answers: Object.entries(responses).map(([questionId, answer]) => ({
                questionId,
                answer,
            })),
        };

        try {
            const response = await fetch('http://localhost:3000/surveys/response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(surveyResponse),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            alert('Survey response submitted successfully!');
        } catch (error: any) {
            alert(`Failed to submit survey response: ${error.message}`);
        }
    };

    if (!survey) {
        return <p>Loading survey...</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>{survey.title}</h3>
            <p>{survey.description}</p>
            {survey.questions.map((question) => (
                <div key={question.id}>
                    <label>{question.label}</label>
                    {question.type === 'TEXT' && (
                        <input
                            type="text"
                            value={responses[question.id] || ''}
                            onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        />
                    )}
                    {question.type === 'MULTIPLE_CHOICE' && (
                        question.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                />
                                <label>{option}</label>
                            </div>
                        ))
                    )}
                    {question.type === 'CHECKBOX' && (
                        question.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="checkbox"
                                    name={question.id}
                                    value={option}
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                />
                                <label>{option}</label>
                            </div>
                        ))
                    )}
                </div>
            ))}
            <button type="submit">Submit Survey</button>
        </form>
    );
};

export default SurveyResponseForm;