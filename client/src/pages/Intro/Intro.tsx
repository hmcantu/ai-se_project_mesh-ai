import { useNavigate } from "react-router-dom";
import "./Intro.css";
import introImg1 from "../../assets/intro-1.png";
import introImg2 from "../../assets/intro-2.png";
import introImg3 from "../../assets/intro-3.png";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="intro">
      <h1 className="intro__title">Welcome to Mesh AI</h1>
      
      <div className="intro__grid">
        {/* Card 1 */}
        <div className="intro__card">
          <img src={introImg1} alt="Documents vector" className="intro__card-icon" />
          <p className="intro__card-text">
            Bring all your documents into one secure AI workspace
          </p>
        </div>

        {/* Card 2 */}
        <div className="intro__card">
          <img src={introImg2} alt="Folder management vector" className="intro__card-icon" />
          <p className="intro__card-text">
            Organize and manage the documents that power your AI
          </p>
        </div>

        {/* Card 3 */}
        <div className="intro__card">
          <img src={introImg3} alt="Chat sparkles vector" className="intro__card-icon" />
          <p className="intro__card-text">
            Your knowledge base, accessible through a simple chat interface
          </p>
        </div>
      </div>

      <p className="intro__prompt">
        Start by creating your Organization’s Knowledge Base
      </p>

      <button className="intro__start-btn" onClick={() => navigate("/knowledge")}>
        Start
      </button>
    </div>
  );
}