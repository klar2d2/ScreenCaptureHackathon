import "./App.css";
import ImageUpload from "./ImageUpload.jsx";
import PendingOrders from "./Pages/PendingOrders/PendingOrders";

function App() {
  // const [response, setResponse] = useState(null)
  return (
    <div className="App">
      <header className="App-header">
        {/* <ImageUpload /> */}
        <PendingOrders />
      </header>
    </div>
  );
}

export default App;
