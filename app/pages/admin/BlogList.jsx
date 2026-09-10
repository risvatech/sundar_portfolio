"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Folder, Tag, Eye, Edit, Trash2 } from "lucide-react";
import api from "../../service/api";
import { useApiMutation } from "../../hooks/useApiMutation";
import toast from "react-hot-toast";
import { Button } from "@/app/components/ui/button";

const formatTagsForDisplay = (tags) => {
    if (!tags) return "";

    if (Array.isArray(tags)) {
        return tags.filter((tag) => typeof tag === "string").join(", ");
    }

    if (typeof tags === "string") {
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) {
                return parsed.filter((tag) => typeof tag === "string").join(", ");
            }
            return tags;
        } catch {
            return tags;
        }
    }

    return "";
};

export default function BlogList({ onEditPost, refreshTrigger }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        draft: 0,
    });

    // Delete post mutation
    const deletePostMutation = useApiMutation({
        url: (id) => `/blog/delete/${id}`,
        method: "delete",
        onSuccessExtra: (data, variables) => {
            // Remove the deleted post from the list
            const postId = variables;
            const deletedPost = posts.find((p) => p.id === postId);

            setPosts((prev) => prev.filter((post) => post.id !== postId));
            setStats((prev) => ({
                total: prev.total - 1,
                published:
                    deletedPost?.status === "published"
                        ? prev.published - 1
                        : prev.published,
                draft: deletedPost?.status === "draft" ? prev.draft - 1 : prev.draft,
            }));

            toast.success("Blog deleted successfully!");
        },
        onErrorExtra: (error) => {
            console.error("Delete error:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to delete blog";
            toast.error(errorMessage);
        },
    });

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/blog/get");

            // Handle different response formats
            let postsData = [];
            if (res.data?.success && res.data.data) {
                postsData = res.data.data;
            } else if (Array.isArray(res.data)) {
                postsData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                postsData = res.data.data;
            }

            setPosts(postsData);

            // Calculate stats
            const total = postsData.length;
            const published = postsData.filter(
                (p) => p.status === "published",
            ).length;
            const draft = postsData.filter((p) => p.status === "draft").length;
            setStats({ total, published, draft });
        } catch (err) {
            console.error("Error fetching blogs", err);
            toast.error("Failed to load blogs");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm("Delete this blog permanently?")) return;
        try {
            await deletePostMutation.mutateAsync(id);
        } catch (err) {
            // Error is handled by the mutation's onErrorExtra
            console.error("Delete blog error:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [refreshTrigger]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-center text-gray-600 mt-4">Loading blogs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-800">
                                {stats.total}
                            </div>
                            <div className="text-sm text-gray-600">Total Blogs</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.published}
                            </div>
                            <div className="text-sm text-green-600">Published</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.draft}
                            </div>
                            <div className="text-sm text-yellow-600">Drafts</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Your Blog Posts</h2>
                    <p className="text-gray-600">Manage your existing blog posts</p>
                </div>
                <div className="p-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No blog posts yet. Create your first blog post!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {post.title}
                                                </h3>
                                                <div className="flex items-center gap-2">
                          <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  post.status === "published"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {post.status}
                          </span>
                                                    <button
                                                        onClick={() => {
                                                            window.open(`/blog/${post.slug}`, "_blank");
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                        title="Preview"
                                                        disabled={deletePostMutation.isPending}
                                                    >
                                                        <Eye size={16} className="text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {post.description && (
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {post.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-4 text-gray-500 text-xs mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>
                            Created:{" "}
                                                        {new Date(
                                                            post.createdAt || post.created_at,
                                                        ).toLocaleDateString()}
                          </span>
                                                </div>
                                                {post.categoryName && (
                                                    <div className="flex items-center gap-1">
                                                        <Folder size={14} />
                                                        <span>{post.categoryName}</span>
                                                    </div>
                                                )}
                                                {post.tags && (
                                                    <div className="flex items-center gap-1">
                                                        <Tag size={14} />
                                                        <span>{formatTagsForDisplay(post.tags)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-400 font-mono">
                                                /blog/{post.slug}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 lg:flex-col">
                                            <Button
                                                onClick={() => onEditPost(post)}
                                                // className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                disabled={deletePostMutation.isPending}
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="flex items-center gap-2 px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={deletePostMutation.isPending}
                                            >
                                                {deletePostMutation.isPending &&
                                                deletePostMutation.variables === post.id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
