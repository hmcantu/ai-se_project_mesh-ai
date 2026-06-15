import { useState } from "react";
import "./KnowledgeBase.css";
import uploadIcon from "../../assets/upload.png";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<string[]>([
    "code_of_conduct.pdf",
    "Privacy_Policy.pdf",
    "anontherdocument.pdf"
  ]);

  const handleRemoveDocument = (docName: string) => {
    setDocuments((prev) => prev.filter((d) => d !== docName));
  };

  return (
    <div className="knowledge-base">
      <div className="knowledge-base__main-content">
        <div className="knowledge-base__header-block">
          <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
          <p className="knowledge-base__subtitle">Upload documents (PDF)</p>
        </div>

        <div className="knowledge-base__upload-container">
          <img src={uploadIcon} alt="" className="knowledge-base__upload-icon" />
          <button type="button" className="knowledge-base__upload-btn">Upload</button>
        </div>

        {documents.length > 0 && (
          <ul className="knowledge-base__document-list">
            {documents.map((doc, idx) => (
              <li key={idx} className="knowledge-base__document-item">
                <span className="knowledge-base__document-name">{doc}</span>
                <button
                  type="button"
                  className="knowledge-base__document-remove"
                  aria-label={`Remove ${doc}`}
                  onClick={() => handleRemoveDocument(doc)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="button" className="knowledge-base__save-button">
          Save
        </button>
      </div>
    </div>
  );
}