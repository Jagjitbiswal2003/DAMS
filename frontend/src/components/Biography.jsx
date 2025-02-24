
import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            <span>Welcome to Shining Health Care:</span> At Shining Health Care, we believe that every individual deserves access to exceptional medical services and compassionate care. Our dedicated team of healthcare professionals is committed to providing personalized treatment and support, ensuring that you and your loved ones receive the highest standard of health care.With state-of-the-art facilities and a holistic approach to wellness, we are here to guide you on your journey to better health. Whether you are seeking routine check-ups, specialized treatments, or preventive care, our compassionate staff is here to illuminate your path to wellness.

Your health is our priority, and we are devoted to shining a light on your well-being every step of the way.
          </p>
        </div>
      </div>
    </>
  );
};

export default Biography;
