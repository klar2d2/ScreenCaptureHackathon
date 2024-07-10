import React, { useState } from 'react';
import './App.css';
import ImageUpload from './ImageUpload.jsx';
import Form from './Form.jsx';

function App() {
  const [response, setResponse] = useState(null)
  return (
    <div className="App">
      <header className="App-header">
        <ImageUpload setResponse={setResponse}/>
        <Form response={response} />
      </header>
    </div>
  );
}

export default App;
