"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Tag,
  Hash,
  FileText,
  Folder,
  X,
  Send,
} from "lucide-react";

import api from "../../service/api";
import DOMPurify from "dompurify";
import RichTextEditor from "@/app/editor/richTextEditor";
import { useApiMutation } from "@/app/hooks/useApiMutation";
import toast from "react-hot-toast";

// Helper function for image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder-blog.jpg";

  // If it's already a full URL, return as-is
  if (imagePath.startsWith("http")) return imagePath;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://www.risva.app/api";

  // Clean the path - remove leading slash if present
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  // Return full URL with the path
  return `${baseUrl}/${cleanPath}`;
};

const parseTags = (tags) => {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags.filter((tag) => typeof tag === "string");
  }

  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        return parsed.filter((tag) => typeof tag === "string");
      }
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    } catch {
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }
  }

  return [];
};

export default function AddEditBlog({
  postToEdit,
  categories,
  onSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft",
    coverImage: null,
    description: "",
    tags: [],
    tagInput: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    categoryId: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [slugError, setSlugError] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const slugCheckTimeout = useRef(null);
  const [editorKey, setEditorKey] = useState(Date.now());

  // Use ref for file input to avoid document.getElementById during SSR
  const fileInputRef = useRef(null);

  // Set up mutations using useApiMutation
  const createPostMutation = useApiMutation({
    url: "/blog/create",
    method: "post",
    onSuccessExtra: () => {
      resetForm();
      if (onSuccess) onSuccess();
      toast.success("Blog created successfully!");
    },
    onErrorExtra: (error) => {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Failed to create blog";
      toast.error(errorMessage);
    },
  });

  // FIX: Use function URL with id parameter for update
  const updatePostMutation = useApiMutation({
    url: (id) => `/blog/update/${id}`,
    method: "put",
    onSuccessExtra: () => {
      resetForm();
      if (onSuccess) onSuccess();
      toast.success("Blog updated successfully!");
    },
    onErrorExtra: (error) => {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Failed to update blog";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (postToEdit) {
      const tagsArray = parseTags(postToEdit.tags);

      setFormData({
        title: postToEdit.title || "",
        slug: postToEdit.slug || "",
        content: postToEdit.content || "",
        status: postToEdit.status || "draft",
        coverImage: postToEdit.coverImage || null,
        description: postToEdit.description || "",
        tags: tagsArray,
        tagInput: "",
        metaTitle: postToEdit.metaTitle || "",
        metaKeywords: postToEdit.metaKeywords || "",
        metaDescription: postToEdit.metaDescription || "",
        categoryId: postToEdit.categoryId?.toString() || "",
      });

      // Use getImageUrl for existing cover images from database
      if (postToEdit.coverImage) {
        setImagePreview(getImageUrl(postToEdit.coverImage));
      } else {
        setImagePreview(null);
      }

      // Update editor key to force re-render with new content
      setEditorKey(Date.now());
    }
  }, [postToEdit]);

  const generateSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .trim();
  };

  const debounceCheckSlug = (slug) => {
    if (slugCheckTimeout.current) clearTimeout(slugCheckTimeout.current);
    slugCheckTimeout.current = setTimeout(() => {
      checkSlugUniqueness(slug);
    }, 500);
  };

  const checkSlugUniqueness = async (slug) => {
    if (!slug) {
      setSlugError("");
      return;
    }
    if (postToEdit && postToEdit.slug === slug) {
      setSlugError("");
      return;
    }

    try {
      const res = await api.get(
        `/blog/check-slug?slug=${encodeURIComponent(slug)}`,
      );
      if (res.data?.data?.exists === true) {
        setSlugError("This URL is already in use.");
      } else {
        setSlugError("");
      }
    } catch {
      setSlugError("Error checking slug");
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((p) => ({ ...p, title }));

    // Only auto-generate slug if user hasn't manually edited it
    if (!isSlugManuallyEdited) {
      const newSlug = generateSlug(title);
      setFormData((p) => ({ ...p, slug: newSlug }));

      // Check slug uniqueness (debounced)
      if (newSlug) {
        debounceCheckSlug(newSlug);
      } else {
        setSlugError("");
      }
    }
  };

  const handleSlugChange = (e) => {
    const raw = e.target.value;
    const slug = generateSlug(raw);
    setFormData((p) => ({ ...p, slug }));
    setIsSlugManuallyEdited(true);
    debounceCheckSlug(slug);
  };

  const handleTagInput = (e) => {
    setFormData((p) => ({ ...p, tagInput: e.target.value }));
  };

  const addTag = () => {
    const tag = formData.tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((p) => ({
        ...p,
        tags: [...p.tags, tag],
        tagInput: "",
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((p) => ({
      ...p,
      tags: p.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setFormData((p) => ({ ...p, coverImage: file }));
  };

  const handleContentChange = (content) => {
    setFormData((p) => ({ ...p, content }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      status: "draft",
      coverImage: null,
      description: "",
      tags: [],
      tagInput: "",
      metaTitle: "",
      metaKeywords: "",
      metaDescription: "",
      categoryId: "",
    });
    setImagePreview(null);
    setSlugError("");
    setIsSlugManuallyEdited(false);
    setEditorKey(Date.now());
    if (onCancel) onCancel();
  };

  const handleSubmit = async (status) => {
    if (slugError) {
      toast.error("Fix slug error before submitting");
      return;
    }
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("All required fields must be filled");
      return;
    }

    setIsLoading(true);

    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title.trim());
    formDataToSend.append("content", formData.content.trim());
    formDataToSend.append("status", status);

    if (formData.categoryId) {
      formDataToSend.append("categoryId", formData.categoryId.toString());
    }
    if (formData.description) {
      formDataToSend.append("description", formData.description.trim());
    }

    // Always send tags - even if empty, send an empty string
    const tagsString = formData.tags.length > 0 ? formData.tags.join(", ") : "";
    formDataToSend.append("tags", tagsString);

    if (formData.metaTitle) {
      formDataToSend.append("metaTitle", formData.metaTitle.trim());
    }
    if (formData.metaKeywords) {
      formDataToSend.append("metaKeywords", formData.metaKeywords.trim());
    }
    if (formData.metaDescription) {
      formDataToSend.append("metaDescription", formData.metaDescription.trim());
    }

    // Handle cover image
    if (formData.coverImage instanceof File) {
      formDataToSend.append("coverImage", formData.coverImage);
    }

    // Handle removing cover image for edit
    if (postToEdit && postToEdit.coverImage && !formData.coverImage) {
      formDataToSend.append("removeCoverImage", "true");
    }

    try {
      if (postToEdit) {
        // ✅ FIX: Send the FormData directly, not nested
        // The hook will use the URL function (id) => `/blog/update/${id}`
        // and the id is extracted from the first argument
        await updatePostMutation.mutateAsync({
          id: postToEdit.id,
          ...Object.fromEntries(formDataToSend), // ❌ This converts FormData to JSON - WRONG for file uploads!
        });
      } else {
        await createPostMutation.mutateAsync(formDataToSend);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image button click using ref
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isPending =
    createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {postToEdit ? "Edit Post" : "Create New Post"}
            </h2>
            <p className="text-gray-600">Write and manage your content</p>
          </div>
          <button
            onClick={() => setShowPreview((s) => !s)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-charcoal bg-graphite transition-colors"
            disabled={isPending}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>
      <div className="p-6">
        {!showPreview ? (
          <div className="space-y-6 text-secondary">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter post title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={isPending}
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Slug *
              </label>
              <div className="relative">
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="post-url-slug"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-24 ${
                    slugError ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isPending}
                />
                {formData.slug && (
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${
                      slugError ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {slugError ? "Not available" : "Available"}
                  </span>
                )}
              </div>
              {slugError && (
                <p className="text-red-500 text-sm mt-1">{slugError}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={formData.categoryId || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    categoryId: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={isPending}
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      id="tags"
                      type="text"
                      value={formData.tagInput}
                      onChange={handleTagInput}
                      onKeyDown={handleTagKeyPress}
                      placeholder="Type tag and press Enter or comma..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      disabled={isPending}
                    />
                    <Tag
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isPending}
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        <Hash size={12} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                          disabled={isPending}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleImageButtonClick}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isPending}
                  >
                    Choose Image
                  </button>
                  <input
                    ref={fileInputRef}
                    id="coverImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isPending}
                  />
                  {formData.coverImage && (
                    <span className="text-sm text-gray-600 truncate">
                      {formData.coverImage instanceof File
                        ? formData.coverImage.name
                        : "Image selected"}
                    </span>
                  )}
                </div>
                {imagePreview && (
                  <div className="relative w-full max-w-md">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        console.error("Preview image failed to load");
                        e.target.src = "/placeholder-blog.jpg";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((p) => ({ ...p, coverImage: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      disabled={isPending}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description / Excerpt
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Brief description of your post..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                disabled={isPending}
              />
            </div>

            {/* SEO Meta Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="metaTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    Meta Title
                  </div>
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, metaTitle: e.target.value }))
                  }
                  placeholder="Meta title for SEO (50-60 characters ideal)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  disabled={isPending}
                />
              </div>
              <div>
                <label
                  htmlFor="metaDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    Meta Description
                  </div>
                </label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      metaDescription: e.target.value,
                    }))
                  }
                  placeholder="Meta description for SEO (155-160 characters ideal)"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  disabled={isPending}
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="metaKeywords"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    Meta Keywords
                  </div>
                </label>
                <textarea
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, metaKeywords: e.target.value }))
                  }
                  placeholder="Comma-separated keywords for SEO"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <div>
                <RichTextEditor
                  key={editorKey}
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your blog post content..."
                />
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Use the toolbar above to format your content.
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={isPending}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => handleSubmit("draft")}
                disabled={isLoading || isPending}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save size={18} />
                {isLoading || isPending
                  ? "Saving..."
                  : postToEdit
                    ? "Update Draft"
                    : "Save Draft"}
              </button>
              <button
                onClick={() => handleSubmit("published")}
                disabled={isLoading || isPending}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
                {isLoading || isPending
                  ? "Publishing..."
                  : postToEdit
                    ? "Update & Publish"
                    : "Publish Post"}
              </button>
              {(postToEdit || onCancel) && (
                <button
                  onClick={resetForm}
                  disabled={isLoading || isPending}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          // Preview section
          <div className="prose max-w-none">
            <h1 className="text-3xl mb-4">{formData.title}</h1>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              {formData.categoryId && (
                <div className="flex items-center gap-1">
                  <Folder size={14} />
                  <span>
                    {
                      categories.find(
                        (c) => c.id.toString() === formData.categoryId,
                      )?.name
                    }
                  </span>
                </div>
              )}
              {formData.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={14} />
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="cover"
                className="w-full h-64 object-cover rounded-lg mb-6 border border-gray-300"
                onError={(e) => {
                  console.error("Preview image failed to load");
                  e.target.src = "/placeholder-blog.jpg";
                }}
              />
            )}

            {formData.description && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-gray-700 italic">{formData.description}</p>
              </div>
            )}

            <div
              className="mt-4"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(formData.content, {
                  ADD_TAGS: [
                    "ul",
                    "ol",
                    "li",
                    "a",
                    "img",
                    "h1",
                    "h2",
                    "h3",
                    "span",
                  ],
                  ADD_ATTR: ["style", "href", "target", "src", "alt"],
                }),
              }}
            />

            {/* SEO Preview */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">SEO Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-blue-600 text-sm mb-1">
                  example.com/blog/{formData.slug}
                </div>
                <div className="text-lg text-gray-900 font-medium mb-1">
                  {formData.metaTitle || formData.title}
                </div>
                <div className="text-gray-600 text-sm">
                  {formData.metaDescription || formData.description}
                </div>
                {formData.metaKeywords && (
                  <div className="text-gray-500 text-xs mt-2">
                    Keywords: {formData.metaKeywords}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
