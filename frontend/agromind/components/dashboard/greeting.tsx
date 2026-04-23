import React from "react";

function Greeting() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌇";
    return "Good Night 🌙";
  };

  return <h1>{getGreeting()}</h1>;
}

export default Greeting;