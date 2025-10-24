import { z } from "zod"

export const workOrderFormSchema = z.object({
  // Customer Information
  customerId: z.string().min(1, "Customer is required"),
  serviceAddress: z.string().min(1, "Service address is required"),
  useDifferentAddress: z.boolean().default(false),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),

  // Job Details
  jobType: z.enum(["installation", "repair", "maintenance", "inspection", "emergency"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  customerNotes: z.string().optional(),

  // Scheduling
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  estimatedDuration: z.number().min(15, "Duration must be at least 15 minutes"),
  technicianId: z.string().optional(),

  // Parts & Equipment
  parts: z
    .array(
      z.object({
        sku: z.string().min(1, "SKU is required"),
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Price must be positive"),
      }),
    )
    .default([]),
  equipmentNeeded: z.array(z.string()).default([]),

  // Additional Information
  internalNotes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
      }),
    )
    .default([]),
})

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>
