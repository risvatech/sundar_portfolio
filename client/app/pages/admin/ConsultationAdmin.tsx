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
    Mail,
    Phone,
    CheckCircle,
    Clock,
    XCircle,
    User,
    Building,
    FileText,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Briefcase,
    MoreVertical,
    Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/app/hooks/use-toast";
import api from "../../service/api";
import { format } from "date-fns";

// Types - Updated interface matching the simplified schema
interface ConsultationRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    title: string;
    location: string;
    serviceType: string;
    description: string;
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

    // Mobile menu state
    const [mobileActionMenu, setMobileActionMenu] = useState<number | null>(null);

    // Helper function to handle API responses
    const handleApiResponse = <T,>(response: any): T => {
        if (response && typeof response === 'object' && 'success' in response) {
            return response as T;
        }
        if (response && response.data) {
            return response.data as T;
        }
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
        setMobileActionMenu(null);
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

                const updatedConsultations = consultations.map(c =>
                    c.id === selectedConsultation.id
                        ? { ...c, status: updateStatus as any, notes: updateNotes }
                        : c
                );
                setConsultations(updatedConsultations);

                setSelectedConsultation({
                    ...selectedConsultation,
                    status: updateStatus as any,
                    notes: updateNotes
                });

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

                setConsultations(consultations.filter(c => c.id !== id));
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
                + "ID,Name,Email,Phone,Company,Title,Location,Service Type,Status,Created At\n"
                + consultations.map(c =>
                    `${c.id},"${c.name}",${c.email},${c.phone},"${c.company}","${c.title}","${c.location}",${c.serviceType},${c.status},${new Date(c.createdAt).toLocaleDateString()}`
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
            <Badge variant={variant} className="gap-1 text-xs md:text-sm">
                <Icon size={10} className="md:size-3" />
                <span className="hidden sm:inline">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                <span className="sm:hidden">{status.charAt(0).toUpperCase()}</span>
            </Badge>
        );
    };

    // Format service type for display
    const formatServiceType = (type: string) => {
        return type
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Mobile responsive table row
    const MobileTableRow = ({ consultation }: { consultation: ConsultationRequest }) => (
        <div className="p-4 border-b space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium">{consultation.name}</div>
                    <div className="text-xs text-muted-foreground">
                        {format(new Date(consultation.createdAt), 'MMM d, yyyy')}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={consultation.status} />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setMobileActionMenu(mobileActionMenu === consultation.id ? null : consultation.id)}
                    >
                        <MoreVertical size={16} />
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Mail size={12} className="text-muted-foreground" />
                    <span className="text-sm truncate">{consultation.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={12} className="text-muted-foreground" />
                    <span className="text-sm">{consultation.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Building size={12} className="text-muted-foreground" />
                    <span className="text-sm truncate">{consultation.company}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-muted-foreground" />
                    <span className="text-sm truncate">{consultation.location}</span>
                </div>
            </div>

            {mobileActionMenu === consultation.id && (
                <div className="flex gap-2 pt-2 border-t">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => viewConsultation(consultation)}
                    >
                        <Eye size={14} className="mr-1" />
                        View
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => toggleFollowUp(consultation.id, consultation.isFollowedUp)}
                    >
                        {consultation.isFollowedUp ? 'Followed ✓' : 'Follow Up'}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 text-destructive"
                        onClick={() => handleDelete(consultation.id)}
                    >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                    </Button>
                </div>
            )}
        </div>
    );

    // Main content - List view
    const renderListView = () => (
        <>
            {/* Stats Cards - Responsive */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
                {[
                    { value: stats.total, label: "Total", color: "bg-blue-100 dark:bg-blue-900/20" },
                    { value: stats.pending, label: "Pending", color: "bg-yellow-100 dark:bg-yellow-900/20" },
                    { value: stats.confirmed, label: "Confirmed", color: "bg-green-100 dark:bg-green-900/20" },
                    { value: stats.completed, label: "Completed", color: "bg-purple-100 dark:bg-purple-900/20" },
                    { value: stats.cancelled, label: "Cancelled", color: "bg-red-100 dark:bg-red-900/20" }
                ].map((stat, index) => (
                    <Card key={index} className={`${stat.color} border-0`}>
                        <CardHeader className="pb-2 p-4">
                            <CardTitle className="text-xl md:text-2xl">{stat.value}</CardTitle>
                            <CardDescription className="text-xs md:text-sm">{stat.label}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Filters - Responsive */}
            <Card className="mb-6">
                <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">Filters</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 text-sm md:text-base"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px] md:w-[180px] text-sm">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={handleExport} className="md:hidden">
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" onClick={handleExport} className="hidden md:flex">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                            <Button variant="outline" size="icon" onClick={fetchConsultations}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Consultation Table - Responsive */}
            <Card>
                <CardHeader className="p-4 md:p-6">
                    <CardTitle>Consultation Requests</CardTitle>
                    <CardDescription>
                        Showing {consultations.length} of {pagination.total} requests
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 md:p-6">
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
                            {/* Desktop Table */}
                            <div className="hidden md:block rounded-md border">
                                <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b text-sm">
                                    <div className="col-span-2">Name</div>
                                    <div className="col-span-3">Contact</div>
                                    <div className="col-span-2">Company & Title</div>
                                    <div className="col-span-2">Location & Service</div>
                                    <div className="col-span-1">Status</div>
                                    <div className="col-span-2">Actions</div>
                                </div>
                                <div className="divide-y">
                                    {consultations.map((consultation) => (
                                        <div key={consultation.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50 text-sm">
                                            <div className="col-span-2">
                                                <div className="font-medium truncate">{consultation.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {format(new Date(consultation.createdAt), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                            <div className="col-span-3">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={12} className="text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate">{consultation.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Phone size={12} className="text-muted-foreground flex-shrink-0" />
                                                    <span>{consultation.phone}</span>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <Building size={12} className="text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate">{consultation.company}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1 truncate">
                                                    {consultation.title}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className="text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate">{consultation.location}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1 truncate">
                                                    {formatServiceType(consultation.serviceType)}
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <StatusBadge status={consultation.status} />
                                                {consultation.isFollowedUp && (
                                                    <Badge variant="outline" className="mt-1 text-xs">Followed</Badge>
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

                            {/* Mobile List */}
                            <div className="md:hidden divide-y">
                                {consultations.map((consultation) => (
                                    <MobileTableRow key={consultation.id} consultation={consultation} />
                                ))}
                            </div>

                            {/* Pagination - Responsive */}
                            {pagination.totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 p-4 md:p-0 md:mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                            disabled={pagination.page === 1}
                                            className="text-xs"
                                        >
                                            <ChevronLeft size={14} className="mr-1" />
                                            Prev
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="text-xs"
                                        >
                                            Next
                                            <ChevronRight size={14} className="ml-1" />
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

    // Detail view - Responsive
    const renderDetailView = () => {
        if (!selectedConsultation) return null;

        return (
            <>
                {/* Back button */}
                <div className="mb-4 md:mb-6">
                    <Button variant="ghost" onClick={() => setViewMode('list')} className="text-sm">
                        <ChevronLeft size={14} className="mr-1" />
                        Back to List
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Left column - Details */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        {/* Contact Info */}
                        <Card>
                            <CardHeader className="p-4 md:p-6">
                                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                    <User size={18} className="md:size-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                                    <p className="font-medium text-sm md:text-base">{selectedConsultation.name}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <p className="font-medium text-sm md:text-base truncate">{selectedConsultation.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                        <p className="font-medium text-sm md:text-base">{selectedConsultation.phone}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Company</label>
                                        <p className="font-medium text-sm md:text-base">{selectedConsultation.company}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Title</label>
                                        <p className="font-medium text-sm md:text-base">{selectedConsultation.title}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                                    <p className="font-medium text-sm md:text-base">{selectedConsultation.location}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Service Information */}
                        <Card>
                            <CardHeader className="p-4 md:p-6">
                                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                    <Briefcase size={18} className="md:size-5" />
                                    Service Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Service Type</label>
                                    <p className="font-medium text-sm md:text-base">{formatServiceType(selectedConsultation.serviceType)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Brief Description</label>
                                    <div className="mt-2 p-3 bg-muted rounded-lg whitespace-pre-line text-sm md:text-base max-h-60 overflow-y-auto">
                                        {selectedConsultation.description}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader className="p-4 md:p-6">
                                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                    <Calendar size={18} className="md:size-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 pt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Submitted On</label>
                                        <p className="font-medium text-sm md:text-base">
                                            {format(new Date(selectedConsultation.createdAt), 'PPp')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                        <p className="font-medium text-sm md:text-base">
                                            {format(new Date(selectedConsultation.updatedAt), 'PPp')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column - Actions & Status */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Status Card */}
                        <Card>
                            <CardHeader className="p-4 md:p-6">
                                <CardTitle className="text-lg md:text-xl">Status & Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Current Status</label>
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <StatusBadge status={selectedConsultation.status} />
                                        {selectedConsultation.isFollowedUp && (
                                            <Badge variant="outline" className="text-xs">Followed Up</Badge>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Update Status</label>
                                    <Select value={updateStatus} onValueChange={setUpdateStatus}>
                                        <SelectTrigger className="text-sm md:text-base">
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
                                        className="w-full min-h-[80px] md:min-h-[100px] p-2 border rounded text-sm md:text-base"
                                        value={updateNotes}
                                        onChange={(e) => setUpdateNotes(e.target.value)}
                                        placeholder="Add notes about this consultation..."
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button onClick={handleUpdateStatus} className="flex-1 text-sm md:text-base">
                                        Update Status
                                    </Button>
                                    <Button
                                        variant={selectedConsultation.isFollowedUp ? "default" : "outline"}
                                        onClick={() => toggleFollowUp(selectedConsultation.id, selectedConsultation.isFollowedUp)}
                                        className="text-sm md:text-base"
                                    >
                                        {selectedConsultation.isFollowedUp ? 'Followed Up ✓' : 'Mark as Followed Up'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Notes */}
                        {selectedConsultation.notes && (
                            <Card>
                                <CardHeader className="p-4 md:p-6">
                                    <CardTitle className="text-lg md:text-xl">Admin Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 md:p-6 pt-0">
                                    <div className="p-3 bg-muted rounded-lg whitespace-pre-line text-sm md:text-base">
                                        {selectedConsultation.notes}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="container-wide py-4 md:py-8">
            <div className="mb-4 md:mb-8">
                <h1 className="text-xl md:text-3xl font-bold tracking-tight">Consultation Requests</h1>
                <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
                    Manage and track all consultation requests
                </p>
            </div>
            {viewMode === 'list' ? renderListView() : renderDetailView()}
        </div>
    );
}