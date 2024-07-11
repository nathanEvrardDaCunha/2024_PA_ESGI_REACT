import { useState, ChangeEvent, FormEvent } from 'react';
// @ts-ignore
import TopicForm from './TopicForm.tsx';
// @ts-ignore
import { GeneralAssembly, Topic } from './Types.tsx';

const GeneralAssemblyForm: React.FC = () => {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [generalAssembly, setGeneralAssembly] = useState<GeneralAssembly>({
        meetingDate: new Date(),
        status: '',
        outcome: '',
        creationDate: new Date(),
        endingDate: new Date(),
        topics: [],
        surveys: []
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGeneralAssembly({ ...generalAssembly, [e.target.name]: e.target.value });
    };

    const addTopic = () => {
        const newTopics = [...generalAssembly.topics, { label: '', description: '', status: '', isAnonyme: false, modality: '', quorum: 0, totalRounds: 1, choices: [] }];
        setGeneralAssembly({ ...generalAssembly, topics: newTopics });
    };

    const addSurvey = () => {
        const newSurveys = [...generalAssembly.surveys, { title: '', description: '', questions: [] }];
        setGeneralAssembly({ ...generalAssembly, surveys: newSurveys });
    };

    const handleTopicChange = (index: number, topic: Topic) => {
        const newTopics = [...generalAssembly.topics];
        newTopics[index] = topic;
        setGeneralAssembly({ ...generalAssembly, topics: newTopics });
    };

    const handleSurveyChange = (index: number, survey: any) => {
        const newSurveys = [...generalAssembly.surveys];
        newSurveys[index] = survey;
        setGeneralAssembly({ ...generalAssembly, surveys: newSurveys });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/assemblies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(generalAssembly),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(`Failed to create Assembly: ${errorData.error}`);
                console.error("Failed to create Assembly:", errorData);
            } else {
                setSuccess("Assembly created successfully");
            }
        } catch (error) {
            setError("Error during registration");
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create General Assembly</h2>
            <label>
                Meeting Date:
                <input type="date" name="meetingDate" value={generalAssembly.meetingDate.toISOString().substr(0, 10)} onChange={handleInputChange} />
            </label>
            <label>
                Status:
                <input type="text" name="status" value={generalAssembly.status} onChange={handleInputChange} />
            </label>
            <label>
                Outcome:
                <textarea name="outcome" value={generalAssembly.outcome} onChange={handleInputChange} />
            </label>
            {generalAssembly.topics.map((topic, index) => (
                <TopicForm key={index} topic={topic} onChange={(updatedTopic) => handleTopicChange(index, updatedTopic)} />
            ))}
            <button type="button" onClick={addTopic}>Add Topic</button>

            {generalAssembly.surveys.map((survey, index) => (
                <div key={index}>
                    <h3>Survey {index + 1}</h3>
                    <label>
                        Title:
                        <input type="text" value={survey.title} onChange={(e) => handleSurveyChange(index, { ...survey, title: e.target.value })} />
                    </label>
                    <label>
                        Description:
                        <textarea value={survey.description} onChange={(e) => handleSurveyChange(index, { ...survey, description: e.target.value })} />
                    </label>
                    {survey.questions.map((question: any, qIndex: number) => (
                        <div key={qIndex}>
                            <label>Question {qIndex + 1}</label>
                            <input
                                type="text"
                                value={question.label}
                                onChange={(e) => {
                                    const newQuestions = [...survey.questions];
                                    newQuestions[qIndex] = { ...question, label: e.target.value };
                                    handleSurveyChange(index, { ...survey, questions: newQuestions });
                                }}
                            />
                            <select
                                value={question.type}
                                onChange={(e) => {
                                    const newQuestions = [...survey.questions];
                                    newQuestions[qIndex] = { ...question, type: e.target.value };
                                    handleSurveyChange(index, { ...survey, questions: newQuestions });
                                }}
                            >
                                <option value="TEXT">Text</option>
                                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                <option value="CHECKBOX">Checkbox</option>
                            </select>
                            {question.type !== 'TEXT' && (
                                <div>
                                    {question.options.map((option: string, oIndex: number) => (
                                        <input
                                            key={oIndex}
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...question.options];
                                                newOptions[oIndex] = e.target.value;
                                                const newQuestions = [...survey.questions];
                                                newQuestions[qIndex] = { ...question, options: newOptions };
                                                handleSurveyChange(index, { ...survey, questions: newQuestions });
                                            }}
                                        />
                                    ))}
                                    <button type="button" onClick={() => {
                                        const newQuestions = [...survey.questions];
                                        newQuestions[qIndex] = { ...question, options: [...question.options, ''] };
                                        handleSurveyChange(index, { ...survey, questions: newQuestions });
                                    }}>Add Option</button>
                                </div>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => {
                        const newQuestions = [...survey.questions, { label: '', type: 'TEXT', options: [] }];
                        handleSurveyChange(index, { ...survey, questions: newQuestions });
                    }}>Add Question</button>
                </div>
            ))}
            <button type="button" onClick={addSurvey}>Add Survey</button>
            <button type="submit">Submit</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
        </form>
    );
};

export default GeneralAssemblyForm;