import "./App.css";
import ImageUpload from "./ImageUpload.jsx";
import FileUpload from "./Components/FileUpload.jsx"


function App() {
  // const [response, setResponse] = useState(null)
  return (
    <div className="App">
      <header className="App-header">
        <FileUpload />
        <ImageUpload />
      </header>
    </div>
  );
}

export default App;
