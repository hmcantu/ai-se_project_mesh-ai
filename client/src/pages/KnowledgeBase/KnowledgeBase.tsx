import { useState, useEffect } from "react";
import "./KnowledgeBase.css";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments, uploadDocument, type KnowledgeDoc } from "../../utils/api";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getDocuments()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setDocuments(res.data);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err?.message || "Failed to load documents.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d._id !== id));
  };

  const handleFileUploaded = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadDocument(file);
      if (res.success && res.data) {
        setDocuments((prev) => [res.data!, ...prev]);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="knowledge-base">
      <div className="knowledge-base__main-content">
        <div className="knowledge-base__header-block">
          <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
          <p className="knowledge-base__subtitle">Upload documents (PDF)</p>
        </div>

        <UploadArea onFileSelect={handleFileUploaded} isUploading={isUploading} />

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
                {documents.map((doc) => (
                  <li key={doc._id} className="knowledge-base__document-item">
                    <span className="knowledge-base__document-name">
                      {doc.title || doc.fileName}
                    </span>
                    <button
                      type="button"
                      className="knowledge-base__document-remove"
                      aria-label={`Remove ${doc.title || doc.fileName}`}
                      onClick={() => handleRemoveDocument(doc._id)}
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
      </div>
    </div>
  );
}