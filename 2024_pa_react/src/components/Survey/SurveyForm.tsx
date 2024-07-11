import { useState } from 'react';
import axios from 'axios';

const SurveyForm = ({ assemblyId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { label: '', type: 'TEXT', options: [] }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, [field]: value } : q
        );
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (index, optionIndex, value) => {
        const updatedQuestions = questions.map((q, i) => {
            if (i === index) {
                const options = q.options.map((opt, optIdx) =>
                    optIdx === optionIndex ? value : opt
                );
                return { ...q, options };
            }
            return q;
        });
        setQuestions(updatedQuestions);
    };

    const handleAddOption = (index) => {
        const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, options: [...q.options, ''] } : q
        );
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const survey = {
            title,
            description,
            assemblyId,
            questions,
        };

        try {
            const response = await axios.post('/api/surveys', survey);
            console.log('Survey created:', response.data);
        } catch (error) {
            console.error('Error creating survey:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <h3>Questions</h3>
                {questions.map((q, index) => (
                    <div key={index}>
                        <input
                            value={q.label}
                            onChange={(e) => handleQuestionChange(index, 'label', e.target.value)}
                            placeholder="Question label"
                        />
                        <select
                            value={q.type}
                            onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                        >
                            <option value="TEXT">Text</option>
                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                            <option value="CHECKBOX">Checkbox</option>
                        </select>
                        {q.type !== 'TEXT' && (
                            <div>
                                <h4>Options</h4>
                                {q.options.map((opt, optIndex) => (
                                    <input
                                        key={optIndex}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                        placeholder="Option"
                                    />
                                ))}
                                <button type="button" onClick={() => handleAddOption(index)}>Add Option</button>
                            </div>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddQuestion}>Add Question</button>
            </div>
            <button type="submit">Create Survey</button>
        </form>
    );
};

export default SurveyForm;
