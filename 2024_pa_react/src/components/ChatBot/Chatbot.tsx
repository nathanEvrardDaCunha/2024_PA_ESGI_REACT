// @ts-ignore
import React, { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
// @ts-ignore
import Cookies from 'js-cookie';
import './Chatbot.css';

interface Message {
    role: 'user' | 'bot';
    content: string;  // Adapter le type pour accepter un contenu varié
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [threadId, setThreadId] = useState<string | null>(null);
    const personId = Cookies.get('userId');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        const userMessage: Message = { role: 'user', content: input };
        setMessages([...messages, userMessage]);

        const response = await fetch(threadId ? 'http://localhost:3000/chatbot/continue' : 'http://localhost:3000/chatbot/open', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: input,
                personId,
                ...(threadId && { threadId })
            }),
        });

        const data = await response.json();
        const botMessage: Message = {
            role: 'bot',
            content: data.response
        };

        setMessages([...messages, userMessage, botMessage]);
        setInput('');

        if (!threadId) {
            setThreadId(data.threadId);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Vérifier si l'utilisateur est connecté
    if (!personId) {
        return null;  // Ne rien afficher si l'utilisateur n'est pas connecté
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                Chatbot
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role === 'user' ? 'user-message' : 'bot-message'}>
                        {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
