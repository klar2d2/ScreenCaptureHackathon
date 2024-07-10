import React, { useState } from "react";

const Form = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
      });

      // useEffect(() => {
      //   setFormData({
      //       firstName: response.firstName ? response.firstName : '',
      //       lastName: response.lastName ? response.lastName : '',
      //       email: response.email ? response.email : '',
      //       address: response.address ? response.address : '',
      //       city: response.city ? response.city : '',
      //       state: response.state ? response.state : '',
      //       postalCode: response.postalCode ? response.postalCode : '',
      //   })
      // },[response])
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // You can handle form submission here
        console.log('Form submitted:', formData);
      };
    
      return (
        <div className="App">
          <h1>Form</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Postal Code:</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      );
}
export default Form