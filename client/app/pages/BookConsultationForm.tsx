"use client"

import { useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Loader2 } from "lucide-react";

// Validation schema
const consultationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    company: z.string().min(2, "Company name must be at least 2 characters"),
    title: z.string().min(2, "Title must be at least 2 characters"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    serviceType: z.string().min(1, "Please select a service type"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500),
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
        const [selectedServiceType, setSelectedServiceType] = useState<string>("");

        const {
            register,
            handleSubmit,
            setValue,
            reset,
            formState: { errors },
        } = useForm<ConsultationFormData>({
            resolver: zodResolver(consultationSchema),
            defaultValues: {
                serviceType: "",
            },
        });

        // Expose reset function via ref
        useImperativeHandle(ref, () => ({
            resetForm: () => {
                reset();
                setSelectedServiceType("");
            },
        }));

        // Service type options
        const serviceTypeOptions = [
            "Growth Strategy",
            "Market Entry",
            "Go-to-Market (GTM)",
            "Feasibility & Investment Support",
            "Market Research",
            "Supply Chain & Sourcing",
            "Executive / Founder Advisory",
            "Design Thinking Workshop",
            "Guest Lecture / Speaking",
            "Other"
        ];

        const onSubmitForm = async (data: ConsultationFormData) => {
            await onSubmit(data);
        };

        return (
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft">
                <div className="mb-8">
                    <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                        Schedule Your Consultation
                    </h2>
                    <p className="text-muted-foreground">
                        Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Name *</label>
                        <Input
                            {...register("name")}
                            placeholder="John Doe"
                            className={errors.name ? "border-destructive" : ""}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Contact Information */}
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
                            <label className="text-sm font-medium mb-1 block">Phone *</label>
                            <Input
                                {...register("phone")}
                                type="tel"
                                placeholder="+91 98765 43210"
                                className={errors.phone ? "border-destructive" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.phone && (
                                <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Company *</label>
                            <Input
                                {...register("company")}
                                placeholder="Acme Inc."
                                className={errors.company ? "border-destructive" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.company && (
                                <p className="text-destructive text-sm mt-1">{errors.company.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Title *</label>
                            <Input
                                {...register("title")}
                                placeholder="CEO / Founder"
                                className={errors.title ? "border-destructive" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.title && (
                                <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Location Field */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Location/City *</label>
                        <Input
                            {...register("location")}
                            placeholder="Mumbai, India"
                            className={errors.location ? "border-destructive" : ""}
                            disabled={isSubmitting}
                        />
                        {errors.location && (
                            <p className="text-destructive text-sm mt-1">{errors.location.message}</p>
                        )}
                    </div>

                    {/* Service Type Field */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Type of Service *</label>
                        <Select
                            onValueChange={(value) => {
                                setSelectedServiceType(value);
                                setValue("serviceType", value);
                            }}
                            value={selectedServiceType}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className={errors.serviceType ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                                {serviceTypeOptions.map((service) => (
                                    <SelectItem key={service} value={service.toLowerCase().replace(/\s+/g, '-')}>
                                        {service}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.serviceType && (
                            <p className="text-destructive text-sm mt-1">{errors.serviceType.message}</p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Brief Description *</label>
                        <Textarea
                            {...register("description")}
                            placeholder="Tell us about your project, challenges, or what you'd like to achieve..."
                            rows={4}
                            className={errors.description ? "border-destructive" : ""}
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Please provide at least 10 characters (max 500)
                        </p>
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
                                "Let's Talk Strategy"
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