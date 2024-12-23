## General

Public domain: [https://bytask.vercel.app/](https://bytask.vercel.app/)

## Features

- [ ] Authentication & Profile Management

  - [ ] Sign Up: Create an account using email and password or social sign-in.
  - [ ] Login: Access accounts via email/password or social sign-in.
  - [ ] Logout: Securely terminate user sessions.
  - [ ] Update full name, profile picture, and password.

- [ ] Scheduling & Task Management

  - [ ] Task Management:

    - [ ] Users click on the “Add Task” button and input some fields such as task name, description, priority level (High/Medium/Low), estimated time, status (Todo/In Progress/Completed/Expired)
    - [ ] Users can view the list of tasks, search tasks, filter, or sort them based on their priority and status.
    - [ ] Users can click on any specific task to update or delete it from the task list.

  - [ ] Task Scheduling (Calendar view):

    - [ ] Users distribute tasks into available time slots by dragging and dropping tasks onto a calendar interface.
    - [ ] The status of the tasks can be automatically updated if these tasks are distributed on the calendar. For example, The task is “Todo” but if the users drag it to the past, it becomes “Expired”.

  - [ ] AI Suggestions:

    - [ ] Users click on “Analyze Schedule" to send task data, and schedule details to an LLM.
    - [ ] Provide feedback on potential adjustments, such as:
      - [ ] Warning about overly tight schedules that may lead to burnout.
      - [ ] Recommending prioritization changes for improved focus and balance.

- [ ] Focus Timer

  - [ ] Start the focus timer:

    - [ ] Users choose a task on the calendar interface, set timer duration (e.g., 25 minutes for a Pomodoro session) and optional break duration (e.g. 5 minutes), and then start a timer for that task to track focus sessions.
    - [ ] Display session duration and provide visual cues like a countdown or progress bar.

  - [ ] During the timer session:

    - [ ] Users focus on the task while the timer runs and can not use other in-app features.
    - [ ] They can end the timer early if needed.

  - [ ] End of the timer session:

    - [ ] At the end of the timer session, users receive a notification that the session is complete.
    - [ ] They can mark the task as completed, start the break timer, or restart the focus timer for another session.

  - [ ] Note and edge cases:

    - [ ] Prevent starting the timer for tasks that are not “In progress”.
    - [ ] If the task deadline is met before the timer ends, end the timer immediately and notify the user.

- [ ] Analytics

  - [ ] Visualize user progress using focus session data.
  - [ ] Display some necessary analytic information:

    - [ ] Total time spent / Total estimated time
    - [ ] Total time spent daily
    - [ ] Total tasks of each status

  - [ ] AI feedback:

    - [ ] Identifying areas where the user is excelling.
    - [ ] Suggesting subjects or tasks that may need more attention.
    - [ ] Offering motivational feedback to encourage consistency and improvement.
