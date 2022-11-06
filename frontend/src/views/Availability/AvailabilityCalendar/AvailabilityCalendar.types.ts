export interface AvailabilityEvent {
  id: number;
  start: Date;
  end: Date;
}

export interface AvailabilityCalendarProps {
  events: AvailabilityEvent[];
  selectedDate: Date;
  onEventUpdate: (event: AvailabilityEvent) => void;
  onEventCreate: (event: Omit<AvailabilityEvent, 'id'>) => void;
}
