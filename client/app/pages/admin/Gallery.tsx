"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Edit,
    Trash2,
    Image as ImageIcon,
    Grid,
    List,
    Search,
    Eye,
    EyeOff,
    ChevronLeft,
    ChevronRight,
    Upload,
    X,
    Tag,
    Star,
    StarOff,
    Check,
    MoreVertical,
    Folder,
    FolderOpen,
    Layers
} from "lucide-react";
import api from "../../service/api";
import toast from "react-hot-toast";

interface Category {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface GalleryItem {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    imageUrls: string[];
    categoryId?: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    category?: Category;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function GalleryAdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"gallery" | "categories">("gallery");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Gallery Items State
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1
    });
    const [loading, setLoading] = useState(false);

    // Categories State
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    // Modal States
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<GalleryItem | Category | null>(null);

    // Form States
    const [galleryForm, setGalleryForm] = useState({
        id: 0,
        title: "",
        description: "",
        categoryId: "",
        isActive: true,
        sortOrder: 0,
        thumbnailIndex: 0,
        files: [] as File[],
        existingImages: [] as string[],
        imagesToRemove: [] as string[]
    });

    const [categoryForm, setCategoryForm] = useState({
        id: 0,
        name: "",
        description: "",
        isActive: true
    });

    // Fetch gallery items
    const fetchGalleryItems = async (page = 1) => {
        setLoading(true);
        try {
            const params: any = {
                page,
                limit: pagination.limit,
            };

            if (searchTerm) params.search = searchTerm;
            if (selectedCategory !== "all") params.categoryId = selectedCategory;

            const response = await api.get("/gallery", { params });

            if (response.data.success) {
                setGalleryItems(response.data.data);
                setPagination(response.data.pagination || {
                    page,
                    limit: pagination.limit,
                    total: response.data.data.length,
                    pages: 1
                });
            }
        } catch (error) {
            toast.error("Failed to load gallery items");
            console.error("Error fetching gallery items:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const response = await api.get("/gallery/categories");
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to load categories");
            console.error("Error fetching categories:", error);
        } finally {
            setCategoriesLoading(false);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchGalleryItems();
        fetchCategories();
    }, []);

    // Handle search and filter changes
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchGalleryItems(1);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, selectedCategory]);

    // Gallery Item Handlers
    const handleCreateGallery = async () => {
        try {
            const formData = new FormData();
            formData.append("title", galleryForm.title);
            formData.append("description", galleryForm.description);
            if (galleryForm.categoryId) formData.append("categoryId", galleryForm.categoryId);
            formData.append("isActive", galleryForm.isActive.toString());
            formData.append("sortOrder", galleryForm.sortOrder.toString());
            formData.append("thumbnailIndex", galleryForm.thumbnailIndex.toString());

            // Append all files
            galleryForm.files.forEach(file => {
                formData.append("images", file);
            });

            const response = await api.post("/gallery", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                toast.success("Gallery item created successfully");
                setShowGalleryModal(false);
                resetGalleryForm();
                fetchGalleryItems();
            }
        } catch (error) {
            toast.error("Failed to create gallery item");
            console.error("Error creating gallery item:", error);
        }
    };

    const handleUpdateGallery = async () => {
        try {
            const formData = new FormData();
            formData.append("title", galleryForm.title);
            formData.append("description", galleryForm.description);
            if (galleryForm.categoryId) formData.append("categoryId", galleryForm.categoryId);
            formData.append("isActive", galleryForm.isActive.toString());
            formData.append("sortOrder", galleryForm.sortOrder.toString());
            formData.append("thumbnailIndex", galleryForm.thumbnailIndex.toString());

            // Append images to remove
            if (galleryForm.imagesToRemove.length > 0) {
                formData.append("removeImages", JSON.stringify(galleryForm.imagesToRemove));
            }

            // Append new files
            galleryForm.files.forEach(file => {
                formData.append("images", file);
            });

            const response = await api.put(`/gallery/${galleryForm.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                toast.success("Gallery item updated successfully");
                setShowGalleryModal(false);
                resetGalleryForm();
                fetchGalleryItems();
            }
        } catch (error) {
            toast.error("Failed to update gallery item");
            console.error("Error updating gallery item:", error);
        }
    };

    const handleDeleteGallery = async () => {
        if (!itemToDelete || !("imageUrls" in itemToDelete)) return;

        try {
            const response = await api.delete(`/gallery/${itemToDelete.id}`);

            if (response.data.success) {
                toast.success("Gallery item deleted successfully");
                setShowDeleteModal(false);
                setItemToDelete(null);
                fetchGalleryItems();
            }
        } catch (error) {
            toast.error("Failed to delete gallery item");
            console.error("Error deleting gallery item:", error);
        }
    };

    const handleEditGallery = (item: GalleryItem) => {
        setGalleryForm({
            id: item.id,
            title: item.title,
            description: item.description || "",
            categoryId: item.categoryId?.toString() || "",
            isActive: item.isActive,
            sortOrder: item.sortOrder,
            thumbnailIndex: item.thumbnailUrl ?
                item.imageUrls.indexOf(item.thumbnailUrl) : 0,
            files: [],
            existingImages: [...item.imageUrls],
            imagesToRemove: []
        });
        setShowGalleryModal(true);
    };

    // Category Handlers
    const handleCreateCategory = async () => {
        try {
            const response = await api.post("/gallery/categories", categoryForm);

            if (response.data.success) {
                toast.success("Category created successfully");
                setShowCategoryModal(false);
                resetCategoryForm();
                fetchCategories();
            }
        } catch (error) {
            toast.error("Failed to create category");
            console.error("Error creating category:", error);
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const response = await api.put(`/gallery/categories/${categoryForm.id}`, categoryForm);

            if (response.data.success) {
                toast.success("Category updated successfully");
                setShowCategoryModal(false);
                resetCategoryForm();
                fetchCategories();
            }
        } catch (error) {
            toast.error("Failed to update category");
            console.error("Error updating category:", error);
        }
    };

    const handleDeleteCategory = async () => {
        if (!itemToDelete || !("name" in itemToDelete)) return;

        try {
            const response = await api.delete(`/gallery/categories/${itemToDelete.id}`);

            if (response.data.success) {
                toast.success("Category deleted successfully");
                setShowDeleteModal(false);
                setItemToDelete(null);
                fetchCategories();
                if (selectedCategory === itemToDelete.id.toString()) {
                    setSelectedCategory("all");
                }
            }
        } catch (error) {
            toast.error("Failed to delete category");
            console.error("Error deleting category:", error);
        }
    };

    const handleEditCategory = (category: Category) => {
        setCategoryForm({
            id: category.id,
            name: category.name,
            description: category.description || "",
            isActive: category.isActive
        });
        setShowCategoryModal(true);
    };

    const toggleCategoryStatus = async (category: Category) => {
        try {
            const response = await api.patch(`/gallery/categories/${category.id}`, {
                isActive: !category.isActive
            });

            if (response.data.success) {
                toast.success(`Category ${!category.isActive ? "activated" : "deactivated"}`);
                fetchCategories();
            }
        } catch (error) {
            toast.error("Failed to update status");
            console.error("Error toggling category status:", error);
        }
    };

    const toggleGalleryStatus = async (item: GalleryItem) => {
        try {
            const response = await api.patch(`/gallery/${item.id}`, {
                isActive: !item.isActive
            });

            if (response.data.success) {
                toast.success(`Gallery item ${!item.isActive ? "activated" : "deactivated"}`);
                fetchGalleryItems();
            }
        } catch (error) {
            toast.error("Failed to update status");
            console.error("Error toggling status:", error);
        }
    };

    const setThumbnail = async (item: GalleryItem, index: number) => {
        try {
            const response = await api.patch(`/gallery/${item.id}`, {
                thumbnailIndex: index
            });

            if (response.data.success) {
                toast.success("Thumbnail updated successfully");
                fetchGalleryItems();
            }
        } catch (error) {
            toast.error("Failed to update thumbnail");
            console.error("Error setting thumbnail:", error);
        }
    };

    // Form Resets
    const resetGalleryForm = () => {
        setGalleryForm({
            id: 0,
            title: "",
            description: "",
            categoryId: "",
            isActive: true,
            sortOrder: 0,
            thumbnailIndex: 0,
            files: [],
            existingImages: [],
            imagesToRemove: []
        });
    };

    const resetCategoryForm = () => {
        setCategoryForm({
            id: 0,
            name: "",
            description: "",
            isActive: true
        });
    };

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setGalleryForm({
            ...galleryForm,
            files: [...galleryForm.files, ...files]
        });
    };

    const removeFile = (index: number) => {
        const newFiles = [...galleryForm.files];
        newFiles.splice(index, 1);
        setGalleryForm({ ...galleryForm, files: newFiles });
    };

    const removeExistingImage = (imageUrl: string) => {
        setGalleryForm({
            ...galleryForm,
            existingImages: galleryForm.existingImages.filter(img => img !== imageUrl),
            imagesToRemove: [...galleryForm.imagesToRemove, imageUrl]
        });
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        fetchGalleryItems(page);
    };

    // Get item count for category
    const getItemCountForCategory = (categoryId: number) => {
        return galleryItems.filter(item => item.categoryId === categoryId).length;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                    <p className="text-gray-600 mt-2">Manage your gallery categories and images</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("gallery")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "gallery"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Gallery Items ({pagination.total})
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("categories")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "categories"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Folder className="w-4 h-4" />
                                Categories ({categories.length})
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Filter for Gallery */}
                        {activeTab === "gallery" && (
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {/* View Toggle for Gallery */}
                        {activeTab === "gallery" && (
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Add Button */}
                        <button
                            onClick={() => {
                                if (activeTab === "gallery") {
                                    resetGalleryForm();
                                    setShowGalleryModal(true);
                                } else {
                                    resetCategoryForm();
                                    setShowCategoryModal(true);
                                }
                            }}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add {activeTab === "gallery" ? "Gallery Item" : "Category"}
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === "gallery" ? (
                    // Gallery Items
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading gallery items...</p>
                            </div>
                        ) : galleryItems.length === 0 ? (
                            <div className="p-12 text-center">
                                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery items found</h3>
                                <p className="text-gray-600 mb-6">Get started by adding your first gallery item</p>
                                <button
                                    onClick={() => setShowGalleryModal(true)}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Gallery Item
                                </button>
                            </div>
                        ) : viewMode === "grid" ? (
                            // Grid View
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {galleryItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {/* Image with thumbnail star */}
                                            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                                <img
                                                    src={item.thumbnailUrl || item.imageUrls[0]}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />

                                                {/* Thumbnail Star */}
                                                <div className="absolute top-3 left-3">
                                                    <button
                                                        onClick={() => {
                                                            const currentThumbIndex = item.thumbnailUrl ?
                                                                item.imageUrls.indexOf(item.thumbnailUrl) : 0;
                                                            const nextIndex = (currentThumbIndex + 1) % item.imageUrls.length;
                                                            setThumbnail(item, nextIndex);
                                                        }}
                                                        className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                                                        title="Change thumbnail"
                                                    >
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    </button>
                                                </div>

                                                {/* Status Badge */}
                                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                }`}>
                                                    {item.isActive ? "Active" : "Inactive"}
                                                </div>

                                                {/* Image Count Badge */}
                                                {item.imageUrls.length > 1 && (
                                                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                                                        {item.imageUrls.length} images
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

                                                {item.category && (
                                                    <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                                        <Tag className="w-3 h-3" />
                                                        {item.category.name}
                                                    </div>
                                                )}

                                                <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                    <span>Order: {item.sortOrder}</span>
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-4 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditGallery(item)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleGalleryStatus(item)}
                                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                                                        title={item.isActive ? "Deactivate" : "Activate"}
                                                    >
                                                        {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setItemToDelete(item);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // List View
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Images
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {galleryItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                    <img
                                                        src={item.thumbnailUrl || item.imageUrls[0]}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* Thumbnail star */}
                                                    <button
                                                        onClick={() => {
                                                            const currentThumbIndex = item.thumbnailUrl ?
                                                                item.imageUrls.indexOf(item.thumbnailUrl) : 0;
                                                            const nextIndex = (currentThumbIndex + 1) % item.imageUrls.length;
                                                            setThumbnail(item, nextIndex);
                                                        }}
                                                        className="absolute top-1 left-1 p-1 bg-white/80 rounded-full"
                                                        title="Change thumbnail"
                                                    >
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.title}</div>
                                                    {item.description && (
                                                        <div className="text-sm text-gray-600 truncate max-w-xs">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm text-gray-900">{item.imageUrls.length}</span>
                                                    <ImageIcon className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.category ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Tag className="w-3 h-3" />
                                                        {item.category.name}
                            </span>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleGalleryStatus(item)}
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                                        item.isActive
                                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {item.isActive ? (
                                                        <>
                                                            <Eye className="w-3 h-3" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditGallery(item)}
                                                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setItemToDelete(item);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {galleryItems.length > 0 && pagination.pages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{" "}
                                        <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                                        of <span className="font-medium">{pagination.total}</span> results
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-3 py-1 border rounded-md ${
                                                        pagination.page === pageNum
                                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                                            : "border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === pagination.pages}
                                            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Categories Tab
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        {categoriesLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading categories...</p>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="p-12 text-center">
                                <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                                <p className="text-gray-600 mb-6">Get started by adding your first category</p>
                                <button
                                    onClick={() => setShowCategoryModal(true)}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Category
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gallery Items
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FolderOpen className="w-5 h-5 text-blue-500" />
                                                    <div className="font-medium text-gray-900">{category.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs truncate">
                                                    {category.description || "No description"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleCategoryStatus(category)}
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                                        category.isActive
                                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {category.isActive ? (
                                                        <>
                                                            <Eye className="w-3 h-3" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {getItemCountForCategory(category.id)}
                            </span>
                                                    <Layers className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(category.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditCategory(category)}
                                                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setItemToDelete(category);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCategory(category.id.toString());
                                                            setActiveTab("gallery");
                                                        }}
                                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                                        title="View Gallery Items"
                                                    >
                                                        <ImageIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Gallery Item Modal */}
                {showGalleryModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {galleryForm.id ? "Edit Gallery Item" : "Add Gallery Item"}
                                    </h3>
                                    <button
                                        onClick={() => setShowGalleryModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={galleryForm.title}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter title"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={galleryForm.description}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter description"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Category and Sort Order */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <select
                                                value={galleryForm.categoryId}
                                                onChange={(e) => setGalleryForm({ ...galleryForm, categoryId: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            >
                                                <option value="">No Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Sort Order
                                            </label>
                                            <input
                                                type="number"
                                                value={galleryForm.sortOrder}
                                                onChange={(e) => setGalleryForm({ ...galleryForm, sortOrder: parseInt(e.target.value) || 0 })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Images *
                                        </label>

                                        {/* Existing Images */}
                                        {galleryForm.existingImages.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {galleryForm.existingImages.map((imageUrl, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={`Image ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            {/* Thumbnail Star */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setGalleryForm({ ...galleryForm, thumbnailIndex: index })}
                                                                className="absolute top-2 left-2 p-1 bg-white/90 rounded-full shadow-sm"
                                                                title="Set as thumbnail"
                                                            >
                                                                {galleryForm.thumbnailIndex === index ? (
                                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                                ) : (
                                                                    <StarOff className="w-4 h-4 text-gray-400" />
                                                                )}
                                                            </button>
                                                            {/* Remove Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage(imageUrl)}
                                                                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm hover:bg-white"
                                                                title="Remove image"
                                                            >
                                                                <X className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* New Images Preview */}
                                        {galleryForm.files.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">New Images</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {galleryForm.files.map((file, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={`New image ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            {/* Thumbnail Star for new images */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setGalleryForm({
                                                                    ...galleryForm,
                                                                    thumbnailIndex: galleryForm.existingImages.length + index
                                                                })}
                                                                className="absolute top-2 left-2 p-1 bg-white/90 rounded-full shadow-sm"
                                                                title="Set as thumbnail"
                                                            >
                                                                {galleryForm.thumbnailIndex === galleryForm.existingImages.length + index ? (
                                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                                ) : (
                                                                    <StarOff className="w-4 h-4 text-gray-400" />
                                                                )}
                                                            </button>
                                                            {/* Remove Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm hover:bg-white"
                                                                title="Remove image"
                                                            >
                                                                <X className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload Button */}
                                        <div>
                                            <input
                                                type="file"
                                                id="image-upload"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                multiple
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Upload Images (Multiple)
                                            </label>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Upload multiple images. Click the star icon to set thumbnail.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Active Status */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={galleryForm.isActive}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, isActive: e.target.checked })}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="isActive" className="text-sm text-gray-700">
                                            Active
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        onClick={() => setShowGalleryModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={galleryForm.id ? handleUpdateGallery : handleCreateGallery}
                                        disabled={!galleryForm.title || (galleryForm.existingImages.length === 0 && galleryForm.files.length === 0)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {galleryForm.id ? "Update" : "Create"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Modal */}
                {showCategoryModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {categoryForm.id ? "Edit Category" : "Add Category"}
                                    </h3>
                                    <button
                                        onClick={() => setShowCategoryModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={categoryForm.name}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter category name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={categoryForm.description}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter description"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="categoryActive"
                                            checked={categoryForm.isActive}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="categoryActive" className="text-sm text-gray-700">
                                            Active
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        onClick={() => setShowCategoryModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={categoryForm.id ? handleUpdateCategory : handleCreateCategory}
                                        disabled={!categoryForm.name}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {categoryForm.id ? "Update" : "Create"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && itemToDelete && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                    Confirm Delete
                                </h3>
                                <p className="text-gray-600 text-center mb-6">
                                    Are you sure you want to delete{" "}
                                    <span className="font-medium">
                    {"title" in itemToDelete ? `"${itemToDelete.title}"` : `"${itemToDelete.name}"`}
                  </span>
                                    ? This action cannot be undone.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setItemToDelete(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if ("title" in itemToDelete) {
                                                handleDeleteGallery();
                                            } else {
                                                handleDeleteCategory();
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}