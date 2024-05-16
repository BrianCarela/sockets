import React from 'react'; // Importing React
import Chat from './Chat'; // Importing the Chat component
import './App.css'; // Importing the CSS file for styling

const App = () => {
    return (
        <div className="App">
            <Chat /> {/* Rendering the Chat component */}
        </div>
    );
};

export default App; // Exporting the App component as default
