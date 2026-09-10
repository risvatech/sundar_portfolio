"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Plus, Trash2, X, Images, Save, Upload, CheckCircle, Clock, Grid } from "lucide-react";
import { Button } from "../../components/ui/button";
import api from "../../service/api";

interface Gallery {
    id: string;
    title: string;
    description: string;
    images: string[];
    published: boolean;
    createdAt?: string;
}

interface FormData {
    title: string;
    description: string;
    images: string[];
    published: boolean;
}

interface InputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
}

interface TextareaProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
}

// Define the upload response type
interface UploadResponse {
    files: Array<{ url: string }>;
}

const GalleryAdminUI = () => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        images: [],
        published: false,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [galleries, setGalleries] = useState<Gallery[]>([]);

    interface ApiGallery {
        id?: string;
        _id?: string;
        title?: string;
        description?: string;
        images?: unknown;
        published?: boolean;
        createdAt?: string;
    }

    const normalizeGallery = (g: ApiGallery): Gallery => ({
        id: g.id || g._id || "",
        title: g.title || "",
        description: g.description || "",
        images: Array.isArray(g.images) ? g.images as string[] : [],
        published: !!g.published,
        createdAt: g.createdAt,
    });

    /** Fetch all galleries */
    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                const { data } = await api.get("/galleries");
                const list = Array.isArray(data) ? data : data?.data || [];
                setGalleries(list.map(normalizeGallery));
            } catch (err) {
                console.error("❌ Failed to fetch galleries:", err);
                setGalleries([]);
            }
        };
        fetchGalleries();
    }, []);

    /** Handle form input */
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /** Upload images to backend */
    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        setUploading(true);
        const fd = new FormData();
        for (const f of files) fd.append("images", f);
        try {
            const { data } = await api.post<UploadResponse>("/galleries/upload-multiple", fd);
            const uploadedUrls = data?.files?.map((f) => f.url) || [];
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls],
            }));
        } catch (err) {
            console.error("❌ Upload failed:", err);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const addImageUrl = () => {
        if (!imageUrl.trim()) return;
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl.trim()],
        }));
        setImageUrl("");
    };

    const removeImage = (index: number) =>
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            images: [],
            published: false,
        });
        setEditingId(null);
        setShowForm(false);
        setImageUrl("");
        setUploadMethod("upload");
    };

    /** Create or update gallery */
    const handleSubmit = async () => {
        if (!formData.title.trim()) return alert("Title required");
        if (!formData.images.length) return alert("Add at least one image");

        try {
            let res;
            if (editingId) {
                res = await api.put(`/galleries/${editingId}`, formData);
            } else {
                res = await api.post("/galleries", formData);
            }

            const saved = normalizeGallery(res.data);
            if (editingId)
                setGalleries((prev) => prev.map((g) => (g.id === editingId ? saved : g)));
            else setGalleries((prev) => [saved, ...prev]);

            resetForm();
        } catch (err) {
            console.error("❌ Save error:", err);
            alert("Save failed — check console.");
        }
    };

    const editGallery = (g: Gallery) => {
        const normalized = normalizeGallery(g);
        setEditingId(normalized.id);
        setFormData({ ...normalized });
        setShowForm(true);
    };

    const deleteGallery = async (id: string) => {
        if (!window.confirm("Delete this gallery?")) return;
        try {
            await api.delete(`/galleries/${id}`);
            setGalleries((prev) => prev.filter((g) => g.id !== id));
        } catch (err) {
            console.error("❌ Delete error:", err);
            alert("Failed to delete gallery.");
        }
    };

    const galleryStats = {
        totalGalleries: galleries.length,
        totalImages: galleries.reduce((acc, g) => acc + g.images.length, 0),
        published: galleries.filter((g) => g.published).length,
        drafts: galleries.filter((g) => !g.published).length,
    };

    /** JSX */
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Gallery Dashboard</h1>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {showForm ? "Cancel" : "Add Gallery"}
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={<Grid className="w-6 h-6" />} label="Total Galleries" value={galleryStats.totalGalleries} />
                    <StatCard icon={<Images className="w-6 h-6" />} label="Total Images" value={galleryStats.totalImages} />
                    <StatCard icon={<CheckCircle className="w-6 h-6" />} label="Published" value={galleryStats.published} />
                    <StatCard icon={<Clock className="w-6 h-6" />} label="Drafts" value={galleryStats.drafts} />
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-medium mb-6">{editingId ? "Edit Gallery" : "Create Gallery"}</h2>
                        <div className="space-y-4">
                            <Input label="Title *" name="title" value={formData.title} onChange={handleInputChange} />
                            <Textarea
                                label="Description *"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Add Images *</label>
                                <div className="flex gap-2 mb-4">
                                    <Button
                                        type="button"
                                        onClick={() => setUploadMethod("upload")}
                                        className={`flex-1 py-2 rounded-lg ${uploadMethod === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                                    >
                                        <Upload className="w-4 h-4" /> Upload Files
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setUploadMethod("url")}
                                        className={`flex-1 py-2 rounded-lg ${uploadMethod === "url" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                                    >
                                        <Images className="w-4 h-4" /> Add URL
                                    </Button>
                                </div>

                                {uploadMethod === "upload" ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className={`w-12 h-12 mb-3 ${uploading ? "text-gray-400" : "text-gray-500"}`} />
                                            <span className="text-sm text-gray-600 mb-1">
                                                {uploading ? "Uploading..." : "Click to upload images"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 10MB (multiple files supported)
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                                            placeholder="Enter image URL"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addImageUrl}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                )}

                                {formData.images.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Added Images ({formData.images.length})
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {formData.images.map((img, i) => (
                                                <div key={i} className="relative group">
                                                    <img
                                                        src={img}
                                                        alt={`img-${i}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeImage(i)}
                                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={formData.published}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                            </label>

                            <div className="flex gap-3 pt-4">
                                <Button onClick={handleSubmit} disabled={uploading} className="bg-blue-600 text-white">
                                    <Save className="w-5 h-5" /> {editingId ? "Update" : "Create"}
                                </Button>
                                <Button onClick={resetForm} className="bg-gray-300 text-gray-700">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl mb-4">Existing Galleries ({galleries.length})</h2>
                    {galleries.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No galleries yet. Create your first gallery!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {galleries.map((gallery) => (
                                <div key={gallery.id} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition">
                                    <div className="w-32 h-24 flex-shrink-0">
                                        <img
                                            src={gallery.images[0] || "https://placehold.co/300x200?text=No+Image"}
                                            alt={gallery.title}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium">{gallery.title}</h3>
                                        <p className="text-gray-600 text-sm">{gallery.description}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    gallery.published
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {gallery.published ? "Published" : "Draft"}
                                            </span>
                                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                                {gallery.images.length} images
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => editGallery(gallery)}
                                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => deleteGallery(gallery.id)}
                                            className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Input: React.FC<InputProps> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
    </div>
);

const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea {...props} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
    </div>
);

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="w-6 h-6 text-gray-500 mb-2">{icon}</div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
    </div>
);

export default GalleryAdminUI;