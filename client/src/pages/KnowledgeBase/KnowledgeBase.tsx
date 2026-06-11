import { useState, useEffect } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import type { KnowledgeDoc } from "../../utils/api";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };

    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };

  useEffect(() => {
    console.log("Current documents state:", documents);
  }, [documents]);

  return (
    <div className="knowledge-base">
      <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
      
      <section className="knowledge-base__content">
        <p className="knowledge-base__label">Upload documents (PDF)</p>
        
        <UploadArea onFileSelect={handleFileSelect} />
        
        <div className="knowledge-base__list"></div>
        
        <button className="knowledge-base__save-btn" type="button">
          Save
        </button>
      </section>
    </div>
  );
}