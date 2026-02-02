"use client";

import { useState, useEffect, FormEvent } from "react";
import { Loader2, Plus, Trash2, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface Document {
    id: number;
    content: string;
    metadata: Record<string, any>;
    created_at?: string;
}

interface Toast {
    type: "success" | "error";
    message: string;
}

export default function AdminPage() {
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [fileName, setFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);
    const [toast, setToast] = useState<Toast | null>(null);

    // Show toast notification
    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    // Fetch existing documents
    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/ingest");
            const data = await res.json();
            if (data.documents) {
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setIsLoadingDocs(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Submit new document
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);

        try {
            const metadata: Record<string, string> = {};
            if (category.trim()) metadata.category = category.trim();
            if (fileName.trim()) metadata.file_name = fileName.trim();

            const res = await fetch("/api/ingest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, metadata }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to ingest document");
            }

            showToast("success", `Document #${data.id} ingested successfully!`);
            setContent("");
            setCategory("");
            setFileName("");
            fetchDocuments();
        } catch (error: any) {
            showToast("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete document
    const handleDelete = async (id: number) => {
        if (!confirm("Delete this document?")) return;

        try {
            const res = await fetch(`/api/ingest?id=${id}`, { method: "DELETE" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete");
            }

            showToast("success", "Document deleted");
            fetchDocuments();
        } catch (error: any) {
            showToast("error", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${toast.type === "success"
                            ? "bg-green-600/90 border border-green-500"
                            : "bg-red-600/90 border border-red-500"
                        }`}
                >
                    {toast.type === "success" ? (
                        <CheckCircle size={18} />
                    ) : (
                        <AlertCircle size={18} />
                    )}
                    <span className="text-sm">{toast.message}</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">📄 Document Ingestion</h1>
                    <p className="text-white/60">
                        Add documents to the knowledge base. Each document will be embedded using
                        Jina AI and stored in Supabase.
                    </p>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="mb-12">
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-4">
                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Content <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste or type the document content here..."
                                rows={8}
                                required
                                className="w-full bg-slate-950/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-y"
                            />
                            <p className="text-xs text-white/40 mt-1">
                                {content.length} characters
                            </p>
                        </div>

                        {/* Metadata fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Category (optional)
                                </label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g., services, certifications, about"
                                    className="w-full bg-slate-950/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Source/File Name (optional)
                                </label>
                                <input
                                    type="text"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    placeholder="e.g., company_overview.pdf"
                                    className="w-full bg-slate-950/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading || !content.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Generating embedding & storing...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Ingest Document
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Existing Documents */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        Stored Documents ({documents.length})
                    </h2>

                    {isLoadingDocs ? (
                        <div className="flex items-center justify-center py-12 text-white/50">
                            <Loader2 size={24} className="animate-spin" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-12 text-white/40 border border-dashed border-white/20 rounded-xl">
                            No documents yet. Add one above!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="bg-slate-900/50 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-mono bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">
                                                    #{doc.id}
                                                </span>
                                                {doc.metadata?.category && (
                                                    <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded">
                                                        {doc.metadata.category}
                                                    </span>
                                                )}
                                                {doc.metadata?.file_name && (
                                                    <span className="text-xs text-white/40">
                                                        {doc.metadata.file_name}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-white/80 line-clamp-2">
                                                {doc.content}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                                            title="Delete document"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Back link */}
                <div className="mt-12 text-center">
                    <a
                        href="/"
                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                        ← Back to main site
                    </a>
                </div>
            </div>
        </div>
    );
}
