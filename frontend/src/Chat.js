import React, { useState, useEffect } from 'react'; // Importing React and hooks
import io from 'socket.io-client'; // Importing the Socket.IO client
import axios from 'axios'; // Importing Axios for HTTP requests

const socket = io('http://localhost:3001'); // Connecting to the Socket.IO server

const Chat = () => {
    const [messages, setMessages] = useState([]); // State to store messages
    const [input, setInput] = useState(''); // State to store input text

    useEffect(() => {
        // Fetch initial messages
        axios.get('http://localhost:3001/messages')
            .then(response => {
                setMessages(response.data); // Setting the fetched messages to state
            });

        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, { text: msg }]); // Adding new messages to state
        });

        return () => {
            socket.off('chat message'); // Cleanup the event listener on component unmount
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page
        if (input.trim()) {
            socket.emit('chat message', input); // Emitting the message to the server
            setInput(''); // Clearing the input field
        }
    };

    return (
        <div style={styles.container}>
            <ul style={styles.messages}>
                {messages.map((msg, index) => (
                    <li key={index} style={styles.message}>
                        {msg.text}
                    </li>
                ))}
            </ul>
            <form style={styles.form} onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={styles.input}
                    autoComplete="off"
                />
                <button type="submit" style={styles.button}>
                    Send
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
    },
    messages: {
        listStyleType: 'none',
        padding: 0,
        flex: 1,
        overflowY: 'scroll',
        marginBottom: '10px',
    },
    message: {
        padding: '10px',
        borderBottom: '1px solid #ccc',
    },
    form: {
        display: 'flex',
    },
    input: {
        flex: 1,
        padding: '10px',
        fontSize: '16px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
    },
};

export default Chat; // Exporting the Chat component as default
