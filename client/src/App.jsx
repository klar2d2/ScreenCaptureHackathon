import React from "react";
import styled from "styled-components";
import FileUpload from "./Pages/PatientOrderUpload/index.jsx";

const StyledApp = styled.div`
  text-align: center;
  background-color: #f0f0f0;
  height: 100vh;
`;

function App() {
  return (
    <StyledApp>
      <FileUpload />
    </StyledApp>
  );
}

export default App;
