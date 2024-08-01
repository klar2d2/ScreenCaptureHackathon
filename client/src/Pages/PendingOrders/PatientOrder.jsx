import React from "react";
import productImage from "./product.png";

const PatientOrder = ({ patientData }) => {
  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    width: "517px",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  };

  const nameStyle = {
    fontFamily: '"Sofia Pro", sans-serif', // Make sure Sofia Pro is available
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 800,
    lineHeight: "normal",
    letterSpacing: "0.25px",
    color: "black",
    paddingLeft: "22px",
  };

  const sectionStyle = {
    marginBottom: "15px",
  };

  const titleStyle = {
    fontSize: "16px",
    color: "black",
    margin: "16px 0 8px 0",
    textAlign: "left",
    fontWeight: "bold",
  };

  const productStyle = {
    display: "flex",
    alignItems: "center",
  };

  const productImageStyle = {
    display: "flex",
    width: "auto",
    height: "70px",
    paddingRight: "18px",
    alignItems: "center",
  };

  const productInfoStyle = {
    marginBottom: "28px",
    textAlign: "left",
  };

  const productNameStyle = {
    fontSize: "18px",
    color: "black",
    fontWeight: "bold",
  };

  const shippingDurationStyle = {
    fontSize: "16px",
    color: "black",
  };

  const prescriptionStyle = {
    display: "flex",
    backgroundColor: "#F5F5F5",
    padding: "10px",
    borderRadius: "5px",
    width: "194px",
  };

  const prescriptionItemStyle = {
    marginRight: "16px",
    color: "black",
  };

  const propertiesLabelStyle = {
    fontSize: "16px",
    color: "black",
    margin: "4px 8px 4px 0",
    textAlign: "left",
  };

  const propertiesStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "left",
  };

  const addressStyle = {
    fontSize: "16px",
    color: "#333",
    lineHeight: "1.4",
    textAlign: "left",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="17"
            height="17"
            rx="3.5"
            fill="white"
            stroke="#4FBD9B"
          />
          <path
            d="M4.5 9.09977L7.44029 12.375L13.5 5.625"
            stroke="#4FBD9B"
            strokeWidth="2"
          />
        </svg>{" "}
        <span style={nameStyle}>{patientData.name}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "1200px",
        }}
      >
        <div style={{ width: "48%" }}>
          <div style={sectionStyle}>
            <div style={titleStyle}>Right Eye (OD)</div>
            <div style={productStyle}>
              <img src={productImage} alt="Product" style={productImageStyle} />
              <div style={productInfoStyle}>
                <div style={productNameStyle}>{patientData?.supplierRight}</div>
                <div style={shippingDurationStyle}>
                  {patientData?.manufacturerRight}
                </div>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={prescriptionStyle}>
              <div style={prescriptionItemStyle}>
                <div style={propertiesLabelStyle}>BC</div>
                <div style={propertiesStyle}>{patientData?.baseCurveRight}</div>
              </div>
              <div style={prescriptionItemStyle}>
                <div style={propertiesLabelStyle}>DIA</div>
                <div style={propertiesStyle}> {patientData?.diameterRight}</div>
              </div>
              <div style={prescriptionItemStyle}>
                <div style={propertiesLabelStyle}>SPH</div>
                <div style={propertiesStyle}>{patientData?.sphereRight}</div>
              </div>
              <div style={prescriptionItemStyle}>
                <div style={propertiesLabelStyle}>CYL</div>
                <div style={propertiesStyle}>
                  {patientData?.prescription?.CYL
                    ? patientData?.prescription?.CYL
                    : "--"}
                </div>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={titleStyle}>Address</div>
            <div style={addressStyle}>{patientData?.address}</div>
          </div>
        </div>

        <div style={{ width: "48%" }}>
          <div style={sectionStyle}>
            <div style={titleStyle}>Left Eye (OS)</div>
            <div style={productStyle}>
              <img src={productImage} alt="Product" style={productImageStyle} />
              <div style={productInfoStyle}>
                <div style={productNameStyle}>{patientData?.supplierLeft}</div>
                <div style={shippingDurationStyle}>
                  {patientData?.manufacturerLeft}
                </div>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={prescriptionStyle}>
              <div style={prescriptionItemStyle}>
                <div style={propertiesLabelStyle}>BC</div>
                <div style={propertiesStyle}>{patientData?.baseCurveLeft}</div>
              </div>
              <div style={prescriptionItemStyle}>
                <div style={propertiesLabelStyle}>DIA</div>
                <div style={propertiesStyle}> {patientData?.diameterLeft}</div>
              </div>
              <div style={prescriptionItemStyle}>
                <div style={propertiesLabelStyle}>SPH</div>
                <div style={propertiesStyle}>{patientData?.sphereLeft}</div>
              </div>
              <div style={prescriptionItemStyle}>
                <div style={propertiesLabelStyle}>CYL</div>
                <div style={propertiesStyle}>
                  {patientData?.prescription?.CYL
                    ? patientData?.prescription?.CYL
                    : "--"}
                </div>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={titleStyle}>Address</div>
            <div style={addressStyle}>{patientData?.address}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOrder;
