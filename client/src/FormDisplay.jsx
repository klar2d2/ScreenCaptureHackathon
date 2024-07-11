import React from "react";

const FormDisplay = ({ data }) => {
  console.log("data", data);
  if (!data) return null;

  const topFields = [
    { label: "Name", key: "name" },
    { label: "Address", key: "address" },
  ];
  const sideBySideFields = [
    {
      label: "Underlying Condition",
      keyRight: "underlyingconditionRight",
      keyLeft: "underlyingconditionLeft",
    },
    { label: "Supplier", keyRight: "supplierRight", keyLeft: "supplierLeft" },
    {
      label: "Manufacturer",
      keyRight: "manufacturerRight",
      keyLeft: "manufacturerLeft",
    },
    { label: "Style", keyRight: "styleRight", keyLeft: "styleLeft" },
    { label: "Sphere", keyRight: "sphereRight", keyLeft: "sphereLeft" },
    { label: "Cylinder", keyRight: "cylinderRight", keyLeft: "cylinderLeft" },
    { label: "Axis", keyRight: "axisRight", keyLeft: "axisLeft" },
    { label: "Add", keyRight: "addRight", keyLeft: "addLeft" },
    {
      label: "Base Curve",
      keyRight: "baseCurveRight",
      keyLeft: "baseCurveLeft",
    },
    { label: "Diameter", keyRight: "diameterRight", keyLeft: "diameterLeft" },
    { label: "Color", keyRight: "colorRight", keyLeft: "colorLeft" },
    { label: "Quantity", keyRight: "quantityRight", keyLeft: "quantityLeft" },
  ];

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    fontFamily: "Arial, sans-serif",
    border: "1px solid black",
  };

  const cellStyle = {
    padding: "10px",
    textAlign: "left",
    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
  };

  const headerCellStyle = {
    ...cellStyle,
    fontWeight: "bold",
  };

  const subHeaderCellStyle = {
    ...cellStyle,
    fontWeight: "bold",
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "20px auto" }}>
      <h2 style={{ color: "white" }}>Form Data</h2>
      <table style={tableStyle}>
        <tbody>
          {topFields.map((field, index) => (
            <tr key={index}>
              <td style={headerCellStyle}>{field.label}</td>
              <td colSpan="2" style={cellStyle}>
                {data[field.key] || "N/A"}
              </td>
            </tr>
          ))}
          <tr>
            <td style={headerCellStyle}></td>
            <td style={subHeaderCellStyle}>Right</td>
            <td style={subHeaderCellStyle}>Left</td>
          </tr>
          {sideBySideFields.map((field, index) => (
            <tr key={index}>
              <td style={headerCellStyle}>{field.label}</td>
              <td style={cellStyle}>{data[field.keyRight] || "N/A"}</td>
              <td style={cellStyle}>{data[field.keyLeft] || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormDisplay;
