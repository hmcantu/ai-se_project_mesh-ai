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

    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Simulate an asynchronous API database submission network delay
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
          <div className="knowledge-base__list">
            {documents.length === 0 ? (
              <p className="knowledge-base__empty">No documents found. Upload one to get started.</p>
            ) : (
              documents.map((doc) => (
                <div key={doc._id} className="knowledge-base__item">
                  <div className="knowledge-base__item-info">
                    <span className="knowledge-base__item-title">{doc.title}</span>
                    <span className="knowledge-base__item-meta">{doc.fileName}</span>
                  </div>
                  <span className="knowledge-base__item-date">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
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