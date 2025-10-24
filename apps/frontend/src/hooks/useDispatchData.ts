import { useState, useEffect } from 'react';
import { dispatchService } from '@/services/dispatch.service';
import type { WorkOrder, Technician } from '@/types/view-models/dispatch';

interface DispatchSlotResponse {
  id: string;
  workOrderId: string;
  technicianId: string;
  startTime: string;
  endTime: string;
  status: string;
  workOrder: {
    id: string;
    title: string;
    customerId?: string;
    status: string;
    priority: string;
    workOrderType: string;
    isEmergency: boolean;
  };
  technician: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export function useDispatchData() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDispatchData();
  }, []);

  const loadDispatchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const slots = await dispatchService.getAllSlots() as unknown as DispatchSlotResponse[];
      
      if (!slots || slots.length === 0) {
        setWorkOrders([]);
        setTechnicians([]);
        setIsLoading(false);
        return;
      }

      // Extract unique technicians from slots
      const techMap = new Map<string, Technician>();
      const woMap = new Map<string, WorkOrder>();

      slots.forEach((slot) => {
        // Add technician (only if slot has a technician assigned)
        if (slot.technician && !techMap.has(slot.technician.id)) {
          const fullName = [slot.technician.firstName, slot.technician.lastName]
            .filter(Boolean)
            .join(' ');
          
          const initials = fullName
            ? fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
            : slot.technician.email.substring(0, 2).toUpperCase();

          techMap.set(slot.technician.id, {
            id: slot.technician.id,
            name: fullName || slot.technician.email,
            avatar: initials,
            status: 'available', // TODO: Calculate actual status based on current time and slots
          });
        }

        // Convert dispatch slot to work order
        const startTime = new Date(slot.startTime);
        const endTime = new Date(slot.endTime);
        const date = startTime.toISOString().split('T')[0];

        // Map status from work order status to dispatch view status
        let woStatus: 'scheduled' | 'in-progress' | 'completed' | 'emergency' = 'scheduled';
        if (slot.workOrder.isEmergency) {
          woStatus = 'emergency';
        } else if (slot.status === 'completed') {
          woStatus = 'completed';
        } else if (slot.status === 'confirmed') {
          woStatus = 'in-progress';
        }

        const workOrder: WorkOrder = {
          id: slot.workOrder.id,
          dispatchSlotId: slot.id, // Track dispatch slot ID for updates
          customerName: slot.workOrder.title, // TODO: Fetch actual customer name from customerId
          startTime: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`,
          endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`,
          status: woStatus,
          jobType: slot.workOrder.workOrderType,
          priority: slot.workOrder.priority.toLowerCase() as 'normal' | 'emergency',
          technicianId: slot.technician?.id || null, // Use optional chaining for safety
          date,
        };

        woMap.set(slot.workOrder.id, workOrder);
      });

      setTechnicians(Array.from(techMap.values()));
      setWorkOrders(Array.from(woMap.values()));
    } catch (err) {
      console.error('Failed to load dispatch data:', err);
      setError('Failed to load dispatch data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workOrders,
    technicians,
    isLoading,
    error,
    reloadData: loadDispatchData,
  };
}
