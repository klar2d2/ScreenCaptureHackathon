import React, { useState, useEffect } from "react";

const FormDisplay = ({ data, onDataChange }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!formData) return null;

  const topFields = [
    { label: "Name", key: "name" },
    { label: "Address", key: "address" },
  ];

  const sideBySideFields = [
    {
      label: "Underlying Condition",
      keyRight: "underlyingConditionRight",
      keyLeft: "underlyingConditionLeft",
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
    fontSize: "20px",
  };

  const subHeaderCellStyle = {
    ...cellStyle,
    fontWeight: "bold",
    fontSize: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "5px",
    border: "none",
    background: "transparent",
    fontSize: "20px",
  };

  const handleInputChange = (key, value) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);
    onDataChange(newFormData);
  };

  const renderEditableCell = (key) => (
    <input
      type="text"
      value={formData[key] || ""}
      onChange={(e) => handleInputChange(key, e.target.value)}
      style={inputStyle}
    />
  );

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "20px auto" }}>
      <h2 style={{ color: "White" }}>Form Data</h2>
      <table style={tableStyle}>
        <tbody>
          {topFields.map((field, index) => (
            <tr key={index}>
              <td style={headerCellStyle}>{field.label}</td>
              <td colSpan="2" style={cellStyle}>
                {renderEditableCell(field.key)}
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
              <td style={cellStyle}>{renderEditableCell(field.keyRight)}</td>
              <td style={cellStyle}>{renderEditableCell(field.keyLeft)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormDisplay;
