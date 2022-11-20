import { SlotInfo, CalendarProps } from 'react-big-calendar';
import { EventColor } from './AvailabilityCalendar.styled';

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
  canCreateEvent: (slotInfo: SlotInfo) => boolean;
  onDelete: (event: AvailabilityEvent) => void;
  eventColor: EventColor;
  formats?: CalendarProps['formats'];
}
