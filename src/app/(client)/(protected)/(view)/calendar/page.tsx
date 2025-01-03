'use client';

import type { EventContentArg } from '@fullcalendar/core';
import type { Task } from 'schema';

import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import clsx from 'clsx';
import { useGlobal, useTask } from '@/providers';
import { Card, QueryControls } from '../_components';

enum VIEW {
  DAY_GRID_MONTH = 'dayGridMonth',
  TIME_GRID_WEEK = 'timeGridWeek',
  TIME_GRID_DAY = 'timeGridDay',
  LIST_WEEK = 'listWeek',
  MULTI_MONTH_YEAR = 'multiMonthYear',
  MULTI_MONTH = 'multiMonth',
}

/* */

enum TITLE_FORMAT {
  NUMERIC = 'numeric',
  TWO_DIGIT = '2-digit',
  SHORT = 'short',
  LONG = 'long',
  NARROW = 'narrow',
}
export default function TimelineViewPage() {
  const { tasks } = useTask();
  const [eventsWithDate, eventsWithoutDate] = parseEvents(tasks);
  const { _refresh } = useGlobal();

  // TimeGridWeekView
  // const events = tasks
  //   ?.filter((task) => {
  //     if (!task.start_date || !task.due_date) {
  //       return false; // Exclude tasks without either start or end dates
  //     }
  //     const start = new Date(task.start_date);
  //     const end = new Date(task.due_date);

  //     // Normalize start and end to midnight for day calculations
  //     const startDay = startOfDay(start);
  //     const endDay = startOfDay(end);

  //     // Calculate the number of full calendar days between start and end
  //     const fullDaysBetween = differenceInCalendarDays(endDay, startDay);

  //     // If the event spans more than 1 day
  //     if (fullDaysBetween > 1) {
  //       // Check if the event includes at least one full calendar day
  //       const startsAtMidnight =
  //         isSameDay(start, startDay) &&
  //         start.getHours() === 0 &&
  //         start.getMinutes() === 0;
  //       const endsAtMidnight =
  //         isSameDay(end, endDay) &&
  //         end.getHours() === 0 &&
  //         end.getMinutes() === 0;

  //       // If both conditions are true, it spans a full day, exclude it
  //       if (startsAtMidnight && endsAtMidnight) {
  //         return false;
  //       }

  //       // Check if it contains any full calendar day (between start and end)
  //       for (let day = 1; day < fullDaysBetween; day++) {
  //         const intermediateDay = addDays(startDay, day);

  //         // If the intermediate day is strictly between start and end, exclude the task
  //         if (
  //           isAfter(intermediateDay, start) &&
  //           isBefore(intermediateDay, end)
  //         ) {
  //           return false;
  //         }
  //       }
  //     }

  //     return true; // Include valid tasks
  //   })
  //   .map((task) => ({
  //     id: task.id,
  //     title: task.title,
  //     start: task.start_date,
  //     end: task.due_date,
  //     allDay: false, // Explicitly ensure it's a timed event
  //   }));

  // ListWeekView
  // const events = tasks
  //   ?.map((task) => {
  //     if (task.start_date && !task.due_date) {
  //       // Only start date is provided
  //       return {
  //         id: task.id,
  //         title: task.title,
  //         start: task.start_date, // Ensure this is ISO 8601 or Date
  //         allDay: true,
  //       };
  //     } else if (!task.start_date && task.due_date) {
  //       // Only end date is provided
  //       return {
  //         id: task.id,
  //         title: task.title,
  //         start: task.due_date, // Treat end date as start date
  //         allDay: true,
  //       };
  //     } else if (task.start_date && task.due_date) {
  //       // Both start and end dates are provided
  //       return {
  //         id: task.id,
  //         title: task.title,
  //         start: task.start_date, // Ensure this is ISO 8601 or Date
  //         end: task.due_date, // Ensure this is ISO 8601 or Date
  //         allDay: true,
  //       };
  //     }
  //     // Skip tasks without either start or end dates
  //     return null;
  //   })
  //   .filter((event) => event !== null); // Filter out null values

  // const events = tasks?.map((task) => ({
  //   id: task.id,
  //   title: task.title,
  //   start: task.start_date,
  //   end: task.due_date,
  // }));

  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [_refresh, router]);

  useEffect(() => {
    const containerEl = document.querySelector('#events');
    if (containerEl) {
      new Draggable(containerEl as HTMLElement, {
        itemSelector: '.event',
        eventData: (eventEl) => {
          const titleEl = eventEl.querySelector('.title'); // Find the element with class 'title'
          return {
            title: titleEl
              ? titleEl.textContent || 'Untitled event'
              : 'Untitled event',
          };
        },
      });
    }
  }, []);

  function eventResizeHandler(info: any) {
    // Handle the event resize
    const { event } = info;

    // Update the event in your backend or state here
    // Example:
    // updateEventInBackend({
    //   id: event.id,
    //   start: event.start,
    //   end: event.end,
    // });
    console.log('resize', event);
  }

  function eventDropHandler(info: any) {
    // Handle the event drop
    const { event } = info;

    // Update the event in your backend or state here
    // Example:
    // updateEventInBackend({
    //   id: event.id,
    //   start: event.start,
    //   end: event.end,
    // });
    console.log('drop', event);
  }

  const handleEventReceive = (info: any) => {
    // Handle the dropped event
    const { event } = info;

    // Save the dropped event to your backend or state here
    // Example:
    // saveEventToBackend({
    //   id: event.id,
    //   title: event.title,
    //   start: event.start,
    //   backgroundColor: event.backgroundColor,
    // });
    console.log('add', event);
  };

  const clickEventHandler = (info: any) => {
    const { event } = info;
    router.push(`${ROUTE.TASK}/${event.id}`);
  };

  return (
    <div className="size-full p-4 pr-0 ">
      <h2 className={clsx('text-2xl font-semibold italic', 'mb-5')}>
        Calendar
      </h2>
      <div className="flex h-[calc(100%-3.25rem)]">
        <div
          className={clsx('h-full flex-grow', 'overflow-y-scroll no-scrollbar')}
        >
          <FullCalendar
            events={eventsWithDate}
            initialView={VIEW.DAY_GRID_MONTH}
            headerToolbar={{
              start: 'prev,next today',
              center: 'title',
              end: 'timeGridDay,timeGridWeek,dayGridMonth',
            }}
            views={{
              timeGridDay: {
                buttonText: 'Day',
                titleFormat: {
                  month: TITLE_FORMAT.SHORT,
                  day: TITLE_FORMAT.NUMERIC,
                },
              },
              timeGridWeek: {
                buttonText: 'Week',
                titleFormat: {
                  month: TITLE_FORMAT.SHORT,
                  day: TITLE_FORMAT.NUMERIC,
                },
              },
              dayGridMonth: {
                buttonText: 'Month',
                titleFormat: { month: TITLE_FORMAT.LONG },
              },
            }}
            // Features
            editable
            droppable
            eventResizableFromStart
            eventDurationEditable
            eventContent={renderEventContent}
            eventClick={clickEventHandler}
            eventResize={eventResizeHandler}
            eventDrop={eventDropHandler}
            eventReceive={handleEventReceive}
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              multiMonthPlugin,
              listPlugin,
              timeGridPlugin,
            ]}
          />
        </div>

        <div className="w-80 h-full ml-4 border-l border-divider px-4 pb-4">
          <QueryControls sort={false} filter={false} />

          <ul
            className="space-y-3 mt-4 overflow-y-auto max-h-[46rem] "
            id="events"
          >
            {eventsWithoutDate.map((event) => (
              <li className={clsx('event', 'cursor-pointer')} key={event.id}>
                <Link href={`${ROUTE.TASK}/${event.id}`}>
                  <Card data={event} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlag,
  faLocationDot,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { getContrastColor } from '@/utilities';
import { useEffect } from 'react';
import { ROUTE } from '@/constants/serverConfig';
import Link from 'next/link';

function renderEventContent(eventInfo: EventContentArg) {
  const type = eventInfo.event.extendedProps.timeType;
  const icon =
    type === 'both' ? faClock : type === 'start' ? faFlag : faLocationDot;

  const hasBackgroundColor = !!eventInfo.event.backgroundColor;
  const style = hasBackgroundColor
    ? {
        backgroundColor: eventInfo.event.backgroundColor,
        color: getContrastColor(eventInfo.event.backgroundColor),
      }
    : undefined;

  return (
    <div className={clsx('flex items-center', 'px-2')} style={style}>
      <FontAwesomeIcon icon={icon} className="size-3" />
      {type !== 'both' && (
        <span className="ml-1">
          {eventInfo.timeText || eventInfo.event.startStr}
        </span>
      )}
      <span className="ml-1 font-semibold">{eventInfo.event.title}</span>
    </div>
  );
}

type TimeType = 'start' | 'end' | 'both';
type Event = {
  id: string;
  title: string;
  start?: Task['start_date'];
  end?: Task['due_date'];
  allDay?: boolean;
  timeType?: TimeType;
} & Partial<EventContentArg> &
  Task;

function parseEvents(tasks?: Task[]) {
  if (!tasks) return [[], []]; // Return empty arrays if tasks are undefined

  const eventsWithDate: Event[] = [];
  const eventsWithoutDate: Event[] = [];

  tasks.forEach((task) => {
    if (task.start_date && !task.due_date) {
      eventsWithDate.push({
        ...task,
        start: task.start_date,
        timeType: 'start' as TimeType,
      });
    } else if (!task.start_date && task.due_date) {
      eventsWithDate.push({
        ...task,
        start: task.due_date,
        timeType: 'end' as TimeType,
      });
    } else if (task.start_date && task.due_date) {
      eventsWithDate.push({
        ...task,
        start: task.start_date,
        end: task.due_date,
        allDay: true,
        timeType: 'both' as TimeType,
        backgroundColor: task.cover,
        borderColor: task.cover,
      });
    } else {
      eventsWithoutDate.push({
        ...task,
      });
    }
  });

  return [eventsWithDate, eventsWithoutDate];
}
