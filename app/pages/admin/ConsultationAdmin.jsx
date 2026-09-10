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
    Clock,
    User,
    Building,
    FileText,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Briefcase,
    MoreVertical,
    Calendar,
    MessageCircle,
    UserCheck,
    UserX,
    Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/app/hooks/use-toast";
import { useContacts } from "../../context/ContactContext";
import { format } from "date-fns";

export default function ConsultationAdmin() {
    const { toast } = useToast();

    const {
        getEnquiriesMutation,
        getEnquiryByIdMutation,
        updateEnquiryMutation,
        deleteEnquiryMutation,
        updateStatusMutation,
        sendZohoMessageMutation
    } = useContacts();

    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        contacted: 0,
        followUp: 0,
        converted: 0,
        lost: 0
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
    });

    const [updateStatus, setUpdateStatus] = useState("");
    const [updateNotes, setUpdateNotes] = useState("");
    const [mobileActionMenu, setMobileActionMenu] = useState(null);

    // Helper function to safely get nested data
    const getNestedValue = (obj, path, defaultValue = 'N/A') => {
        if (!obj) return defaultValue;
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (current === null || current === undefined || typeof current !== 'object') {
                return defaultValue;
            }
            current = current[key];
        }
        return current !== undefined && current !== null ? current : defaultValue;
    };

    const fetchConsultations = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                search: searchTerm || undefined
            };

            const response = await getEnquiriesMutation.mutateAsync(params);

            console.log('Full API Response:', response);

            let data = [];
            let paginationData = null;

            if (response) {
                if (response.success && response.data) {
                    data = response.data;
                    paginationData = response.pagination;
                } else if (response.data && Array.isArray(response.data)) {
                    data = response.data;
                    paginationData = response.pagination;
                } else if (Array.isArray(response)) {
                    data = response;
                } else if (response.items && Array.isArray(response.items)) {
                    data = response.items;
                    paginationData = {
                        total: response.total || response.items.length,
                        page: response.page || 1,
                        limit: response.limit || 20,
                        totalPages: response.totalPages || Math.ceil((response.total || response.items.length) / (response.limit || 20))
                    };
                } else {
                    for (const key in response) {
                        if (Array.isArray(response[key]) && response[key].length > 0) {
                            data = response[key];
                            break;
                        }
                    }
                }
            }

            if (data && data.length > 0) {
                const mappedConsultations = data.map((item) => {
                    console.log('Item:', item);

                    return {
                        id: item.id || item._id || Math.random(),
                        // Top level fields
                        name: item.name || 'N/A',
                        email: item.email || 'N/A',
                        phone: item.phone || 'N/A',
                        company: item.company || 'N/A',
                        status: item.status || 'pending',
                        isFollowedUp: item.isFollowedUp || false,
                        notes: item.notes || item.adminNotes || '',
                        createdAt: item.createdAt || item.created_at || item.created || new Date().toISOString(),
                        updatedAt: item.updatedAt || item.updated_at || item.updated || new Date().toISOString(),

                        // Fields from the 'data' object
                        title: getNestedValue(item, 'data.title', 'N/A'),
                        location: getNestedValue(item, 'data.location', 'N/A'),
                        serviceType: getNestedValue(item, 'data.serviceType', 'N/A'),
                        description: getNestedValue(item, 'data.description', getNestedValue(item, 'message', 'N/A')),

                        // Keep the raw data object for reference
                        rawData: item.data || {}
                    };
                });

                console.log('Mapped consultations:', mappedConsultations);
                setConsultations(mappedConsultations);

                if (paginationData) {
                    setPagination({
                        page: paginationData.page || 1,
                        limit: paginationData.limit || 20,
                        total: paginationData.total || data.length,
                        totalPages: paginationData.totalPages || Math.ceil(data.length / 20)
                    });
                } else {
                    setPagination(prev => ({
                        ...prev,
                        total: data.length,
                        totalPages: Math.ceil(data.length / prev.limit)
                    }));
                }
            } else {
                setConsultations([]);
            }
        } catch (error) {
            console.error("Fetch consultations error:", error);
            toast({
                title: "Error",
                description: error?.message || "Failed to fetch consultations",
                variant: "destructive"
            });
            setConsultations([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const params = { limit: 100, page: 1 };
            const response = await getEnquiriesMutation.mutateAsync(params);

            let data = [];
            if (response && response.success && response.data) {
                data = response.data;
            } else if (response && response.data && Array.isArray(response.data)) {
                data = response.data;
            } else if (Array.isArray(response)) {
                data = response;
            } else if (response && response.items) {
                data = response.items;
            }

            if (data && data.length > 0) {
                const total = data.length;
                const pending = data.filter((item) => item.status === 'pending').length;
                const contacted = data.filter((item) => item.status === 'contacted').length;
                const followUp = data.filter((item) => item.status === 'follow-up').length;
                const converted = data.filter((item) => item.status === 'converted').length;
                const lost = data.filter((item) => item.status === 'lost').length;

                setStats({ total, pending, contacted, followUp, converted, lost });
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    useEffect(() => {
        fetchConsultations();
        fetchStats();
    }, [pagination.page, statusFilter]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm || statusFilter !== 'all') {
                fetchConsultations();
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter]);

    const viewConsultation = async (consultation) => {
        try {
            const response = await getEnquiryByIdMutation.mutateAsync(consultation.id);
            // Use the data we already have
            setSelectedConsultation(consultation);
            setUpdateStatus(consultation.status);
            setUpdateNotes(consultation.notes || "");
            setViewMode('detail');
        } catch (error) {
            setSelectedConsultation(consultation);
            setUpdateStatus(consultation.status);
            setUpdateNotes(consultation.notes || "");
            setViewMode('detail');
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedConsultation) return;
        try {
            const response = await updateStatusMutation.mutateAsync({
                id: selectedConsultation.id,
                status: updateStatus,
                notes: updateNotes
            });

            const updatedConsultations = consultations.map(c =>
                c.id === selectedConsultation.id
                    ? { ...c, status: updateStatus, notes: updateNotes }
                    : c
            );
            setConsultations(updatedConsultations);

            toast({
                title: "Success",
                description: "Consultation updated successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update consultation",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this consultation request?")) return;
        try {
            await deleteEnquiryMutation.mutateAsync(id);
            setConsultations(consultations.filter(c => c.id !== id));
            toast({
                title: "Success",
                description: "Consultation deleted successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete consultation",
                variant: "destructive"
            });
        }
    };

    const toggleFollowUp = async (id, currentStatus) => {
        try {
            await updateEnquiryMutation.mutateAsync({
                id: id,
                isFollowedUp: !currentStatus
            });

            const updatedConsultations = consultations.map(c =>
                c.id === id ? { ...c, isFollowedUp: !currentStatus } : c
            );
            setConsultations(updatedConsultations);

            toast({
                title: "Success",
                description: `Follow-up status ${!currentStatus ? 'enabled' : 'disabled'}`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update follow-up status",
                variant: "destructive"
            });
        }
    };

    const handleSendZohoMessage = async (consultation) => {
        try {
            await sendZohoMessageMutation.mutateAsync({
                enquiryId: consultation.id,
                message: `Following up on consultation request from ${consultation.name} at ${consultation.company}`
            });
            toast({
                title: "Success",
                description: "Zoho message sent successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send Zoho message",
                variant: "destructive"
            });
        }
    };

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

    const StatusBadge = ({ status }) => {
        const config = {
            pending: { variant: "secondary", icon: Clock, label: "Pending" },
            contacted: { variant: "default", icon: MessageCircle, label: "Contacted" },
            'follow-up': { variant: "default", icon: Users, label: "Follow-up" },
            converted: { variant: "default", icon: UserCheck, label: "Converted" },
            lost: { variant: "destructive", icon: UserX, label: "Lost" }
        };

        const { variant, icon: Icon, label } = config[status] || { variant: "outline", icon: Clock, label: status };

        return (
            <Badge variant={variant} className="gap-1 text-xs md:text-sm">
                <Icon size={10} className="md:size-3" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.charAt(0)}</span>
            </Badge>
        );
    };

    const formatServiceType = (type) => {
        if (!type || type === 'N/A') return 'N/A';
        return type
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const MobileTableRow = ({ consultation }) => (
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

    const renderListView = () => (
        <>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-6">
                {[
                    { value: stats.total, label: "Total", color: "bg-blue-100 dark:bg-blue-900/20" },
                    { value: stats.pending, label: "Pending", color: "bg-yellow-100 dark:bg-yellow-900/20" },
                    { value: stats.contacted, label: "Contacted", color: "bg-indigo-100 dark:bg-indigo-900/20" },
                    { value: stats.followUp, label: "Follow-up", color: "bg-cyan-100 dark:bg-cyan-900/20" },
                    { value: stats.converted, label: "Converted", color: "bg-green-100 dark:bg-green-900/20" },
                    { value: stats.lost, label: "Lost", color: "bg-red-100 dark:bg-red-900/20" }
                ].map((stat, index) => (
                    <Card key={index} className={`${stat.color} border-0`}>
                        <CardHeader className="pb-2 p-4">
                            <CardTitle className="text-xl md:text-2xl">{stat.value}</CardTitle>
                            <CardDescription className="text-xs md:text-sm">{stat.label}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

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
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="follow-up">Follow-up</SelectItem>
                                    <SelectItem value="converted">Converted</SelectItem>
                                    <SelectItem value="lost">Lost</SelectItem>
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
                            <div className="hidden md:block">
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-left p-4 font-medium w-[15%]">Name</th>
                                            <th className="text-left p-4 font-medium w-[20%]">Contact</th>
                                            <th className="text-left p-4 font-medium w-[20%]">Company & Title</th>
                                            <th className="text-left p-4 font-medium w-[20%]">Location & Service</th>
                                            <th className="text-left p-4 font-medium w-[10%]">Status</th>
                                            <th className="text-left p-4 font-medium w-[15%]">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {consultations.map((consultation) => (
                                            <tr key={consultation.id} className="border-b hover:bg-muted/50 transition-colors">
                                                <td className="p-4 align-top">
                                                    <div className="font-medium truncate max-w-[150px]">{consultation.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {format(new Date(consultation.createdAt), 'MMM d, yyyy')}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={12} className="text-muted-foreground flex-shrink-0" />
                                                        <span className="truncate max-w-[120px]">{consultation.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Phone size={12} className="text-muted-foreground flex-shrink-0" />
                                                        <span className="truncate max-w-[120px]">{consultation.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="flex items-center gap-2">
                                                        <Building size={12} className="text-muted-foreground flex-shrink-0" />
                                                        <span className="truncate max-w-[120px]">{consultation.company}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]">
                                                        {consultation.title}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={12} className="text-muted-foreground flex-shrink-0" />
                                                        <span className="truncate max-w-[120px]">{consultation.location}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]">
                                                        {formatServiceType(consultation.serviceType)}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <StatusBadge status={consultation.status} />
                                                    {consultation.isFollowedUp && (
                                                        <Badge variant="outline" className="mt-1 text-xs block">Followed</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4 align-top">
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
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="md:hidden divide-y">
                                {consultations.map((consultation) => (
                                    <MobileTableRow key={consultation.id} consultation={consultation} />
                                ))}
                            </div>

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

    const renderDetailView = () => {
        if (!selectedConsultation) return null;

        return (
            <>
                <div className="mb-4 md:mb-6">
                    <Button variant="ghost" onClick={() => setViewMode('list')} className="text-sm">
                        <ChevronLeft size={14} className="mr-1" />
                        Back to List
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
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

                    <div className="space-y-4 md:space-y-6">
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
                                            <SelectItem value="contacted">Contacted</SelectItem>
                                            <SelectItem value="follow-up">Follow-up</SelectItem>
                                            <SelectItem value="converted">Converted</SelectItem>
                                            <SelectItem value="lost">Lost</SelectItem>
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

                                <div className="pt-2 border-t">
                                    <Button
                                        variant="outline"
                                        className="w-full text-sm md:text-base"
                                        onClick={() => handleSendZohoMessage(selectedConsultation)}
                                    >
                                        <Mail size={16} className="mr-2" />
                                        Send Zoho Message
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

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