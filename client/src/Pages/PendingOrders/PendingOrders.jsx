import React from "react";
import PatientOrder from "./PatientOrder";
import backgroundImage from "./background.png";
import ordersImage from "./orders.png";

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
  };

  const realComponentStyle = {
    zIndex: 3,
    width: "1015px",
    height: "570px",
  };

  // {
  //   "name": "Moira Rose",
  //   "address": "13774 Northwest Freeway Sometown, CA 95630",
  //   "underlyingConditionRight": "--",
  //   "underlyingConditionLeft": "--",
  //   "supplierRight": "Eyefinity - ABB",
  //   "supplierLeft": "Eyefinity - ABB",
  //   "manufacturerRight": "Alcon Laboratories Inc",
  //   "manufacturerLeft": "Alcon Laboratories Inc",
  //   "styleRight": "Precision1 90 Pack",
  //   "styleLeft": "Precision1 90 Pack",
  //   "sphereRight": "-5.50",
  //   "sphereLeft": "-5.50",
  //   "cylinderRight": "--",
  //   "cylinderLeft": "--",
  //   "axisRight": "--",
  //   "axisLeft": "--",
  //   "addRight": "--",
  //   "addLeft": "--",
  //   "baseCurveRight": "8.3",
  //   "baseCurveLeft": "8.3",
  //   "diameterRight": "14.2",
  //   "diameterLeft": "14.2",
  //   "colorRight": "Clear",
  //   "colorLeft": "Clear",
  //   "quantityRight": "4",
  //   "quantityLeft": "4"
  // }

  // const patientData = {
  //   name: "Zain Workman",
  //   productImage: "./product-image.png", // You'll need to add this image
  //   productName: "DAILIES® AquaComfort Plus® Multifocal",
  //   shippingDuration: "12 months shipped",
  //   prescription: {
  //     BC: "8.6",
  //     DIA: "14.2",
  //     PWR: "-20.00",
  //     CYL: "+1.25",
  //   },
  //   address: {
  //     street: "4993 Street St.",
  //     cityStateZip: "Fort Worth, TX 76063",
  //   },
  // };

  return (
    <div style={containerStyle}>
      <img src={backgroundImage} alt="Background" style={imageStyle} />
      <img src={ordersImage} alt="Orders" style={ordersImageStyle} />
      <div style={whiteOverlayStyle}>
        <div style={realComponentStyle}>
          <PatientOrder patientData={patientData} />
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
