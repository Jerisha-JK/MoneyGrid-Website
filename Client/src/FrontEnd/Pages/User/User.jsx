import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.css";
import Cookies from "js-cookie";

const UserProfile = () => {
  const [profilePic, setProfilePic] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");

  const [userId, setUserid] = useState("");

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      setUserid(userId);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      // Make sure the token is stored as 'token' in cookies

      try {
        const response = await fetch(`http://localhost:3000/api/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // useEffect(() => {
  //   if (userData) {
  //     setEmail(userData.email || '');
  //     setName(userData.UserName || '');
  //     setProfilePic(userData.profilePic || '');
  //   }
  // }, [userData]);

  useEffect(() => {
    const nameFromCookie = Cookies.get("userName");
    const emailFromCookie = Cookies.get("userEmail");
    const profilePicFromCookie = Cookies.get("profilePic");

    setName(nameFromCookie || "");
    setEmail(emailFromCookie || "");
    setProfilePic(profilePicFromCookie || "");
  }, []);

  // Handle local image upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result); // base64 string
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    Cookies.set("userName", name);
    Cookies.set("userEmail", email);
    Cookies.set("profilePic", profilePic);
    alert("Profile updated!");
  };

  return (
    <div className="user-profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={
                profilePic && profilePic.trim() !== ""
                  ? profilePic
                  : "/profil.jpeg"
              }
              alt="User"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/profil.jpeg";
              }}
            />
          </div>
          <div className="profile-info">
            <h2>{name}</h2>
            <p>{email}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="profile-card edit-profile">
        <h3 className="section-title">Edit Profile</h3>

        <div className="form-group">
          <label htmlFor="name">User Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
      
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Upload Profile Picture</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="input-field"
          />
        </div>

        <button className="btn-save" onClick={handleUpdate}>
          Update
        </button>
      </div>

      {/* Notification Settings */}
      <div className="profile-card notification-settings">
        <h3 className="section-title">Preferences</h3>
        <div className="settings-toggle">
          <label htmlFor="notifications" className="toggle-label">
            Email Notifications
          </label>
          <input
            id="notifications"
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="toggle-input"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
