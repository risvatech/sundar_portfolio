"use client";
import React, { useState, useEffect } from "react";
import BlogList from "./BlogList";
import AddEditBlog from "./AddEditBlog";
import api from "../../service/api";

interface Category {
  id: number;
  name: string;
  customData?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published" | "archived";
  coverImage?: string;
  description?: string;
  tags?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  categoryId?: number | null;
  category?: {
    id: number;
    name: string;
  } | null;
  customData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/blog/categories/get/all");

      // Handle different response formats
      let data = [];
      if (res.data?.success && res.data.data) {
        data = res.data.data;
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      }

      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    setRefreshTrigger(!refreshTrigger);
    setShowAddForm(false);
    setEditingPost(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-3 md:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
               Blog Management
            </h1>
            <p className="text-gray-600">
              Create, edit, and manage your blog posts
            </p>
          </div>
          {!showAddForm && !editingPost && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Create New Post
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingPost) && (
          <div className="mb-8">
            <AddEditBlog
              postToEdit={editingPost}
              categories={categories}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Blog List */}
        {(!showAddForm && !editingPost) || editingPost ? (
          <BlogList
            onEditPost={handleEditPost}
            refreshTrigger={refreshTrigger}
          />
        ) : null}
      </div>
    </div>
  );
}
