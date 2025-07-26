import React from 'react';
import { useAppointment } from '../../hooks';
import { AppointmentStatus } from '../../types/appointment';
import { format, isSameDay, isWithinInterval } from 'date-fns';

interface AppointmentCalendarProps {
    onSelectAppointment: (appointmentId: string | null) => void;
    onDateChange: (date: Date) => void;
    view: 'month' | 'week' | 'day' | 'agenda';
    date: Date;
    isLoading: boolean;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
    onSelectAppointment,
    onDateChange,
    view,
    date,
    isLoading
}) => {
    const {
        appointments,
        formatAppointmentTime,
        hasAvailableSlots
    } = useAppointment();

    // Get appointments for the selected date
    const getAppointmentsForDate = (date: Date) => {
        return appointments.filter(appointment =>
            isSameDay(appointment.startTime, date)
        );
    };

    // Check if a date has appointments
    const hasAppointments = (date: Date) => {
        return appointments.some(appointment =>
            isSameDay(appointment.startTime, date)
        );
    };

    // Get appointment status color
    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.CONFIRMED:
                return 'border-green-500 bg-green-50';
            case AppointmentStatus.PENDING:
                return 'border-yellow-500 bg-yellow-50';
            case AppointmentStatus.RESCHEDULED:
                return 'border-blue-500 bg-blue-50';
            case AppointmentStatus.CANCELLED:
                return 'border-red-500 bg-red-50';
            case AppointmentStatus.COMPLETED:
                return 'border-gray-500 bg-gray-50';
            case AppointmentStatus.MISSED:
                return 'border-purple-500 bg-purple-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    // Render month view
    const renderMonthView = () => {
        // Create calendar grid
        const today = new Date();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDayOfMonth.getDay();
        
        // Calculate total days to display (including padding)
        const daysInMonth = lastDayOfMonth.getDate();
        const totalDays = daysInMonth + firstDayOfWeek;
        const totalWeeks = Math.ceil(totalDays / 7);
        
        // Create calendar days
        const calendarDays = [];
        let dayCounter = 1;
        
        for (let i = 0; i < totalWeeks * 7; i++) {
            if (i < firstDayOfWeek || dayCounter > daysInMonth) {
                // Empty cell
                calendarDays.push(null);
            } else {
                // Valid day
                const currentDate = new Date(date.getFullYear(), date.getMonth(), dayCounter);
                const hasAppts = hasAppointments(currentDate);
                const hasAvail = hasAvailableSlots(currentDate);
                const isToday = isSameDay(currentDate, today);
                const isSelected = isSameDay(currentDate, date);
                
                calendarDays.push({
                    day: dayCounter,
                    date: currentDate,
                    hasAppointments: hasAppts,
                    hasAvailability: hasAvail,
                    isToday,
                    isSelected
                });
                
                dayCounter++;
            }
        }
        
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">
                        {format(date, 'MMMM yyyy')}
                    </h2>
                    <div className="flex space-x-2">
                        <button 
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                const newDate = new Date(date);
                                newDate.setMonth(date.getMonth() - 1);
                                onDateChange(newDate);
                            }}
                        >
                            Previous
                        </button>
                        <button 
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                const newDate = new Date(date);
                                newDate.setMonth(date.getMonth() + 1);
                                onDateChange(newDate);
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                    
                    {/* Calendar days */}
                    {calendarDays.map((dayInfo, index) => (
                        <div 
                            key={index} 
                            className={`
                                h-16 border p-1 relative
                                ${!dayInfo ? 'border-transparent' : 'border-gray-200'}
                                ${dayInfo?.isToday ? 'bg-blue-50' : ''}
                                ${dayInfo?.isSelected ? 'ring-2 ring-blue-500' : ''}
                            `}
                            onClick={() => dayInfo && onDateChange(dayInfo.date)}
                        >
                            {dayInfo && (
                                <>
                                    <div className="text-right text-sm">
                                        {dayInfo.day}
                                    </div>
                                    
                                    {/* Appointment indicator */}
                                    {dayInfo.hasAppointments && (
                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                    
                                    {/* Availability indicator */}
                                    {dayInfo.hasAvailability && (
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render week view
    const renderWeekView = () => {
        // Get start and end of week
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Get all appointments for the week
        const weekAppointments = appointments.filter(appointment =>
            isWithinInterval(appointment.startTime, { start: startOfWeek, end: endOfWeek })
        );

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">
                        {format(startOfWeek, 'MMMM d')} - {format(endOfWeek, 'MMMM d, yyyy')}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                const newDate = new Date(date);
                                newDate.setDate(date.getDate() - 7);
                                onDateChange(newDate);
                            }}
                        >
                            Previous Week
                        </button>
                        <button
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                const newDate = new Date(date);
                                newDate.setDate(date.getDate() + 7);
                                onDateChange(newDate);
                            }}
                        >
                            Next Week
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {/* Day headers */}
                    {Array.from({ length: 7 }).map((_, i) => {
                        const day = new Date(startOfWeek);
                        day.setDate(startOfWeek.getDate() + i);
                        const isToday = isSameDay(day, new Date());
                        
                        return (
                            <div
                                key={`header-${i}`}
                                className={`p-2 border border-gray-200 rounded-md text-center ${isToday ? 'bg-blue-50' : ''}`}
                            >
                                <p className="font-medium text-sm">
                                    {format(day, 'EEE')}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {format(day, 'MMM d')}
                                </p>
                            </div>
                        );
                    })}

                    {/* Day cells */}
                    {Array.from({ length: 7 }).map((_, i) => {
                        const day = new Date(startOfWeek);
                        day.setDate(startOfWeek.getDate() + i);
                        const isToday = isSameDay(day, new Date());

                        // Get appointments for this day
                        const dayAppointments = weekAppointments.filter(appointment =>
                            isSameDay(appointment.startTime, day)
                        );

                        return (
                            <div
                                key={`day-${i}`}
                                className={`p-2 border border-gray-200 rounded-md h-48 overflow-y-auto ${isToday ? 'bg-blue-50' : ''}`}
                            >
                                {dayAppointments.length > 0 ? (
                                    <div className="space-y-2">
                                        {dayAppointments.map(appointment => (
                                            <div
                                                key={appointment.id}
                                                className={`p-2 border-l-4 rounded-md cursor-pointer ${getStatusColor(appointment.status)}`}
                                                onClick={() => onSelectAppointment(appointment.id)}
                                            >
                                                <p className="text-xs font-medium">
                                                    {formatAppointmentTime(appointment.startTime)}
                                                </p>
                                                <p className="text-xs capitalize">
                                                    {appointment.type}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 text-center mt-4">
                                        No appointments
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render day view
    const renderDayView = () => {
        // Get appointments for the selected date
        const dayAppointments = getAppointmentsForDate(date);

        // Create time slots (9 AM to 6 PM)
        const timeSlots = Array.from({ length: 10 }).map((_, i) => {
            const hour = i + 9; // Start at 9 AM
            return {
                time: `${hour}:00`,
                hour,
                appointments: dayAppointments.filter(appointment =>
                    appointment.startTime.getHours() === hour
                )
            };
        });

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">
                        {format(date, 'EEEE, MMMM d, yyyy')}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                const newDate = new Date(date);
                                newDate.setDate(date.getDate() - 1);
                                onDateChange(newDate);
                            }}
                        >
                            Previous Day
                        </button>
                        <button
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => {
                                const newDate = new Date(date);
                                newDate.setDate(date.getDate() + 1);
                                onDateChange(newDate);
                            }}
                        >
                            Next Day
                        </button>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-md overflow-hidden">
                    {timeSlots.map((slot, i) => (
                        <div
                            key={slot.time}
                            className={`p-4 flex ${i < timeSlots.length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                            <div className="w-16 mr-4 flex-shrink-0">
                                <p className="text-sm font-medium text-gray-700">
                                    {slot.time}
                                </p>
                            </div>

                            <div className="flex-1">
                                {slot.appointments.length > 0 ? (
                                    <div className="space-y-2">
                                        {slot.appointments.map(appointment => (
                                            <div
                                                key={appointment.id}
                                                className={`p-3 border-l-4 rounded-md cursor-pointer ${getStatusColor(appointment.status)}`}
                                                onClick={() => onSelectAppointment(appointment.id)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <p className="font-medium capitalize">
                                                        {appointment.type}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatAppointmentTime(appointment.startTime)} - {formatAppointmentTime(appointment.endTime)}
                                                    </p>
                                                </div>
                                                {appointment.notes && (
                                                    <p className="text-xs text-gray-700 truncate mt-1">
                                                        {appointment.notes}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render agenda view
    const renderAgendaView = () => {
        // Group appointments by date
        const appointmentsByDate = appointments.reduce((acc, appointment) => {
            const dateStr = format(appointment.startTime, 'yyyy-MM-dd');
            if (!acc[dateStr]) {
                acc[dateStr] = [];
            }
            acc[dateStr].push(appointment);
            return acc;
        }, {} as Record<string, typeof appointments>);

        // Sort dates
        const sortedDates = Object.keys(appointmentsByDate).sort();

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Upcoming Appointments</h2>
                    <div className="relative">
                        <input
                            type="date"
                            value={format(date, 'yyyy-MM-dd')}
                            onChange={(e) => onDateChange(new Date(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                {sortedDates.length > 0 ? (
                    sortedDates.map(dateStr => {
                        const dateAppointments = appointmentsByDate[dateStr];
                        const appointmentDate = new Date(dateStr);

                        return (
                            <div key={dateStr} className="border border-gray-200 rounded-md overflow-hidden mb-4">
                                <div className="p-3 bg-gray-50 border-b border-gray-200">
                                    <h3 className="font-medium">
                                        {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
                                    </h3>
                                </div>

                                <div className="p-3 space-y-2">
                                    {dateAppointments.map(appointment => (
                                        <div
                                            key={appointment.id}
                                            className={`p-3 border-l-4 rounded-md cursor-pointer ${getStatusColor(appointment.status)}`}
                                            onClick={() => onSelectAppointment(appointment.id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium capitalize">
                                                    {appointment.type}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {formatAppointmentTime(appointment.startTime)} - {formatAppointmentTime(appointment.endTime)}
                                                </p>
                                            </div>

                                            {appointment.notes && (
                                                <p className="text-sm mt-2">
                                                    {appointment.notes}
                                                </p>
                                            )}

                                            <div className="mt-2">
                                                <span className="text-xs text-gray-500">
                                                    Status: <span className="capitalize">{appointment.status}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 border border-gray-200 rounded-md text-center">
                        <p className="text-gray-500">No appointments found</p>
                    </div>
                )}
            </div>
        );
    };

    // Render the appropriate view
    const renderView = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4">Loading appointments...</p>
                </div>
            );
        }

        switch (view) {
            case 'month':
                return renderMonthView();
            case 'week':
                return renderWeekView();
            case 'day':
                return renderDayView();
            case 'agenda':
                return renderAgendaView();
            default:
                return renderMonthView();
        }
    };

    return (
        <div>
            {renderView()}
        </div>
    );
};

export default AppointmentCalendar;