import { useState, useEffect } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments } from "../../utils/api";
import type { KnowledgeDoc } from "../../utils/api";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await getDocuments();
        if (response.success && response.data) {
          setDocuments(response.data);
        } else {
          setError(response.error?.message || "Failed to load documents.");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };

    setDocuments((prevDocs) => [...prevDocs, newDoc]);
  };

  // Handler to clear a document chip when clicking the X button
  const handleDeleteDoc = (idToRemove: string) => {
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== idToRemove));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Success! Saved ${documents.length} knowledge base records.`);
    } catch (err) {
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="knowledge-base">
      <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
      
      <section className="knowledge-base__content">
        <p className="knowledge-base__label">Upload documents (PDF)</p>
        
        <UploadArea onFileSelect={handleFileSelect} />
        
        {isLoading && <div className="knowledge-base__status">Loading documents...</div>}
        {error && <div className="knowledge-base__status knowledge-base__status--error">{error}</div>}
        
        {!isLoading && !error && (
          <div className="knowledge-base__chips-container">
            {documents.map((doc) => (
              <div key={doc._id} className="knowledge-base__chip">
                <span className="knowledge-base__chip-title">{doc.title}</span>
                <button 
                  type="button" 
                  className="knowledge-base__chip-delete"
                  onClick={() => handleDeleteDoc(doc._id)}
                  aria-label={`Remove ${doc.title}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button 
          className="knowledge-base__save-btn" 
          type="button"
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </section>
    </div>
  );
}