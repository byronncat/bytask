import React from 'react';
import clsx from 'clsx';

const MonthCalendar = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get the first and last day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Get the day of the week for the first and last day of the month
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const lastDayOfWeek = lastDayOfMonth.getDay();

  // Generate an array of days for the current month
  const daysInMonth = [];
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentYear, currentMonth, i));
  }

  // Generate empty days for the previous and next month to fill the calendar grid
  const emptyDaysBefore = Array.from(
    { length: firstDayOfWeek },
    (_, i) => null,
  );
  const emptyDaysAfter = Array.from(
    { length: 6 - lastDayOfWeek },
    (_, i) => null,
  );

  // Combine all days to create the calendar grid
  const calendarDays = [...emptyDaysBefore, ...daysInMonth, ...emptyDaysAfter];

  return (
    <div className="grid grid-cols-7 gap-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="font-bold text-center">
          {day}
        </div>
      ))}
      {calendarDays.map((day, index) => (
        <div
          key={index}
          className={clsx(
            'h-16 flex items-center justify-center border',
            day ? 'bg-white' : 'bg-gray-100',
          )}
        >
          {day && day.getDate()}
        </div>
      ))}
    </div>
  );
};

const DayView = () => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <!-- Left Panel: Schedule --> */}
      <div className="flex-1 p-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">January 22, 2022</h1>
          <p className="text-gray-500">Saturday</p>
        </div>
        <div className="relative border border-gray-200 rounded-lg overflow-y-auto h-[80vh]">
          {/* <!-- Time Slots --> */}
          <div className="grid grid-rows-24 divide-y divide-gray-200 text-sm">
            {/* <!-- 6 AM --> */}
            <div className="relative h-16">
              <p className="absolute top-0 left-2 text-gray-400">6 AM</p>
              <div className="absolute top-2 left-16 bg-blue-100 text-blue-700 text-xs p-2 rounded-lg w-5/6">
                <p>6:00 AM</p>
                <p className="font-medium">Breakfast</p>
              </div>
            </div>
            {/* <!-- 7 AM --> */}
            <div className="relative h-16">
              <p className="absolute top-0 left-2 text-gray-400">7 AM</p>
              <div className="absolute top-2 left-16 bg-pink-100 text-pink-700 text-xs p-2 rounded-lg w-5/6">
                <p>7:30 AM</p>
                <p className="font-medium">Flight to Paris</p>
                <p className="text-gray-500">
                  John F. Kennedy International Airport
                </p>
              </div>
            </div>
            {/* <!-- 11 AM --> */}
            <div className="relative h-16">
              <p className="absolute top-0 left-2 text-gray-400">11 AM</p>
              <div className="absolute top-2 left-16 bg-blue-100 text-blue-700 text-xs p-2 rounded-lg w-5/6">
                <p>11:00 AM</p>
                <p className="font-medium">Sightseeing</p>
                <p className="text-gray-500">Eiffel Tower</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Right Panel: Calendar --> */}
      <div className="w-1/3 p-6 bg-white shadow-md border-l border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">January 2022</h2>
          <div className="flex space-x-2">
            <button className="px-2 py-1 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100">
              &lt;
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>
        {/* <!-- Calendar Grid --> */}
        <div className="grid grid-cols-7 text-center text-sm">
          {/* <!-- Days of the Week --> */}
          <p className="font-medium text-gray-500">M</p>
          <p className="font-medium text-gray-500">T</p>
          <p className="font-medium text-gray-500">W</p>
          <p className="font-medium text-gray-500">T</p>
          <p className="font-medium text-gray-500">F</p>
          <p className="font-medium text-gray-500">S</p>
          <p className="font-medium text-gray-500">S</p>
          {/* <!-- Calendar Days --> */}
          <p className="text-gray-400">27</p>
          <p className="text-gray-400">28</p>
          <p className="text-gray-400">29</p>
          <p className="text-gray-400">30</p>
          <p className="text-gray-400">31</p>
          <p className="text-gray-900">1</p>
          <p className="text-gray-900">2</p>
          {/* <!-- Highlighted Date --> */}
          <p className="text-gray-900 bg-purple-200 rounded-full px-2">22</p>
        </div>
      </div>
    </div>
  );
};

const WeekView = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Week View</h2>
      <div className="grid grid-cols-8 gap-2">
        <div></div> {/* Empty cell for the time column */}
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="h-16 border flex items-center px-4">{hour}</div>
            {daysOfWeek.map((day) => (
              <div key={day} className="h-16 border"></div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const YearView = () => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Year View</h2>
        <div className="grid grid-cols-3 gap-4">
          {months.map((month) => (
            <div key={month} className="border p-4">
              <h3 className="text-xl font-bold mb-2">{month}</h3>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <div key={day} className="text-center font-bold">
                      {day}
                    </div>
                  ),
                )}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                  <div
                    key={date}
                    className="h-8 flex items-center justify-center border"
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-lg font-semibold mb-4">Upcoming events</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <p className="text-gray-500 text-sm">Wed, Jan 12</p>
            <p className="text-gray-400 text-sm">Nothing on today’s schedule</p>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <p className="text-gray-500 text-sm">Thu, Jan 13</p>
            <div>
              <p className="text-gray-800 font-medium text-sm">
                View house with real estate agent
              </p>
              <p className="text-gray-400 text-xs">2:30 PM - 4:30 PM</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <p className="text-gray-500 text-sm">Fri, Jan 14</p>
            <p className="text-gray-800 font-medium text-sm">
              Meeting with bank manager
            </p>
            <p className="text-gray-400 text-xs">All day</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">Mon, Jan 17</p>
            <div>
              <p className="text-gray-800 font-medium text-sm">
                Sign paperwork at lawyers
              </p>
              <p className="text-gray-400 text-xs">10:00 AM - 10:15 AM</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <MonthCalendar />
      <DayView />
      <WeekView />
      <YearView />
      {/* Render calendar days and events here */}
    </div>
  );
}
