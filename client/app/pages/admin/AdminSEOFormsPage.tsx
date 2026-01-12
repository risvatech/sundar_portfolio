'use client';

import { useState, useEffect } from 'react';
import SEOFormsService, { SEOForm } from '../../service/seoForms';
import {
    Search, Eye, Trash2, CheckCircle, Clock,
    AlertCircle, Archive, RefreshCw, Building2,
    User, Phone, Mail, DollarSign, ChevronLeft,
    ChevronRight, FileText, Users, TrendingUp,
    Target, IndianRupee, Calendar, Filter as FilterIcon,
    ChevronDown, X, ExternalLink
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const statuses = [
    { value: 'all', label: 'All Statuses', icon: FilterIcon, color: 'text-gray-500', bgColor: 'bg-gray-100' },
    { value: 'submitted', label: 'Submitted', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { value: 'reviewed', label: 'Reviewed', icon: AlertCircle, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { value: 'contacted', label: 'Contacted', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-100' },
    { value: 'converted', label: 'Converted', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' },
    { value: 'archived', label: 'Archived', icon: Archive, color: 'text-gray-500', bgColor: 'bg-gray-100' },
];

const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
    'Manufacturing', 'Real Estate', 'Hospitality', 'Legal',
    'Consulting', 'Marketing', 'Other'
];

export default function AdminSEOFormsPage() {
    const [forms, setForms] = useState<SEOForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        submitted: 0,
        reviewed: 0,
        contacted: 0,
        converted: 0
    });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [industryFilter, setIndustryFilter] = useState('all');
    const [countryFilter, setCountryFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 15;

    const [selectedForm, setSelectedForm] = useState<SEOForm | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [bulkAction, setBulkAction] = useState('');

    // Fetch forms
    const fetchForms = async (page: number = 1) => {
        try {
            setLoading(true);
            const params: any = {
                page,
                limit,
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(industryFilter !== 'all' && { industry: industryFilter }),
                ...(countryFilter !== 'all' && { country: countryFilter }),
                ...(search && { search }),
            };

            const response = await SEOFormsService.getAll(params);

            if (response.success) {
                setForms(response.data || []);
                if (response.pagination) {
                    setTotalPages(response.pagination.pages);
                    setTotalItems(response.pagination.total);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch forms');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await SEOFormsService.getStats();
            if (response.success) {
                const statsData = response.data;
                setStats({
                    total: statsData.total || 0,
                    submitted: statsData.byStatus?.find((s: any) => s.status === 'submitted')?.count || 0,
                    reviewed: statsData.byStatus?.find((s: any) => s.status === 'reviewed')?.count || 0,
                    contacted: statsData.byStatus?.find((s: any) => s.status === 'contacted')?.count || 0,
                    converted: statsData.byStatus?.find((s: any) => s.status === 'converted')?.count || 0
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        fetchForms(currentPage);
        fetchStats();
    }, [currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                fetchForms(1);
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, statusFilter, industryFilter, countryFilter]);

    // Handle actions
    const handleView = (form: SEOForm) => {
        setSelectedForm(form);
        setViewModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this form?')) return;

        try {
            const response = await SEOFormsService.delete(id);
            if (response.success) {
                toast.success('Form deleted successfully');
                fetchForms(currentPage);
                fetchStats();
            } else {
                toast.error(response.message || 'Failed to delete form');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete form');
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            const response = await SEOFormsService.updateStatus(id, status);
            if (response.success) {
                toast.success('Status updated successfully');
                fetchForms(currentPage);
                fetchStats();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    const handleRefresh = () => {
        fetchForms(currentPage);
        fetchStats();
        toast.success('Data refreshed');
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedRows.length === 0) {
            toast.error('Please select forms and an action');
            return;
        }

        try {
            for (const id of selectedRows) {
                await SEOFormsService.updateStatus(id, bulkAction);
            }
            toast.success(`Updated ${selectedRows.length} forms`);
            setSelectedRows([]);
            setBulkAction('');
            fetchForms(currentPage);
            fetchStats();
        } catch (error: any) {
            toast.error('Failed to perform bulk action');
        }
    };

    const toggleRowSelection = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === forms.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(forms.map(form => form.id));
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return { text: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500' };
            case 'reviewed': return { text: 'text-yellow-700', bg: 'bg-yellow-100', dot: 'bg-yellow-500' };
            case 'contacted': return { text: 'text-purple-700', bg: 'bg-purple-100', dot: 'bg-purple-500' };
            case 'converted': return { text: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' };
            case 'archived': return { text: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500' };
            default: return { text: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500' };
        }
    };

    // Stats cards data
    const statCards = [
        {
            title: 'Total Forms',
            value: stats.total,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Submitted',
            value: stats.submitted,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            title: 'Contacted',
            value: stats.contacted,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Converted',
            value: stats.converted,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">SEO Leads</h1>
                        <p className="text-gray-600 mt-1">Manage SEO consultation requests</p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg ${stat.bgColor} mr-3`}>
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                        <p className="text-sm text-gray-600">{stat.title}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <FilterIcon className="w-4 h-4" />
                                <span>Filters</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {statuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                                <select
                                    value={industryFilter}
                                    onChange={(e) => setIndustryFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Industries</option>
                                    {industries.map((industry) => (
                                        <option key={industry} value={industry}>
                                            {industry}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <select
                                    value={countryFilter}
                                    onChange={(e) => setCountryFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Countries</option>
                                    <option value="India">India</option>
                                    <option value="Other Country">Other Country</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bulk Actions */}
                {selectedRows.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900">{selectedRows.length} forms selected</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={bulkAction}
                                    onChange={(e) => setBulkAction(e.target.value)}
                                    className="px-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                                >
                                    <option value="">Select action</option>
                                    <option value="contacted">Mark as Contacted</option>
                                    <option value="reviewed">Mark as Reviewed</option>
                                    <option value="converted">Mark as Converted</option>
                                    <option value="archived">Archive Selected</option>
                                </select>

                                <button
                                    onClick={handleBulkAction}
                                    disabled={!bulkAction}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    Apply
                                </button>

                                <button
                                    onClick={() => setSelectedRows([])}
                                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Forms Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-4 py-3 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-900">SEO Consultation Requests</h2>
                        <p className="text-sm text-gray-600">{totalItems} total forms</p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                                <p className="text-gray-600">Loading forms...</p>
                            </div>
                        </div>
                    ) : forms.length === 0 ? (
                        <div className="p-8 text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <h3 className="font-medium text-gray-900 mb-2">No forms found</h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-4">
                                {search || statusFilter !== 'all' || industryFilter !== 'all'
                                    ? 'Try adjusting your filters or search terms'
                                    : 'No SEO consultation forms have been submitted yet'
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.length === forms.length && forms.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Industry
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Budget
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {forms.map((form) => {
                                        const statusColors = getStatusColor(form.status);
                                        return (
                                            <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(form.id)}
                                                        onChange={() => toggleRowSelection(form.id)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {form.companyName}
                                                            </div>
                                                            {form.websiteUrl && (
                                                                <a
                                                                    href={form.websiteUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-gray-500 hover:text-blue-600 truncate max-w-[200px] block"
                                                                >
                                                                    {form.websiteUrl}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <div className="font-medium text-sm">{form.contactPerson}</div>
                                                        <div className="text-xs text-gray-600">{form.email}</div>
                                                        <div className="text-xs text-gray-600">{form.phone}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                        <span className="text-sm text-gray-700">
                                                            {form.industry || 'N/A'}
                                                        </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        {form.country === 'India' ? (
                                                            <IndianRupee className="w-3 h-3 text-yellow-600 mr-1" />
                                                        ) : (
                                                            <DollarSign className="w-3 h-3 text-green-600 mr-1" />
                                                        )}
                                                        <span className="font-medium text-sm">
                                                                {form.monthlyBudget || 'Not specified'}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={form.status}
                                                        onChange={(e) => handleStatusUpdate(form.id, e.target.value)}
                                                        className={`px-2 py-1 text-xs font-medium rounded ${statusColors.bg} ${statusColors.text} border-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
                                                    >
                                                        {statuses.filter(s => s.value !== 'all').map((status) => (
                                                            <option key={status.value} value={status.value}>
                                                                {status.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-900">{formatDate(form.createdAt)}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleView(form)}
                                                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(form.id)}
                                                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(currentPage * limit, totalItems)}</span> of{' '}
                                    <span className="font-medium">{totalItems}</span> results
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-2.5 py-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-3 py-1.5 mx-0.5 min-w-[36px] rounded ${
                                                        currentPage === pageNum
                                                            ? 'bg-blue-600 text-white'
                                                            : 'border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-2.5 py-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {viewModalOpen && selectedForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
                                    <p className="text-gray-600 text-sm">Submitted on {formatDateTime(selectedForm.createdAt)}</p>
                                </div>
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                                            Company Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-xs text-gray-600">Company Name</label>
                                                <p className="font-medium">{selectedForm.companyName}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-gray-600">Industry</label>
                                                    <p className="font-medium">{selectedForm.industry || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-600">Country</label>
                                                    <p className="font-medium">{selectedForm.country || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600">Website</label>
                                                {selectedForm.websiteUrl ? (
                                                    <a
                                                        href={selectedForm.websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                                    >
                                                        {selectedForm.websiteUrl}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <p className="font-medium">N/A</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <User className="w-4 h-4 text-green-600 mr-2" />
                                            Contact Details
                                        </h3>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-xs text-gray-600">Contact Person</label>
                                                <p className="font-medium">{selectedForm.contactPerson}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600">Email</label>
                                                <p className="font-medium">{selectedForm.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600">Phone</label>
                                                <p className="font-medium">{selectedForm.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Target className="w-4 h-4 text-purple-600 mr-2" />
                                            SEO Requirements
                                        </h3>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-xs text-gray-600">Monthly Budget</label>
                                                <p className="font-medium">
                                                    {selectedForm.country === 'India' ? '₹' : '$'}{' '}
                                                    {selectedForm.monthlyBudget || 'Not specified'}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-gray-600">Target Locations</label>
                                                    <p className="font-medium">{selectedForm.targetLocations || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-600">Service Area</label>
                                                    <p className="font-medium">{selectedForm.serviceArea || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600">Keywords</label>
                                                <p className="font-medium">{selectedForm.keywordsList || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Additional Info</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-xs text-gray-600">Current SEO Status</label>
                                                <p className="font-medium">{selectedForm.currentSeoStatus || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600">Goals</label>
                                                <p className="font-medium">{selectedForm.goals || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}