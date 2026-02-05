"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

// Validation schema
const consultationSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(100),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    businessType: z.string().optional(),
    industry: z.string().optional(),
    businessSize: z.string().optional(),
    annualRevenue: z.string().optional(),
    consultationType: z.string().min(1, "Please select a consultation type"),
    preferredDate: z.date().optional(),
    preferredTime: z.string().optional(),
    timezone: z.string().optional(),
    projectDescription: z.string().optional(),
    mainChallenges: z.string().optional(),
    goals: z.string().optional(),
    budgetRange: z.string().optional(),
    timeline: z.string().optional(),
    referralSource: z.string().optional(),
    referralDetails: z.string().optional(),
    additionalInfo: z.string().optional(),
    hearAboutUs: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface BookConsultationFormProps {
    onSubmit: (data: ConsultationFormData) => Promise<void>;
    isSubmitting: boolean;
}

// Create a ref to expose reset function
export type FormResetRef = {
    resetForm: () => void;
};

const BookConsultationForm = forwardRef<FormResetRef, BookConsultationFormProps>(
    ({ onSubmit, isSubmitting }, ref) => {
        const [date, setDate] = useState<Date>();
        const [selectedTime, setSelectedTime] = useState<string>("");
        const [selectedBusinessSize, setSelectedBusinessSize] = useState<string>("");
        const [selectedBudget, setSelectedBudget] = useState<string>("");
        const [selectedTimeline, setSelectedTimeline] = useState<string>("");
        const [selectedTimezone, setSelectedTimezone] = useState<string>("");
        const [selectedConsultationType, setSelectedConsultationType] = useState<string>("");

        const {
            register,
            handleSubmit,
            setValue,
            reset,
            watch,
            formState: { errors },
        } = useForm<ConsultationFormData>({
            resolver: zodResolver(consultationSchema),
            defaultValues: {
                consultationType: "",
            },
        });

        // Expose reset function via ref
        useImperativeHandle(ref, () => ({
            resetForm: () => {
                reset();
                setDate(undefined);
                setSelectedTime("");
                setSelectedBusinessSize("");
                setSelectedBudget("");
                setSelectedTimeline("");
                setSelectedTimezone("");
                setSelectedConsultationType("");
            },
        }));

        // Reset form when component mounts or when isSubmitting changes
        useEffect(() => {
            if (!isSubmitting) {
                // You can optionally reset the form when not submitting
            }
        }, [isSubmitting]);

        const consultationType = watch("consultationType");

        // Time options
        const timeOptions = [
            "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
            "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
            "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
        ];

        // Business size options
        const businessSizeOptions = [
            "Solo Entrepreneur",
            "2-10 Employees",
            "11-50 Employees",
            "51-200 Employees",
            "201-500 Employees",
            "500+ Employees",
        ];

        // Budget range options
        const budgetRangeOptions = [
            "Under $5,000",
            "$5,000 - $10,000",
            "$10,000 - $25,000",
            "$25,000 - $50,000",
            "$50,000 - $100,000",
            "Over $100,000",
        ];

        // Timeline options
        const timelineOptions = [
            "Immediately",
            "Within 1 month",
            "1-3 months",
            "3-6 months",
            "6-12 months",
            "Not sure yet",
        ];

        const onSubmitForm = async (data: ConsultationFormData) => {
            await onSubmit(data);
        };

        // Function to reset form manually
        const resetForm = () => {
            reset();
            setDate(undefined);
            setSelectedTime("");
            setSelectedBusinessSize("");
            setSelectedBudget("");
            setSelectedTimeline("");
            setSelectedTimezone("");
            setSelectedConsultationType("");
        };

        return (
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft">
                <div className="mb-8">
                    <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                        Schedule Your Consultation
                    </h2>
                    <p className="text-muted-foreground">
                        Fill out the form below and we&apos;ll get back to you within 24 hours to confirm your session.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">First Name *</label>
                                <Input
                                    {...register("firstName")}
                                    placeholder=" "
                                    className={errors.firstName ? "border-destructive" : ""}
                                    disabled={isSubmitting}
                                />
                                {errors.firstName && (
                                    <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Last Name *</label>
                                <Input
                                    {...register("lastName")}
                                    placeholder=" "
                                    className={errors.lastName ? "border-destructive" : ""}
                                    disabled={isSubmitting}
                                />
                                {errors.lastName && (
                                    <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Email *</label>
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="john@example.com"
                                    className={errors.email ? "border-destructive" : ""}
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Phone</label>
                                <Input
                                    {...register("phone")}
                                    type="tel"
                                    placeholder="+91 9487 381 265"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Company</label>
                                <Input
                                    {...register("company")}
                                    placeholder="Acme Inc."
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Job Title</label>
                                <Input
                                    {...register("jobTitle")}
                                    placeholder="CEO / Founder"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Business Information</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Business Type</label>
                                <Input
                                    {...register("businessType")}
                                    placeholder="e.g., SaaS, E-commerce"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Industry</label>
                                <Input
                                    {...register("industry")}
                                    placeholder="e.g., Technology, Retail"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Business Size</label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedBusinessSize(value);
                                        setValue("businessSize", value);
                                    }}
                                    value={selectedBusinessSize}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select business size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {businessSizeOptions.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Annual Revenue</label>
                                <Input
                                    {...register("annualRevenue")}
                                    placeholder="e.g., ₹1M - ₹5M"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Consultation Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Consultation Details</h3>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Consultation Type *</label>
                            <Select
                                onValueChange={(value) => {
                                    setSelectedConsultationType(value);
                                    setValue("consultationType", value);
                                }}
                                value={selectedConsultationType}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className={errors.consultationType ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select consultation type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="strategy-session">Strategy Session</SelectItem>
                                    <SelectItem value="growth-consultation">Growth Consultation</SelectItem>
                                    <SelectItem value="marketing-review">Marketing Review</SelectItem>
                                    <SelectItem value="investment-readiness">Investment Readiness</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.consultationType && (
                                <p className="text-destructive text-sm mt-1">{errors.consultationType.message}</p>
                            )}
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Preferred Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                            disabled={isSubmitting}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(selectedDate) => {
                                                setDate(selectedDate);
                                                setValue("preferredDate", selectedDate);
                                            }}
                                            initialFocus
                                            disabled={(date) => date < new Date() || isSubmitting}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Preferred Time</label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedTime(value);
                                        setValue("preferredTime", value);
                                    }}
                                    value={selectedTime}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Timezone</label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedTimezone(value);
                                        setValue("timezone", value);
                                    }}
                                    value={selectedTimezone}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="est">EST (Eastern Time)</SelectItem>
                                        <SelectItem value="cst">CST (Central Time)</SelectItem>
                                        <SelectItem value="mst">MST (Mountain Time)</SelectItem>
                                        <SelectItem value="pst">PST (Pacific Time)</SelectItem>
                                        <SelectItem value="gmt">GMT (UK/Europe)</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Project Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Project Information</h3>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Project Description</label>
                            <Textarea
                                {...register("projectDescription")}
                                placeholder="Tell us about your project or what you'd like to achieve..."
                                rows={4}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Main Challenges</label>
                                <Textarea
                                    {...register("mainChallenges")}
                                    placeholder="What are your main challenges?"
                                    rows={3}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Goals</label>
                                <Textarea
                                    {...register("goals")}
                                    placeholder="What do you hope to achieve?"
                                    rows={3}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Budget Range</label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedBudget(value);
                                        setValue("budgetRange", value);
                                    }}
                                    value={selectedBudget}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select budget range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {budgetRangeOptions.map((budget) => (
                                            <SelectItem key={budget} value={budget}>
                                                {budget}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Timeline</label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedTimeline(value);
                                        setValue("timeline", value);
                                    }}
                                    value={selectedTimeline}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timeline" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timelineOptions.map((timeline) => (
                                            <SelectItem key={timeline} value={timeline}>
                                                {timeline}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                How did you hear about us?
                            </label>
                            <Textarea
                                {...register("hearAboutUs")}
                                placeholder="e.g., Google search, LinkedIn, referral, etc."
                                rows={2}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Anything else you'd like to share?
                            </label>
                            <Textarea
                                {...register("additionalInfo")}
                                placeholder="Any additional information that might be helpful..."
                                rows={3}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            size="lg"
                            className="bg-secondary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Let’s Talk Strategy"
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                            By submitting this form, you agree to our Privacy Policy and Terms of Service.
                        </p>
                    </div>
                </form>
            </div>
        );
    }
);

BookConsultationForm.displayName = "BookConsultationForm";
export default BookConsultationForm;