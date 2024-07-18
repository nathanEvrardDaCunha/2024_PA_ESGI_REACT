// @ts-ignore
import React, { useEffect, useState } from 'react';

interface Result {
    question: string;
    responses: {
        respondent: string;
        answer: string;
    }[];
}

interface SurveyResultsProps {
    surveyId: string;
}

const SurveyResults: React.FC<SurveyResultsProps> = ({ surveyId }) => {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/surveys/results/${surveyId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await response.json();
                setResults(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [surveyId]);

    if (loading) {
        return <p>Loading results...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h3>Survey Results</h3>
            {results.map((result, index) => (
                <div key={index}>
                    <h4>{result.question}</h4>
                    <ul>
                        {result.responses.map((response, idx) => (
                            <li key={idx}>{response.respondent}: {response.answer}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default SurveyResults;
