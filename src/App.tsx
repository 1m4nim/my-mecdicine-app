import React from "react";
import ReminderFormWithPrompt from "./components/ReminderFormWithPrompt";

const Home = () => {
  return (
    <div
      style={{
        height: "100vh",          
        width: "100vw",           
        backgroundColor: "#f0f4f8",
        display: "flex",
        justifyContent: "center",  
        alignItems: "center",      
        padding: "1rem",           
        boxSizing: "border-box",
      }}
    >
      <ReminderFormWithPrompt />
    </div>
  );
};

export default Home;
