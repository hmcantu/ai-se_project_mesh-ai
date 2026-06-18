import { useState, useEffect } from "react";
import "./KnowledgeBase.css";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments } from "../../utils/api";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getDocuments()
      .then((response: any) => {
        if (!isMounted) return;

        try {
          const targetData = response?.data || response;
          if (Array.isArray(targetData)) {
            const docNames = targetData.map((doc: any) => {
              if (typeof doc === "string") return doc;
              return doc?.name || doc?.title || "Unnamed Document";
            });
            setDocuments(docNames);
          }
        } catch (e) {
          console.error("Parsing error:", e);
        } finally {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to load documents.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemoveDocument = (docName: string) => {
    setDocuments((prev) => prev.filter((d) => d !== docName));
  };

  const handleFileUploaded = (file: any) => {
    if (file && file.name) {
      setDocuments((prev) => [...prev, file.name]);
    }
  };

  return (
    <div className="knowledge-base">
      <div className="knowledge-base__main-content">
        <div className="knowledge-base__header-block">
          <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
          <p className="knowledge-base__subtitle">Upload documents (PDF)</p>
        </div>

        <UploadArea onFileSelect={handleFileUploaded} />

        {isLoading && (
          <div className="knowledge-base__loading">Loading documents...</div>
        )}

        {error && (
          <div className="knowledge-base__error">{error}</div>
        )}

        {!isLoading && !error && (
          <>
            {documents.length > 0 ? (
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
            ) : (
              <div className="knowledge-base__empty-state">No documents yet.</div>
            )}
          </>
        )}

        <button type="button" className="knowledge-base__save-button">
          Save
        </button>
      </div>
    </div>
  );
}