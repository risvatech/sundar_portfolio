"use client"

import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
    Search,
    Filter,
    Download,
    RefreshCw,
    Eye,
    Trash2,
    Calendar,
    Mail,
    Phone,
    CheckCircle,
    Clock,
    XCircle,
    User,
    Building,
    FileText,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/app/hooks/use-toast";
import api from "../../service/api";
import { format } from "date-fns";

// Types - Complete interface matching your schema
interface ConsultationRequest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    businessType?: string;
    industry?: string;
    businessSize?: string;
    annualRevenue?: string;
    consultationType: string;
    preferredDate?: string;
    preferredTime?: string;
    timezone?: string;
    projectDescription?: string;
    mainChallenges?: string;
    goals?: string;
    budgetRange?: string;
    timeline?: string;
    referralSource?: string;
    referralDetails?: string;
    additionalInfo?: string;
    hearAboutUs?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    isFollowedUp: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface Stats {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
}

// API Response types
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    pagination?: PaginationMeta;
    error?: string;
}

interface ConsultationsResponse extends ApiResponse<ConsultationRequest[]> {
    pagination: PaginationMeta;
}

interface StatsResponse extends ApiResponse<{
    stats: Stats;
    recent: ConsultationRequest[];
}> {}

export default function ConsultationAdmin() {
    const { toast } = useToast();
    const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Pagination
    const [pagination, setPagination] = useState<PaginationMeta>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
    });

    // Status update
    const [updateStatus, setUpdateStatus] = useState("");
    const [updateNotes, setUpdateNotes] = useState("");

    // Helper function to handle API responses
    const handleApiResponse = <T,>(response: any): T => {
        // If response is already in our ApiResponse format, return it
        if (response && typeof response === 'object' && 'success' in response) {
            return response as T;
        }

        // If response is Axios response, extract data
        if (response && response.data) {
            return response.data as T;
        }

        // Fallback
        return response as T;
    };

    // Fetch consultations
    const fetchConsultations = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', pagination.page.toString());
            params.append('limit', pagination.limit.toString());
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (searchTerm) params.append('search', searchTerm);

            const response = await api.get(`/admin/consultations?${params.toString()}`);
            const result: ConsultationsResponse = handleApiResponse<ConsultationsResponse>(response);

            console.log('Consultations API Response:', result);

            if (result.success && result.data) {
                setConsultations(result.data);
                if (result.pagination) {
                    setPagination(result.pagination);
                }
            } else {
                setConsultations([]);
                toast({
                    title: "Error",
                    description: result.message || "Failed to load consultations",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            console.error("Fetch consultations error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to fetch consultations",
                variant: "destructive"
            });
            setConsultations([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/consultations/stats');
            const result: StatsResponse = handleApiResponse<StatsResponse>(response);

            console.log('Stats API Response:', result);

            if (result.success && result.data) {
                setStats(result.data.stats);
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to load statistics",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            console.error("Failed to fetch stats:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to fetch statistics",
                variant: "destructive"
            });
        }
    };

    // Initial load
    useEffect(() => {
        fetchConsultations();
        fetchStats();
    }, [pagination.page, statusFilter]);

    // Handle search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm || statusFilter !== 'all') {
                fetchConsultations();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter]);

    // View consultation details
    const viewConsultation = (consultation: ConsultationRequest) => {
        setSelectedConsultation(consultation);
        setUpdateStatus(consultation.status);
        setUpdateNotes(consultation.notes || "");
        setViewMode('detail');
    };

    // Update consultation status
    const handleUpdateStatus = async () => {
        if (!selectedConsultation) return;

        try {
            const response = await api.patch(`/admin/consultations/${selectedConsultation.id}`, {
                status: updateStatus,
                notes: updateNotes
            });

            const result: ApiResponse<ConsultationRequest> = handleApiResponse<ApiResponse<ConsultationRequest>>(response);

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message || "Consultation updated successfully"
                });

                // Update local state
                const updatedConsultations = consultations.map(c =>
                    c.id === selectedConsultation.id
                        ? { ...c, status: updateStatus as any, notes: updateNotes }
                        : c
                );
                setConsultations(updatedConsultations);

                // Update selected consultation
                setSelectedConsultation({
                    ...selectedConsultation,
                    status: updateStatus as any,
                    notes: updateNotes
                });

                // Refresh stats
                fetchStats();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to update consultation",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update consultation",
                variant: "destructive"
            });
        }
    };

    // Delete consultation
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this consultation request?")) return;

        try {
            const response = await api.delete(`/admin/consultations/${id}`);
            const result: ApiResponse = handleApiResponse<ApiResponse>(response);

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message || "Consultation deleted successfully"
                });

                // Remove from local state
                setConsultations(consultations.filter(c => c.id !== id));

                // Refresh stats
                fetchStats();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete consultation",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete consultation",
                variant: "destructive"
            });
        }
    };

    // Toggle follow-up status
    const toggleFollowUp = async (id: number, currentStatus: boolean) => {
        try {
            const response = await api.patch(`/admin/consultations/${id}`, {
                isFollowedUp: !currentStatus
            });

            const result: ApiResponse<ConsultationRequest> = handleApiResponse<ApiResponse<ConsultationRequest>>(response);

            if (result.success) {
                // Update local state
                const updatedConsultations = consultations.map(c =>
                    c.id === id ? { ...c, isFollowedUp: !currentStatus } : c
                );
                setConsultations(updatedConsultations);

                if (selectedConsultation?.id === id) {
                    setSelectedConsultation({
                        ...selectedConsultation,
                        isFollowedUp: !currentStatus
                    });
                }
            }
        } catch (error) {
            console.error("Failed to toggle follow-up:", error);
        }
    };

    // Export data
    const handleExport = () => {
        if (!consultations.length) {
            toast({
                title: "Info",
                description: "No data to export",
                variant: "default"
            });
            return;
        }

        try {
            const csvContent = "data:text/csv;charset=utf-8,"
                + "ID,Name,Email,Phone,Company,Consultation Type,Status,Created At\n"
                + consultations.map(c =>
                    `${c.id},"${c.firstName} ${c.lastName}",${c.email},${c.phone || ''},"${c.company || ''}",${c.consultationType},${c.status},${new Date(c.createdAt).toLocaleDateString()}`
                ).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `consultations_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Success",
                description: "Data exported successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to export data",
                variant: "destructive"
            });
        }
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => {
        const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
            pending: { variant: "secondary", icon: Clock },
            confirmed: { variant: "default", icon: CheckCircle },
            completed: { variant: "default", icon: CheckCircle },
            cancelled: { variant: "destructive", icon: XCircle }
        };

        const { variant, icon: Icon } = config[status] || { variant: "outline", icon: Clock };

        return (
            <Badge variant={variant} className="gap-1">
                <Icon size={12} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    // Main content - List view
    const renderListView = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">{stats.total}</CardTitle>
                        <CardDescription>Total Requests</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">{stats.pending}</CardTitle>
                        <CardDescription>Pending</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">{stats.confirmed}</CardTitle>
                        <CardDescription>Confirmed</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">{stats.completed}</CardTitle>
                        <CardDescription>Completed</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">{stats.cancelled}</CardTitle>
                        <CardDescription>Cancelled</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                            <Button variant="outline" onClick={fetchConsultations}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Consultation Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Consultation Requests</CardTitle>
                    <CardDescription>
                        Showing {consultations.length} of {pagination.total} requests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">Loading consultations...</p>
                        </div>
                    ) : !consultations.length ? (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No consultations found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                                    <div className="col-span-2">Name</div>
                                    <div className="col-span-3">Contact</div>
                                    <div className="col-span-2">Company</div>
                                    <div className="col-span-2">Type</div>
                                    <div className="col-span-1">Status</div>
                                    <div className="col-span-2">Actions</div>
                                </div>
                                <div className="divide-y">
                                    {consultations.map((consultation) => (
                                        <div key={consultation.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50">
                                            <div className="col-span-2">
                                                <div className="font-medium">{consultation.firstName} {consultation.lastName}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {format(new Date(consultation.createdAt), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                            <div className="col-span-3">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={12} className="text-muted-foreground" />
                                                    <span className="text-sm">{consultation.email}</span>
                                                </div>
                                                {consultation.phone && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Phone size={12} className="text-muted-foreground" />
                                                        <span className="text-sm">{consultation.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <Building size={12} className="text-muted-foreground" />
                                                    <span className="text-sm">{consultation.company || 'N/A'}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {consultation.jobTitle || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-sm">{consultation.consultationType}</div>
                                                {consultation.preferredDate && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Calendar size={10} className="text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            {format(new Date(consultation.preferredDate), 'MMM d')}
                                                            {consultation.preferredTime && `, ${consultation.preferredTime}`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-1">
                                                <StatusBadge status={consultation.status} />
                                                {consultation.isFollowedUp && (
                                                    <Badge variant="outline" className="mt-1 text-xs">Followed Up</Badge>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => viewConsultation(consultation)}
                                                    >
                                                        <Eye size={14} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => toggleFollowUp(consultation.id, consultation.isFollowedUp)}
                                                    >
                                                        {consultation.isFollowedUp ? '✓' : '○'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(consultation.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                            disabled={pagination.page === 1}
                                        >
                                            <ChevronLeft size={16} />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                                            disabled={pagination.page === pagination.totalPages}
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </>
    );

    // Detail view
    const renderDetailView = () => {
        if (!selectedConsultation) return null;

        return (
            <>
                {/* Back button */}
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => setViewMode('list')}>
                        <ChevronLeft size={16} />
                        Back to List
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User size={20} />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                        <p className="font-medium">{selectedConsultation.firstName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                        <p className="font-medium">{selectedConsultation.lastName}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <p className="font-medium">{selectedConsultation.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                        <p className="font-medium">{selectedConsultation.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Company</label>
                                        <p className="font-medium">{selectedConsultation.company || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                                        <p className="font-medium">{selectedConsultation.jobTitle || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building size={20} />
                                    Business Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                                        <p className="font-medium">{selectedConsultation.businessType || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Industry</label>
                                        <p className="font-medium">{selectedConsultation.industry || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Business Size</label>
                                        <p className="font-medium">{selectedConsultation.businessSize || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Annual Revenue</label>
                                        <p className="font-medium">{selectedConsultation.annualRevenue || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Details - Now includes all fields */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText size={20} />
                                    Project Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedConsultation.projectDescription && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Project Description</label>
                                        <p className="mt-1 whitespace-pre-line">{selectedConsultation.projectDescription}</p>
                                    </div>
                                )}
                                {selectedConsultation.mainChallenges && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Main Challenges</label>
                                        <p className="mt-1 whitespace-pre-line">{selectedConsultation.mainChallenges}</p>
                                    </div>
                                )}
                                {selectedConsultation.goals && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Goals</label>
                                        <p className="mt-1 whitespace-pre-line">{selectedConsultation.goals}</p>
                                    </div>
                                )}
                                {selectedConsultation.budgetRange && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Budget Range</label>
                                        <p className="font-medium">{selectedConsultation.budgetRange}</p>
                                    </div>
                                )}
                                {selectedConsultation.timeline && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Timeline</label>
                                        <p className="font-medium">{selectedConsultation.timeline}</p>
                                    </div>
                                )}
                                {selectedConsultation.hearAboutUs && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">How did you hear about us?</label>
                                        <p className="mt-1 whitespace-pre-line">{selectedConsultation.hearAboutUs}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column - Actions & Status */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status & Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Current Status</label>
                                    <div className="flex items-center gap-2 mb-4">
                                        <StatusBadge status={selectedConsultation.status} />
                                        {selectedConsultation.isFollowedUp && (
                                            <Badge variant="outline">Followed Up</Badge>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Update Status</label>
                                    <Select value={updateStatus} onValueChange={setUpdateStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Notes</label>
                                    <textarea
                                        className="w-full min-h-[100px] p-2 border rounded"
                                        value={updateNotes}
                                        onChange={(e) => setUpdateNotes(e.target.value)}
                                        placeholder="Add notes about this consultation..."
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={handleUpdateStatus} className="flex-1">
                                        Update Status
                                    </Button>
                                    <Button
                                        variant={selectedConsultation.isFollowedUp ? "default" : "outline"}
                                        onClick={() => toggleFollowUp(selectedConsultation.id, selectedConsultation.isFollowedUp)}
                                    >
                                        {selectedConsultation.isFollowedUp ? 'Followed Up ✓' : 'Mark as Followed Up'}
                                    </Button>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => handleDelete(selectedConsultation.id)}
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Delete Consultation
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consultation Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Consultation Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Consultation Type</label>
                                    <p className="font-medium">{selectedConsultation.consultationType}</p>
                                </div>

                                {selectedConsultation.preferredDate && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Preferred Date & Time</label>
                                        <p className="font-medium">
                                            {format(new Date(selectedConsultation.preferredDate), 'PPP')}
                                            {selectedConsultation.preferredTime && ` at ${selectedConsultation.preferredTime}`}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Timezone</label>
                                    <p className="font-medium">{selectedConsultation.timezone || 'Not specified'}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Submitted On</label>
                                    <p className="font-medium">{format(new Date(selectedConsultation.createdAt), 'PPP p')}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                    <p className="font-medium">{format(new Date(selectedConsultation.updatedAt), 'PPP p')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    };

    return (
            <div className="container-wide py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Consultation Requests Admin</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and track all consultation requests
                    </p>
                </div>

                {viewMode === 'list' ? renderListView() : renderDetailView()}
            </div>
    );
}