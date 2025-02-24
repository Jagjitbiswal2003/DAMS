import React, { useState } from "react";
import axios from "axios";

const Prescription = () => {
  const [formData, setFormData] = useState({
    doctorName: "",
    doctorEmail: "",
    patientName: "",
    patientEmail: "",
    meetingMode: "online",
    disease: "",
    cause: "",
    medicine: "",
    meetingDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/v1/prescription/prescription-success", formData);
      alert("Prescription saved and email sent successfully!");
    } catch (error) {
      console.error("Error submitting prescription:", error);
      alert("Error submitting prescription");
    }
  };

  return (
    <div className="prescription-container">
      <h2>Prescription Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Doctor Name:</label>
        <input type="text" name="doctorName" onChange={handleChange} required />

        <label>Doctor Email:</label>
        <input type="email" name="doctorEmail" onChange={handleChange} required />


        <label>Patient Name:</label>
        <input type="text" name="patientName" onChange={handleChange} required />

        <label>Patient Email:</label>
        <input type="email" name="patientEmail" onChange={handleChange} required />

        <label>Meeting Mode:</label>
        <select name="meetingMode" onChange={handleChange} required>
          <option value="online">Online</option>
        </select>

        <label>Disease:</label>
        <input type="text" name="disease" onChange={handleChange} required />

        <label>Cause of Disease:</label>
        <textarea name="cause" rows="4" cols="50" onChange={handleChange} required></textarea>

        <label>Medicine:</label>
        <textarea name="medicine" rows="4" cols="50" onChange={handleChange} required></textarea>


        <label>Meeting Date:</label>
        <input type="date" name="meetingDate" onChange={handleChange} required />

        <button type="submit">Submit Prescription</button>
      </form>
    </div>
  );
};

export default Prescription;
