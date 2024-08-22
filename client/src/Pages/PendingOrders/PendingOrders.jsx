import React from "react";
import PatientOrder from "./PatientOrder";
import backgroundImage from "./images/dummyBackground.png";
import ordersImage from "./images/orders.png";

const PendingOrders = (props) => {
  const { patientData } = props;
  console.log(patientData);

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "1440px",
    height: "auto",
  };

  const ordersImageStyle = {
    ...imageStyle,
    width: "1193px",
    position: "absolute",
    zIndex: 1,
  };

  const whiteOverlayStyle = {
    position: "absolute",
    width: "972px",
    height: "579px",
    top: "543px",
    left: "638px",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FAFAFA",
    zIndex: 2,
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  const searchBarStyle = {
    flexGrow: 1,
    margin: "0 20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const buttonStyle = {
    backgroundColor: "#FFD700",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const contentStyle = {
    backgroundColor: "white",
    height: "calc(100% - 60px)",
    borderRadius: "5px",
  };

  return (
    <div style={containerStyle}>
      <img src={backgroundImage} alt="Background" style={imageStyle} />
      {/* <img src={ordersImage} alt="Orders" style={ordersImageStyle} /> */}
      <div style={whiteOverlayStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Pending orders (6)</h1>
          <div style={searchBarStyle}>
            <input type="text" placeholder="SEARCH" style={inputStyle} />
          </div>
          <button style={buttonStyle}>CREATE ORDERS</button>
        </div>
        <div style={contentStyle}>
          {/* This area would typically contain a list of pending orders */}
          <PatientOrder patientData={patientData} />
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
