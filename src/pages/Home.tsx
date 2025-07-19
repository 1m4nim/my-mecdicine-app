import React from "react";
import ReminderFormWithPrompt from "../components/ReminderFormWithPrompt";
import "./Home.css"; // スタイルを分離

const Home = () => {
  return (
    <div className="home-container">
      <div className="form-wrapper">
        <ReminderFormWithPrompt />
      </div>
    </div>
  );
};

export default Home;
