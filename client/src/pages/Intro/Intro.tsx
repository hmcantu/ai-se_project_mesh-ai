import { useNavigate } from "react-router-dom";
import "./Intro.css";

export default function Intro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/knowledge");
  };

  return (
    <div className="intro">
      <h1 className="intro__title">Welcome to MeshAI</h1>
      <p className="intro__subtitle">Your intelligent knowledge assistant.</p>
      
      {/* This is a temporary placeholder for the feature cards we will style with Figma specs next */}
      <div className="intro__cards-placeholder" style={{ margin: "24px 0", color: "#71717A" }}>
        Feature cards will go here
      </div>

      <button className="intro__start-btn" onClick={handleStart}>
        Start
      </button>
    </div>
  );
}