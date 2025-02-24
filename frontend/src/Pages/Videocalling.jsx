import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VideoCall = () => {
  const [doctor, setDoctor] = useState(null);
  const [meetingID, setMeetingID] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem("doctorDetails"));
    if (storedDoctor) {
      setDoctor(storedDoctor);
      createZoomMeeting(storedDoctor);
    } else {
      navigate("/consult");
    }
  }, [navigate]);

  const createZoomMeeting = async (doctor) => {
    try {
      const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        {
          topic: `Consultation with Dr. ${doctor.firstName}`,
          type: 1, // Instant meeting
          settings: {
            host_video: true,
            participant_video: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer qaIYl1G6R-Wq6z62CSHL9A`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Zoom API Response: ", response.data); // Log the response
      if (response.data && response.data.id) {
        setMeetingID(response.data.id);
      } else {
        console.error("Meeting ID is missing in the response");
      }
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
    } finally {
      setLoading(false); // Set loading state to false after API call
    }
  };

  if (loading) return <h2>Loading meeting details...</h2>;

  return (
    <div className="video-call-container">
      <h2>Zoom Video Call</h2>
      <p><strong>Doctor Name:</strong> {doctor.firstName} {doctor.lastName}</p>
      <p><strong>Department:</strong> {doctor.doctorDepartment}</p>
      {meetingID ? (
        <>
          <p><strong>Meeting ID:</strong> {meetingID}</p>
          <button onClick={() => window.open(`https://zoom.us/j/${meetingID}`, "_blank")}>
            Join Meeting
          </button>
        </>
      ) : (
        <p>Unable to generate a meeting ID. Please try again later.</p>
      )}
    </div>
  );
};

export default VideoCall;
