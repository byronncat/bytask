'use client';

import type {
  DatesSetArg,
  EventContentArg,
  EventDropArg,
} from '@fullcalendar/core';
import type {
  EventResizeDoneArg,
  EventReceiveArg,
} from '@fullcalendar/interaction';
import type { Task } from 'schema';

import Link from 'next/link';
import { TASK_PRIORITY, TASK_STATUS } from '@/constants/metadata';
import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  faFlag,
  faLocationDot,
  faClock,
  faCheck,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import { getContrastColor, isOverdue } from '@/utilities';
import { useGlobal, useTask } from '@/providers';
import { Card, QueryControls } from '../_components';
import { ROUTE } from '@/constants/serverConfig';

enum VIEW {
  DAY_GRID_MONTH = 'dayGridMonth',
  TIME_GRID_WEEK = 'timeGridWeek',
  TIME_GRID_DAY = 'timeGridDay',
  LIST_WEEK = 'listWeek',
  MULTI_MONTH_YEAR = 'multiMonthYear',
  MULTI_MONTH = 'multiMonth',
}

enum TITLE_FORMAT {
  NUMERIC = 'numeric',
  TWO_DIGIT = '2-digit',
  SHORT = 'short',
  LONG = 'long',
  NARROW = 'narrow',
}
export default function TimelineViewPage() {
  const { tasks, updateTask } = useTask();

  const router = useRouter();
  const { _refresh } = useGlobal();
  useEffect(() => {
    router.refresh();
  }, [_refresh, router]);

  const [currentView, setCurrentView] = useState<string>(VIEW.DAY_GRID_MONTH);
  const [[eventsWithDate, eventsWithoutDate], setEvents] = useState<
    [Event[], Event[]]
  >([[], []]);
  const handleDatesSet = (arg: DatesSetArg) => {
    setCurrentView(arg.view.type);
  };
  useEffect(() => {
    setEvents(parseEvents(tasks, currentView));
  }, [tasks, currentView]);

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
            id: eventEl.getAttribute('data-id') || '',
            status: eventEl.getAttribute('data-status') || TASK_STATUS.TODO,
            priority:
              eventEl.getAttribute('data-priority') || TASK_PRIORITY.LOW,
            backgroundColor: eventEl.getAttribute('data-color') || '',
          };
        },
      });
    }
  }, []);

  function eventResizeHandler(info: EventResizeDoneArg) {
    const { event } = info;
    const data = {
      id: event.id,
      title: event.title,
      cover: event.backgroundColor,
      priority: event.extendedProps.priority,
      status: event.extendedProps.status,
      start_date: event.start,
      due_date: event.end,
    } as Partial<Task>;
    updateTask(data);
  }

  function eventDropHandler(info: EventDropArg) {
    const { event } = info;
    const data = {
      id: event.id,
      title: event.title,
      cover: event.backgroundColor,
      priority: event.extendedProps.priority,
      status: event.extendedProps.status,
      start_date: event.start,
      due_date: event.end,
    } as Partial<Task>;
    updateTask(data);
  }

  const handleEventReceive = (info: EventReceiveArg) => {
    const { event } = info;
    if (!event.start) return;
    const data = {
      id: event.id,
      title: event.title,
      cover: event.backgroundColor,
      priority: event.extendedProps.priority,
      status: event.extendedProps.status,
      start_date: event.start,
      due_date: addDays(event.start, 1),
    } as Partial<Task>;
    updateTask(data);
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
            datesSet={handleDatesSet}
          />
        </div>

        <div className="w-80 h-full ml-4 border-l border-divider px-4 pb-4">
          <QueryControls sort={false} filter={false} />

          <ul
            className="space-y-3 mt-4 overflow-y-auto max-h-[46rem] "
            id="events"
          >
            {eventsWithoutDate.map((event) => (
              <li
                className={clsx('event', 'cursor-pointer')}
                key={event.id}
                data-id={event.id}
                data-status={event.status}
                data-color={event.cover}
                data-priority={event.priority}
              >
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

function renderEventContent(eventInfo: EventContentArg) {
  let icon;
  if (eventInfo.event.extendedProps.status === TASK_STATUS.DONE) icon = faCheck;
  else if (isOverdue(eventInfo.event.extendedProps['due_date']))
    icon = faTriangleExclamation;
  else if (eventInfo.event.allDay) icon = faClock;
  else if (eventInfo.event.extendedProps['start_date']) icon = faFlag;
  else icon = faLocationDot;
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
      <span className="ml-1 font-semibold">{eventInfo.event.title}</span>
    </div>
  );
}

type Event = Task & {
  start?: Task['start_date'];
  end?: Task['due_date'];
  allDay?: boolean;
} & Partial<EventContentArg>;

function parseEvents(tasks?: Task[], currentView?: string): [Event[], Event[]] {
  if (!tasks) return [[], []];

  const eventsWithDate: Event[] = [];
  const eventsWithoutDate: Event[] = [];

  tasks.forEach((task) => {
    if (task.start_date && !task.due_date) {
      eventsWithDate.push({
        ...task,
        start: task.start_date,
      });
    } else if (!task.start_date && task.due_date) {
      eventsWithDate.push({
        ...task,
        start: task.due_date,
      });
    } else if (task.start_date && task.due_date) {
      eventsWithDate.push({
        ...task,
        start: task.start_date,
        end: task.due_date,
        allDay: currentView === VIEW.DAY_GRID_MONTH,
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
