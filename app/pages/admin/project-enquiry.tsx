"use client";

import { useState, useEffect, useCallback, SetStateAction} from "react";
import {
    Search,
    Filter,
    Calendar,
    Mail,
    Phone,
    Building,
    CheckCircle,
    Clock,
    Eye,
    Trash2,
    Download,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    User,
    FileText,
    Tag,
    DollarSign,
    Clock4,
} from "lucide-react";
import {format} from "date-fns";

import {Button} from "../../components/ui/button";
import {Input} from "../../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {Badge} from "../../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {Skeleton} from "../../components/ui/skeleton";
import {useToast} from "../../hooks/use-toast";
import api from "../../service/api";

// Types
interface ProjectInquiry {
    id: number;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    description: string;
    projectType: string;
    selectedFeatures: string[];
    budgetRange: string;
    timeline: string;
    status: "new" | "contacted" | "in_progress" | "completed" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

interface Stats {
    total: number;
    new: number;
    contacted: number;
    in_progress: number;
    completed: number;
    cancelled: number;
}

const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-purple-100 text-purple-800",
    in_progress: "bg-amber-100 text-amber-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
};

const statusIcons: Record<string, React.ReactNode> = {
    new: <Clock className="w-3 h-3"/>,
    contacted: <Mail className="w-3 h-3"/>,
    in_progress: <Clock4 className="w-3 h-3"/>,
    completed: <CheckCircle className="w-3 h-3"/>,
    cancelled: <Clock className="w-3 h-3"/>,
};

const projectTypeColors: Record<string, string> = {
    web: "bg-blue-50 text-blue-700 border-blue-200",
    mobile: "bg-purple-50 text-purple-700 border-purple-200",
    ai: "bg-orange-50 text-orange-700 border-orange-200",
    website: "bg-green-50 text-green-700 border-green-200",
};

export default function AdminProjectsPage() {
    const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
    const [filteredInquiries, setFilteredInquiries] = useState<ProjectInquiry[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        new: 0,
        contacted: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [projectTypeFilter, setProjectTypeFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedInquiry, setSelectedInquiry] = useState<ProjectInquiry | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const {toast} = useToast();

    // Fetch inquiries with better error handling
    const fetchInquiries = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/project-inquiries");

            // Handle different response structures
            let data: ProjectInquiry[] = [];

            if (response && typeof response === 'object') {
                // Check for different possible response structures
                if (Array.isArray(response)) {
                    data = response;
                } else if (Array.isArray(response.data)) {
                    data = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    data = response.data.data;
                } else if (response.data && typeof response.data === 'object') {
                    // Check if it has a pagination structure
                    if (response.data.data && Array.isArray(response.data.data)) {
                        data = response.data.data;
                    }
                }
            }

            // Ensure data is an array
            if (!Array.isArray(data)) {
                console.warn("API response is not an array:", response);
                data = [];
            }

            setInquiries(data);
            calculateStats(data);

        } catch (error) {
            console.error("Error fetching inquiries:", error);
            toast({
                title: "Error",
                description: "Failed to load project inquiries",
                variant: "destructive",
            });
            setInquiries([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Calculate statistics - now safely handles empty arrays
    const calculateStats = (data: ProjectInquiry[]) => {
        const stats: Stats = {
            total: data?.length || 0,
            new: data?.filter(item => item.status === "new").length || 0,
            contacted: data?.filter(item => item.status === "contacted").length || 0,
            in_progress: data?.filter(item => item.status === "in_progress").length || 0,
            completed: data?.filter(item => item.status === "completed").length || 0,
            cancelled: data?.filter(item => item.status === "cancelled").length || 0,
        };
        setStats(stats);
    };

    // Apply filters - FIXED: Safely handle inquiries
    useEffect(() => {
        // Ensure inquiries is always an array
        const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

        let filtered = [...safeInquiries];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                item =>
                    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.projectType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Project type filter
        if (projectTypeFilter !== "all") {
            filtered = filtered.filter(item => item.projectType === projectTypeFilter);
        }

        setFilteredInquiries(filtered);
        setCurrentPage(1);
    }, [inquiries, searchTerm, statusFilter, projectTypeFilter]);

    // Pagination - safely handle filteredInquiries
    const totalPages = Math.ceil((filteredInquiries?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredInquiries?.slice(startIndex, endIndex) || [];

    // Update status
    const updateStatus = async (id: number, status: string) => {
        try {
            await api.patch(`/project-inquiries/${id}/status`, {status});

            toast({
                title: "Success",
                description: "Status updated successfully",
            });

            fetchInquiries(); // Refresh the list
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            });
        }
    };

    // Delete inquiry
    const deleteInquiry = async (id: number) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;

        try {
            await api.delete(`/project-inquiries/${id}`);

            toast({
                title: "Success",
                description: "Inquiry deleted successfully",
            });

            fetchInquiries(); // Refresh the list
        } catch (error) {
            console.error("Error deleting inquiry:", error);
            toast({
                title: "Error",
                description: "Failed to delete inquiry",
                variant: "destructive",
            });
        }
    };

    // View inquiry details
    const viewInquiry = (inquiry: ProjectInquiry) => {
        setSelectedInquiry(inquiry);
        setViewModalOpen(true);
    };

    // Export data - safely handle filteredInquiries
    const exportData = () => {
        const dataToExport = Array.isArray(filteredInquiries) ? filteredInquiries : [];

        if (dataToExport.length === 0) {
            toast({
                title: "No Data",
                description: "There is no data to export",
                variant: "destructive",
            });
            return;
        }

        const csvData = dataToExport.map(item => ({
            ID: item.id,
            Name: item.name || "",
            Email: item.email || "",
            Company: item.company || "",
            Phone: item.phone || "",
            "Project Type": item.projectType || "",
            "Budget Range": item.budgetRange || "",
            Timeline: item.timeline || "",
            Status: item.status || "",
            "Created At": item.createdAt ? format(new Date(item.createdAt), "yyyy-MM-dd HH:mm") : "",
        }));

        const csvContent = [
            Object.keys(csvData[0]).join(","),
            ...csvData.map(row => Object.values(row).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], {type: "text/csv"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `project-inquiries-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();

        toast({
            title: "Exported",
            description: `Exported ${dataToExport.length} records`,
        });
    };

    // Initial fetch
    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    // Format date with error handling
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy HH:mm");
        } catch (error) {
            return "Invalid date";
        }
    };

    // Get project type display
    const getProjectTypeDisplay = (type: string) => {
        const types: Record<string, string> = {
            web: "Web App",
            mobile: "Mobile App",
            ai: "AI Solution",
            website: "Website",
        };
        return types[type] || type || "Unknown";
    };

    // Safe getter for inquiry properties
    const getSafeValue = (value: any, defaultValue: string = "") => {
        return value || defaultValue;
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Project Inquiries</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and review project inquiries from your website
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={exportData}
                        className="flex items-center gap-2"
                        disabled={filteredInquiries.length === 0}
                    >
                        <Download className="w-4 h-4"/>
                        Export CSV
                    </Button>
                    <Button
                        variant="outline"
                        onClick={fetchInquiries}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4"/>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-semibold mt-1">{stats.total}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-600"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">New</p>
                                <p className="text-2xl font-semibold mt-1">{stats.new}</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Contacted</p>
                                <p className="text-2xl font-semibold mt-1">{stats.contacted}</p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Mail className="w-5 h-5 text-purple-600"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">In Progress</p>
                                <p className="text-2xl font-semibold mt-1">{stats.in_progress}</p>
                            </div>
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Clock4 className="w-5 h-5 text-amber-600"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Completed</p>
                                <p className="text-2xl font-semibold mt-1">{stats.completed}</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                                <p className="text-2xl font-semibold mt-1">{stats.cancelled}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Clock className="w-5 h-5 text-gray-600"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"/>
                                <Input
                                    placeholder="Search by name, email, or company..."
                                    value={searchTerm}
                                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <Tag className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Project Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="web">Web Application</SelectItem>
                                    <SelectItem value="mobile">Mobile App</SelectItem>
                                    <SelectItem value="ai">AI Solution</SelectItem>
                                    <SelectItem value="website">Website</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">ID</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Project Details</TableHead>
                                    <TableHead>Timeline</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : currentItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            {inquiries.length === 0 ? "No inquiries found" : "No matching inquiries"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentItems.map((inquiry) => (
                                        <TableRow key={inquiry.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">#{inquiry.id}</TableCell>

                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium flex items-center gap-2">
                                                        <User className="w-3 h-3" />
                                                        {getSafeValue(inquiry.name, "N/A")}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                                        <Mail className="w-3 h-3" />
                                                        {getSafeValue(inquiry.email, "N/A")}
                                                    </div>
                                                    {inquiry.company && (
                                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                                            <Building className="w-3 h-3" />
                                                            {getSafeValue(inquiry.company)}
                                                        </div>
                                                    )}
                                                    {inquiry.phone && (
                                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                                            <Phone className="w-3 h-3" />
                                                            {getSafeValue(inquiry.phone)}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={projectTypeColors[inquiry.projectType] || "bg-gray-50 text-gray-700 border-gray-200"}
                                                    >
                                                        {getProjectTypeDisplay(inquiry.projectType)}
                                                    </Badge>
                                                    <div className="text-sm flex items-center gap-2 text-gray-600">
                                                        <DollarSign className="w-3 h-3" />
                                                        {getSafeValue(inquiry.budgetRange, "N/A")}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="text-sm flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {getSafeValue(inquiry.timeline, "N/A")}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={`${statusColors[inquiry.status] || "bg-gray-100 text-gray-800"} flex items-center gap-1`}
                                                    >
                                                        {statusIcons[inquiry.status] || <Clock className="w-3 h-3" />}
                                                        {inquiry.status ?
                                                            inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1).replace('_', ' ')
                                                            : "Unknown"
                                                        }
                                                    </Badge>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(inquiry.createdAt)}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => viewInquiry(inquiry)}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => updateStatus(inquiry.id, "contacted")}>
                                                            <Mail className="w-4 h-4 mr-2" />
                                                            Mark as Contacted
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => updateStatus(inquiry.id, "in_progress")}>
                                                            <Clock4 className="w-4 h-4 mr-2" />
                                                            Mark In Progress
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => updateStatus(inquiry.id, "completed")}>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Mark Completed
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() => deleteInquiry(inquiry.id)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredInquiries.length)} of{" "}
                        {filteredInquiries.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-1">
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
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewModalOpen && selectedInquiry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">
                                    Inquiry #{selectedInquiry.id}
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewModalOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Contact Info */}
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3">Contact Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{getSafeValue(selectedInquiry.name)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{getSafeValue(selectedInquiry.email)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {selectedInquiry.company && (
                                                <div className="flex items-center gap-2">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm">{getSafeValue(selectedInquiry.company)}</span>
                                                </div>
                                            )}
                                            {selectedInquiry.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm">{getSafeValue(selectedInquiry.phone)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3">Project Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Project Type</p>
                                            <Badge
                                                variant="outline"
                                                className={projectTypeColors[selectedInquiry.projectType] || "bg-gray-50 text-gray-700 border-gray-200"}
                                            >
                                                {getProjectTypeDisplay(selectedInquiry.projectType)}
                                            </Badge>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Budget Range</p>
                                            <p className="font-medium">{getSafeValue(selectedInquiry.budgetRange)}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Timeline</p>
                                            <p className="font-medium">{getSafeValue(selectedInquiry.timeline)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                {selectedInquiry.selectedFeatures && selectedInquiry.selectedFeatures.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-3">Selected Features</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedInquiry.selectedFeatures.map((feature, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3">Project Description</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm whitespace-pre-wrap">{getSafeValue(selectedInquiry.description, "No description provided")}</p>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Status</p>
                                            <Badge className={`${statusColors[selectedInquiry.status] || "bg-gray-100 text-gray-800"} mt-1`}>
                                                {selectedInquiry.status ?
                                                    selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1).replace('_', ' ')
                                                    : "Unknown"
                                                }
                                            </Badge>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Submitted</p>
                                            <p className="font-medium">{formatDate(selectedInquiry.createdAt)}</p>
                                        </div>

                                        {selectedInquiry.updatedAt && (
                                            <div>
                                                <p className="text-gray-500">Last Updated</p>
                                                <p className="font-medium">{formatDate(selectedInquiry.updatedAt)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setViewModalOpen(false)}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (selectedInquiry.email) {
                                            window.location.href = `mailto:${selectedInquiry.email}`;
                                        }
                                    }}
                                    disabled={!selectedInquiry.email}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Reply via Email
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}