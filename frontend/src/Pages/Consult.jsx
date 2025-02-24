import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";

const Consult = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  const handleConsultClick = (doctor) => {
    localStorage.setItem("doctorDetails", JSON.stringify(doctor));
    navigate(`/payment/${doctor.doctorPrice}/${doctor.email}`);
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page doctors1">
      <div className="banner1">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="card1" key={doctor._id}>
              <img src={doctor.docAvatar?.url} alt="doctor avatar" />
              <h4>{`${doctor.firstName} ${doctor.lastName}`}</h4>
              <div className="details1">
                <p>Email: <span>{doctor.email}</span></p>
                <p>Department: <span>{doctor.doctorDepartment}</span></p>
                <p>Gender: <span>{doctor.gender}</span></p>
                <p>Doctor Price: <span>{doctor.doctorPrice}</span></p>
                <button onClick={() => handleConsultClick(doctor)}>
                  Video Consult
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Consult;