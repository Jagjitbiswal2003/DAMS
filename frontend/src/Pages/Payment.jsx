import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const { price, doctorEmail } = useParams(); // Extract price and doctorEmail from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    amount: price || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.amount !== price) {
      alert("Please enter the correct amount.");
      return;
    }

    try {
      // Send the payment and user details to the backend
      await axios.post("http://localhost:4000/api/v1/payment/payment-success", {
        name: formData.name,
        email: formData.email,
        doctorEmail: doctorEmail, 
      });

      alert("Payment Successful!");
    } catch (error) {
      alert("Payment successful but failed to send email.");
    }
  };

  return (
    <div className="payment-container1">
      <h2>Secure Payment</h2>
      <form onSubmit={handleSubmit} className="payment-form1">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label>Amount (₹):</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
