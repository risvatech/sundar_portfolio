"use client";
import React, { useEffect, useRef, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
    AppWindow,
    Check,
    Edit,
    ExternalLink,
    Eye,
    Image as ImageIcon,
    Plus,
    Search,
    Settings,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import toast from "react-hot-toast";
import api from "../../service/api";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useRouter } from "next/navigation";
import { categoryOptions } from "../../constants/category_options";
import Dropdown from "../../components/dropdown";
import { appTypeOptions } from "../../constants/app_type_options";
import ConfirmDialog from "../../components/ConfirmDialog";
import Image from "next/image";

// Define types
interface App {
    id: string;
    title: string;
    category: string;
    appType: string;
    shortDescription: string;
    description: string;
    thumbnailUrl: string;
    screenshots: string[];
    features: string[];
    demoUrl?: string;
    downloadUrl?: string;
    seoSlug: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    isActive: boolean;
    userId?: string;
}

interface FormErrors {
    [key: string]: string;
}

interface ApiResponse {
    data?: App[];
    apps?: App[];
}

const Admin = () => {
    const router = useRouter();

    // State management
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingApp, setEditingApp] = useState<App | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);
    const [allApps, setAllApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingApps, setFetchingApps] = useState(true);

    // Form fields
    const [title, setAppTitle] = useState("");
    const [category, setCategory] = useState("");
    const [appType, setAppType] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [features, setFeatures] = useState("");
    const [desc, setDesc] = useState("");
    const [demoUrl, setDemoUrl] = useState("");
    const [downUrl, setDownUrl] = useState("");
    const [seoSlug, setSeoSlug] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDesc, setMetaDesc] = useState("");
    const [metaKeyWords, setMetaKeyWords] = useState("");
    const [screenshots, setScreenShots] = useState<File[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

    // File input refs
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const screenshotsInputRef = useRef<HTMLInputElement>(null);

    // Fetch all apps
    const fetchAllApps = async () => {
        try {
            setFetchingApps(true);
            const response = await api.get<ApiResponse>("/apps/getapps");

            // Handle different response formats
            let appsArray: App[] = [];

            if (Array.isArray(response.data)) {
                appsArray = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                appsArray = response.data.data;
            } else if (response.data && Array.isArray(response.data.apps)) {
                appsArray = response.data.apps;
            } else if (Array.isArray(response.data)) {
                appsArray = response.data;
            }

            setAllApps(appsArray);
        } catch (error) {
            console.error("Failed to fetch apps:", error);
            toast.error("Failed to load apps");
            setAllApps([]); // Set empty array on error
        } finally {
            setFetchingApps(false);
        }
    };

    React.useEffect(() => {
        fetchAllApps();
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (editingApp) {
            setAppTitle(editingApp.title || "");
            setCategory(editingApp.category || "");
            setAppType(editingApp.appType || "");
            setShortDesc(editingApp.shortDescription || "");
            setFeatures(Array.isArray(editingApp.features)
                ? editingApp.features.join(", ")
                : (editingApp.features || ""));
            setDesc(editingApp.description || "");
            setDemoUrl(editingApp.demoUrl || "");
            setDownUrl(editingApp.downloadUrl || "");
            setSeoSlug(editingApp.seoSlug || "");
            setMetaTitle(editingApp.metaTitle || "");
            setMetaDesc(editingApp.metaDescription || "");
            setMetaKeyWords(editingApp.metaKeywords || "");
        }
    }, [editingApp]);

    // Handle thumbnail file selection
    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB for better performance)
            if (file.size > 2 * 1024 * 1024) {
                alert("Thumbnail image must be smaller than 2MB");
                return;
            }

            // Check file type
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file");
                return;
            }

            setThumbnailFile(file);
            setErrors((prev) => ({ ...prev, thumbnail: "" }));
        }
    };

    // Handle screenshot files selection
    const handleScreenshotsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Validate files
        const validFiles = files.filter((file) => {
            if (file.size > 2 * 1024 * 1024) {
                alert(`${file.name} is too large (max 2MB)`);
                return false;
            }

            if (!file.type.startsWith("image/")) {
                alert(`${file.name} is not a valid image`);
                return false;
            }

            return true;
        });

        setScreenShots((prev) => [...prev, ...validFiles]);
        setErrors((prev) => ({ ...prev, screenshots: "" }));
    };

    // Remove screenshot file
    const removeScreenshot = (index: number) => {
        setScreenShots((prev) => prev.filter((_, i) => i !== index));
    };

    // Remove existing screenshot
    const removeExistingScreenshot = (index: number) => {
        setExistingScreenshots((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEdit = (app: App) => {
        setEditingApp(app);
        setShowEditForm(true);
        setShowAddForm(false);
        // Reset file states when editing
        setThumbnailFile(null);
        setScreenShots([]);
        setExistingScreenshots(app.screenshots || []);
    };

    // Ensure filteredApps is always an array
    const filteredApps = Array.isArray(allApps)
        ? allApps.filter((app) =>
            app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.category && app.category.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    // Image upload function
    async function uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);


        try {
            const res = await api.post("/appupload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // This should show: http://localhost:5002/uploads/filename.jpg

            return res.data.url;
        } catch (err: any) {
            console.error("Upload error:", err);
            throw new Error(err.response?.data?.message || "Upload failed");
        }
    }

    // Helper function for picking values
    const pickValue = (input: string | undefined, fallback: string): string =>
        input !== undefined && input.trim() !== "" ? input : fallback;

    // Create app
    const createApp = async () => {
        try {
            setLoading(true);

            if (!thumbnailFile) {
                toast.error("Please select a thumbnail image");
                setLoading(false);
                return;
            }

            const thumbnailUrl = await uploadImage(thumbnailFile);

            const screenshotUrls = await Promise.all(
                screenshots.map((file) => uploadImage(file)),
            );

            const payload = {
                title,
                description: desc,
                shortDescription: shortDesc,
                seoSlug,
                thumbnailUrl,
                category,
                appType,
                features: features.split(",").map((f) => f.trim()),
                screenshots: screenshotUrls,
                downloadUrl: downUrl,
                demoUrl,
                metaTitle,
                metaDescription: metaDesc,
                metaKeywords: metaKeyWords,
            };

            await api.post("/apps/create", payload);
            toast.success("App Created!");
            fetchAllApps();
            setShowAddForm(false);
            setShowEditForm(false);
            setEditingApp(null);
            setThumbnailFile(null);
            setScreenShots([]);
        } catch (err: any) {
            if (err.response && err.response.status === 409) {
                // Duplicate slug error from backend
                toast.error(err.response.data?.message);
            } else {
                toast.error("Upload or API failed: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Edit app
    const editApp = async () => {
        try {
            setLoading(true);

            if (!editingApp) {
                toast.error("No app selected for editing");
                setLoading(false);
                return;
            }

            const isValid = validateAllFieldsForEdit();
            if (!isValid) {
                setLoading(false);
                return;
            }

            const thumbnailUrl = thumbnailFile
                ? await uploadImage(thumbnailFile)
                : editingApp?.thumbnailUrl || "";

            const newScreenshotUrls = await Promise.all(
                screenshots.filter((file) => file).map((file) => uploadImage(file)),
            );

            const screenshotUrls = [...existingScreenshots, ...newScreenshotUrls];

            const payload = {
                appId: editingApp.id,
                title: pickValue(title, editingApp.title),
                description: pickValue(desc, editingApp.description),
                shortDescription: pickValue(shortDesc, editingApp.shortDescription),
                seoSlug: pickValue(seoSlug, editingApp.seoSlug),
                thumbnailUrl,
                category: pickValue(category, editingApp.category),
                appType: pickValue(appType, editingApp.appType),
                features: Array.isArray(features)
                    ? features
                    : features.split(",").map((f) => f.trim()),
                screenshots: screenshotUrls,
                downloadUrl: downUrl && downUrl.trim() !== '' ? downUrl.trim() : editingApp.downloadUrl || '',
                demoUrl: demoUrl && demoUrl.trim() !== '' ? demoUrl.trim() : editingApp.demoUrl || '',
                metaTitle: metaTitle && metaTitle.trim() !== '' ? metaTitle.trim() : editingApp.metaTitle || '',
                metaDescription: metaDesc && metaDesc.trim() !== '' ? metaDesc.trim() : editingApp.metaDescription || '',
                metaKeywords: metaKeyWords && metaKeyWords.trim() !== '' ? metaKeyWords.trim() : editingApp.metaKeywords || '',
            };

            await api.patch("/apps/edit", payload);
            toast.success("App updated!");
            fetchAllApps();

            // Reset form
            setShowAddForm(false);
            setShowEditForm(false);
            setEditingApp(null);
            setThumbnailFile(null);
            setScreenShots([]);
            setExistingScreenshots([]);
            setErrors({});
        } catch (err: any) {
            toast.error("Upload or API failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete app
    const deleteApp = async (appId: string) => {
        try {
            await api.delete(`/apps/delete/${appId}`);
            toast.success("App deleted successfully!");
            fetchAllApps();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete app");
        }
    };

    const handleDelete = (id: string) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleConfirm = () => {
        if (selectedId) {
            deleteApp(selectedId);
        }
        setOpen(false);
        setSelectedId(null);
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedId(null);
    };

    // Validation functions
    const validateField = (name: string, value: any): boolean => {
        let error = "";

        const safeValue = typeof value === "string" ? value.trim() : value;

        switch (name) {
            case "title":
                if (!safeValue) error = "App title is required";
                break;
            case "category":
                if (!safeValue) error = "Category is required";
                break;
            case "appType":
                if (!safeValue) error = "App type is required";
                break;
            case "shortDescription":
                if (!safeValue) error = "Short Description is required";
                break;
            case "description":
                if (!safeValue) error = "Full Description is required";
                break;
            case "seoSlug":
                if (!safeValue) error = "SEO Slug is required";
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        return error === "";
    };

    const validateAllFields = (): boolean => {
        let isValid = true;

        const validations = [
            validateField("title", title),
            validateField("category", category),
            validateField("appType", appType),
            validateField("shortDescription", shortDesc),
            validateField("description", desc),
            validateField("seoSlug", seoSlug),
        ];

        // Validate thumbnail
        if (!thumbnailFile) {
            setErrors((prev) => ({ ...prev, thumbnail: "Thumbnail is required" }));
            isValid = false;
        } else {
            setErrors((prev) => ({ ...prev, thumbnail: "" }));
        }

        const fieldsAreValid = validations.every((check) => check);

        // Show toast if anything is invalid
        if (!isValid || !fieldsAreValid) {
            toast.error("Please fill all required fields and upload images");
        }

        return isValid && fieldsAreValid;
    };

    const validateAllFieldsForEdit = (): boolean => {
        let isValid = true;

        const requiredFields = [
            { name: "title", value: title },
            { name: "category", value: category },
            { name: "appType", value: appType },
            { name: "shortDescription", value: shortDesc },
            { name: "description", value: desc },
            { name: "seoSlug", value: seoSlug },
        ];

        for (const field of requiredFields) {
            let value = field.value;

            if (typeof value === "string") {
                value = value.trim();
            }

            const isEmpty =
                value === "" ||
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0);

            if (isEmpty) {
                setErrors((prev) => ({
                    ...prev,
                    [field.name]: `${field.name} is required`,
                }));
                isValid = false;
            } else {
                setErrors((prev) => ({ ...prev, [field.name]: "" }));
            }
        }

        // Validate thumbnail
        if (!thumbnailFile && !editingApp?.thumbnailUrl) {
            setErrors((prev) => ({ ...prev, thumbnail: "Thumbnail is required" }));
            isValid = false;
        } else {
            setErrors((prev) => ({ ...prev, thumbnail: "" }));
        }

        if (!isValid) {
            toast.error("Please fill all required fields and upload images");
        }

        return isValid;
    };

    // Fix: Moved ConfirmDialog outside of the map loop to avoid duplicate renders
    const renderConfirmDialog = (
        <ConfirmDialog
            open={open}
            title="Delete Item"
            message="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <AppWindow className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Portfolio CMS
                                </h1>
                                <p className="text-gray-600">Manage your app portfolio</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search apps..."
                                    value={searchTerm}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <Button
                                onClick={() => {
                                    setShowAddForm(true);
                                    setAppTitle("");
                                    setCategory("");
                                    setAppType("");
                                    setShortDesc("");
                                    setFeatures("");
                                    setDesc("");
                                    setDemoUrl("");
                                    setDownUrl("");
                                    setSeoSlug("");
                                    setMetaTitle("");
                                    setMetaDesc("");
                                    setMetaKeyWords("");
                                    setScreenShots([]);
                                    setExistingScreenshots([]);
                                }}
                                className="bg-primary hover:from-purple-700 hover:to-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New App
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Apps
                                    </p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {Array.isArray(allApps) ? allApps.length : 0}
                                    </p>
                                </div>
                                <AppWindow className="w-8 h-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Active Apps
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {Array.isArray(allApps) ? allApps.filter((app) => app.isActive).length : 0}
                                    </p>
                                </div>
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Categories
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {Array.isArray(allApps)
                                            ? new Set(allApps.map((app) => app.category).filter(Boolean)).size
                                            : 0}
                                    </p>
                                </div>
                                <Settings className="w-8 h-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Add/Edit Form */}
                {(showAddForm || showEditForm) && (
                    <Card className="mb-8 border-2 border-purple-200">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                            <CardTitle className="text-xl text-purple-800">
                                {showEditForm ? "Edit App" : "Add New App"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form
                                onSubmit={async (e: FormEvent) => {
                                    e.preventDefault();
                                    if (editingApp) {
                                        const isValid = validateAllFieldsForEdit();
                                        if (isValid) await editApp();
                                    } else {
                                        const isValid = validateAllFields();
                                        if (isValid) await createApp();
                                    }
                                }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <Input
                                            name="title"
                                            value={title}
                                            className="text-gray-900"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setAppTitle(e.target.value);
                                                setErrors((prev) => ({ ...prev, title: "" }));
                                            }}
                                        />
                                    </div>
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title}</p>
                                    )}
                                </div>
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <Dropdown
                                            name="category"
                                            options={categoryOptions}
                                            value={category}
                                            onChange={(val: string) => {
                                                setCategory(val);
                                                setErrors((prev) => ({ ...prev, category: "" }));
                                            }}
                                        />
                                    </div>
                                    {errors.category && (
                                        <p className="text-sm text-red-500">{errors.category}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Short Description *
                                        </label>
                                        <Input
                                            name="shortDescription"
                                            className="text-gray-900"
                                            value={shortDesc}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setShortDesc(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    shortDescription: "",
                                                }));
                                            }}
                                        />
                                    </div>
                                    {errors.shortDescription && (
                                        <p className="text-sm text-red-500">
                                            {errors.shortDescription}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            App Type *
                                        </label>
                                        <Dropdown
                                            name="appType"
                                            options={appTypeOptions}
                                            value={appType}
                                            onChange={(val: string) => {
                                                setAppType(val);
                                                setErrors((prev) => ({ ...prev, appType: "" }));
                                            }}
                                        />
                                    </div>
                                    {errors.appType && (
                                        <p className="text-sm text-red-500">{errors.appType}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                            value={desc}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                setDesc(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    description: "",
                                                }));
                                            }}
                                        />
                                    </div>
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Thumbnail Image *
                                        </label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => thumbnailInputRef.current?.click()}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Choose Thumbnail
                                                </Button>
                                            </div>

                                            <input
                                                ref={thumbnailInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailSelect}
                                                className="hidden"
                                            />

                                            <p className="text-xs text-gray-500">
                                                Recommended: 400x300px, max 2MB (JPG, PNG, WebP)
                                            </p>

                                            {/* Preview newly selected thumbnail */}
                                            {thumbnailFile && (
                                                <div className="relative group w-40">
                                                    <img
                                                        src={URL.createObjectURL(thumbnailFile)}
                                                        alt="New Thumbnail"
                                                        className="w-full h-24 object-cover rounded border-2 border-green-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setThumbnailFile(null)}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs px-1 py-0.5 text-center rounded-b">
                                                        NEW
                                                    </div>
                                                </div>
                                            )}

                                            {/* Existing thumbnail when editing and not replaced */}
                                            {editingApp?.thumbnailUrl && !thumbnailFile && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span>Current:</span>
                                                    <div className="w-16 h-12 relative rounded border overflow-hidden">
                                                        <Image
                                                            src={editingApp.thumbnailUrl}
                                                            alt="Current thumbnail"
                                                            fill
                                                            className="object-cover"
                                                            sizes="64px"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {errors.thumbnail && (
                                        <p className="text-sm text-red-500">{errors.thumbnail}</p>
                                    )}
                                </div>
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Demo URL
                                        </label>
                                        <Input
                                            name="demoUrl"
                                            type="url"
                                            value={demoUrl}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setDemoUrl(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    demoUrl: "",
                                                }));
                                            }}
                                            className="text-gray-900"
                                        />
                                    </div>
                                    {errors.demoUrl && (
                                        <p className="text-sm text-red-500">{errors.demoUrl}</p>
                                    )}
                                </div>
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Download URL
                                        </label>
                                        <Input
                                            name="downloadUrl"
                                            type="url"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setDownUrl(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    downloadUrl: "",
                                                }));
                                            }}
                                            value={downUrl}
                                            className="text-gray-900"
                                        />
                                    </div>
                                    {errors.downloadUrl && (
                                        <p className="text-sm text-red-500">{errors.downloadUrl}</p>
                                    )}
                                </div>
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Features (comma-separated)
                                        </label>
                                        <Input
                                            name="features"
                                            placeholder="Feature 1, Feature 2, Feature 3"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFeatures(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    features: "",
                                                }));
                                            }}
                                            value={features}
                                            className="text-gray-900"
                                        />
                                    </div>
                                    {errors.features && (
                                        <p className="text-sm text-red-500">{errors.features}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Screenshots
                                        </label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => screenshotsInputRef.current?.click()}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Choose Screenshots
                                                </Button>
                                                {screenshots.length > 0 && (
                                                    <span className="text-sm text-green-600">
                            {screenshots.length} file(s) selected
                          </span>
                                                )}
                                            </div>
                                            <input
                                                ref={screenshotsInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleScreenshotsSelect}
                                                className="hidden"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Recommended: 800x600px or mobile aspect ratio, max 2MB
                                                each (JPG, PNG, WebP)
                                            </p>

                                            {/* Preview newly selected files */}
                                            {screenshots.length > 0 && (
                                                <div className="space-y-2">
                          <span className="text-sm text-gray-600">
                            New screenshots to add ({screenshots.length}):
                          </span>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        {screenshots.map((file, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={`New screenshot ${index + 1}`}
                                                                    className="w-full h-20 object-cover rounded border-2 border-green-300"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeScreenshot(index)}
                                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                                <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs px-1 py-0.5 text-center">
                                                                    NEW
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show existing screenshots if editing */}
                                            {existingScreenshots.length > 0 && (
                                                <div className="space-y-2">
                          <span className="text-sm text-gray-600">
                            Current screenshots ({existingScreenshots.length}):
                          </span>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        {existingScreenshots.map((url, index) => (
                                                            <div key={index} className="relative group">
                                                                <div className="w-full h-20 relative rounded border overflow-hidden">
                                                                    <Image
                                                                        src={url}
                                                                        alt={`Current screenshot ${index + 1}`}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeExistingScreenshot(index)
                                                                    }
                                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {errors.screenshots && (
                                        <p className="text-sm text-red-500">{errors.screenshots}</p>
                                    )}
                                </div>
                                {/* SEO Section */}
                                <div className="md:col-span-2 pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        SEO Settings
                                    </h3>
                                </div>

                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SEO URL Slug
                                        </label>
                                        <Input
                                            name="seoSlug"
                                            placeholder="my-awesome-app"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setSeoSlug(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    seoSlug: "",
                                                }));
                                            }}
                                            value={seoSlug}
                                            className="text-gray-900"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            URL-friendly slug for SEO (auto-generated if empty)
                                        </p>
                                    </div>
                                    {errors.seoSlug && (
                                        <p className="text-sm text-red-500">{errors.seoSlug}</p>
                                    )}
                                </div>
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Meta Title
                                        </label>
                                        <Input
                                            name="metaTitle"
                                            placeholder="Custom SEO title for search results"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setMetaTitle(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    metaTitle: "",
                                                }));
                                            }}
                                            value={metaTitle}
                                            className="text-gray-900"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Used in search results and browser tabs
                                        </p>
                                    </div>
                                    {errors.metaTitle && (
                                        <p className="text-sm text-red-500">{errors.metaTitle}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Meta Description
                                        </label>
                                        <textarea
                                            name="metaDescription"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                                            placeholder="Brief description for search engines (150-160 characters recommended)"
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                setMetaDesc(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    metaDescription: "",
                                                }));
                                            }}
                                            value={metaDesc}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Appears in search results below the title
                                        </p>
                                    </div>
                                    {errors.metaDescription && (
                                        <p className="text-sm text-red-500">
                                            {errors.metaDescription}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Meta Keywords
                                        </label>
                                        <Input
                                            name="metaKeywords"
                                            placeholder="keyword1, keyword2, mobile app, web development"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setMetaKeyWords(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    metaKeywords: "",
                                                }));
                                            }}
                                            value={metaKeyWords}
                                            className="text-gray-900"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Comma-separated keywords for SEO (helps search engines
                                            understand content)
                                        </p>
                                    </div>
                                    {errors.metaKeywords && (
                                        <p className="text-sm text-red-500">
                                            {errors.metaKeywords}
                                        </p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            defaultChecked={editingApp?.isActive ?? true}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                      Active (show in portfolio)
                    </span>
                                    </label>
                                </div>

                                <div className="md:col-span-2 flex gap-3">
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                        {loading ? (
                                            <LoadingIndicator />
                                        ) : editingApp ? (
                                            "Update App"
                                        ) : (
                                            "Add App"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setShowEditForm(false);
                                            setEditingApp(null);
                                            setThumbnailFile(null);
                                            setScreenShots([]);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Apps Grid */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-gray-900">Portfolio Apps</h2>
                    </div>

                    {fetchingApps ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                    <CardContent className="p-6">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-6 bg-gray-200 rounded"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredApps.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No apps found</p>
                            <Button
                                onClick={() => setShowAddForm(true)}
                                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First App
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredApps.map((app) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                                            <div className="relative">
                                                <div className="w-full h-48 relative">
                                                    <Image
                                                        src={app.thumbnailUrl}
                                                        alt={app.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                                <div className="absolute top-2 right-2 space-x-2">
                                                    <Badge variant={app.isActive ? "default" : "secondary"}>
                                                        {app.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                                {app.category && (
                                                    <div className="absolute bottom-2 left-2">
                                                        <Badge variant="outline" className="bg-white/90">
                                                            {app.category}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-semibold text-lg">{app.title}</h3>
                                                    <div className="flex items-center space-x-2">
                                                        {app.demoUrl && (
                                                            <ExternalLink className="w-4 h-4 text-blue-600" />
                                                        )}
                                                        {app.downloadUrl && (
                                                            <ExternalLink className="w-4 h-4 text-green-600" />
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {app.shortDescription}
                                                </p>
                                                {app.features && app.features.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {app.features.slice(0, 3).map((feature, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs">
                                                                {feature.length > 15
                                                                    ? `${feature.substring(0, 15)}...`
                                                                    : feature}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                              {app.screenshots?.length || 0} screenshots
                            </span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            title="View Details"
                                                            onClick={() => router.push(`/cms/portfolio/${app.seoSlug}`)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            title="Edit App"
                                                            onClick={() => handleEdit(app)}
                                                        >
                                                            <Edit className="w-4 h-4 text-blue-600" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            title="Delete App"
                                                            onClick={() => handleDelete(app.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {renderConfirmDialog}
        </div>
    );
};

export default Admin;