import React from 'react';
import './App.css';
import ImageUpload from './ImageUpload.jsx';
import Form from './Form.jsx';

function App() {
  // const [response, setResponse] = useState(null)
  return (
    <div className="App">
      <header className="App-header">
        <ImageUpload />
        <Form />
      </header>
    </div>
  );
}

export default App;
