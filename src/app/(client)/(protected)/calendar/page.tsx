'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

const initialEvents = [
  {
    id: '1',
    title: 'Meeting',
    start: '2024-12-13T10:00:00',
    end: '2024-12-15T12:00:00',
    allDay: true,
  },
  {
    id: '2',
    title: 'Conference',
    start: '2024-12-16T14:00:00',
    end: '2024-12-18T16:00:00',
    allDay: true,
  },
];

export default function TimelineViewPage() {
  // const handleEventResize = (resizeInfo: any) => {
  //   const { event } = resizeInfo;
  //   // Update your events array or trigger a state update
  //   console.log('Event resized:', event.title, event.start, event.end);
  // };

  return (
    <div className="size-full">
      <h1>Demo App</h1>
      <FullCalendar
        events={initialEvents}
        initialView="dayGridMonth"
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
          listPlugin,
          timeGridPlugin,
        ]}
        editable // Allows dragging of events
        droppable // Allows dragging external events
        eventResizableFromStart
        eventDurationEditable
        eventContent={renderEventContent}
        // eventResize={handleEventResize}
      />
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
