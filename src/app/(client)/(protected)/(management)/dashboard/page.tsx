'use client';

import type { JSX } from 'react';
import type { ChartData } from 'chart.js/auto';
import type {
  CompareTimeAnalytics,
  DailyTimeAnalytics,
  TaskStatusAnalytics,
} from 'analytics';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { faRocket, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { aiAction, analyticsAction } from '@/api';
import { Chart } from './_component';
import { TASK_STATUS } from '@/constants/metadata';
import { ANALYTICS_RANGE, ANALYTICS_REQUIREMENT } from '@/constants/analytics';

export default function DashboardPage() {
  const [taskStatusChart, setTaskStatusChart] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: [
      {
        label: 'Task Status Distribution',
        data: [],
        backgroundColor: [],
      },
    ],
  });
  const [dailyTimeChart, setDailyTimeChart] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Daily Time Spent',
        data: [],
        backgroundColor: [],
      },
    ],
  });
  const [compareTimeChart, setCompareTimeChart] = useState<
    ChartData<'bar' | 'line'>
  >({
    labels: [],
    datasets: [
      {
        label: 'Initial Dataset',
        type: 'bar',
        data: [],
        backgroundColor: [],
      },
    ],
  });
  const { theme } = useTheme();

  const fetchTaskStatusChartData = useCallback(async () => {
    const { success, data } =
      await analyticsAction.analyzeTaskStatus<TaskStatusAnalytics>({
        field: ANALYTICS_REQUIREMENT.TASK_STATUS,
        range: ANALYTICS_RANGE.MONTHLY,
      });

    if (success && data) {
      setTaskStatusChart((prev) => ({
        ...prev,
        labels: data.map(
          (item: TaskStatusAnalytics) => statusToTextMap[item.status],
        ),
        datasets: [
          {
            ...prev.datasets[0],
            data: data.map((item: TaskStatusAnalytics) => item.count),
            backgroundColor: data.map(
              (item: TaskStatusAnalytics) => statusToColorMap[item.status],
            ),
            borderColor:
              theme === 'dark'
                ? 'rgba(40, 46, 51, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
            text: theme === 'dark' ? 'white' : 'black',
          },
        ],
      }));
    }
  }, [theme]);

  const fetchDailyTimeChartData = useCallback(async () => {
    const { success, data } =
      await analyticsAction.analyzeTaskStatus<DailyTimeAnalytics>({
        field: ANALYTICS_REQUIREMENT.DAILY_TIME,
        range: ANALYTICS_RANGE.MONTHLY,
      });

    if (success && data) {
      setDailyTimeChart((prev) => ({
        ...prev,
        labels: data.map((item: DailyTimeAnalytics) =>
          format(new Date(item.date), 'dd MMM yyyy'),
        ),
        datasets: [
          {
            ...prev.datasets[0],
            data: data.map((item: DailyTimeAnalytics) => item.totalTimeSpent),
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgba(54, 162, 235, 0.3)',
            text: theme === 'dark' ? 'white' : 'black',
          },
        ],
      }));
    }
  }, [theme]);

  const fetchCompareTimeChartData = useCallback(async () => {
    const { success, data } =
      await analyticsAction.analyzeTaskStatus<CompareTimeAnalytics>({
        field: ANALYTICS_REQUIREMENT.COMPARE_TIME,
        range: ANALYTICS_RANGE.MONTHLY,
      });

    if (success && data) {
      setCompareTimeChart((prev: any) => ({
        ...prev,
        labels: data.map((item: CompareTimeAnalytics) => item.task_title),
        datasets: [
          {
            ...prev.datasets[0],
            label: 'Total Time Spent',
            type: 'bar',
            data: data.map((item: any) => item.totalTimeSpent),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: 'Total Time Estimated',
            type: 'line',
            data: data.map((item: any) => item.totalTimeEstimated),
            backgroundColor: 'rgb(252, 81, 118)',
            borderColor: 'rgba(252, 81, 118, 0.2)',
          },
        ],
      }));
    }
  }, []);

  useEffect(() => {
    fetchTaskStatusChartData();
    fetchDailyTimeChartData();
    fetchCompareTimeChartData();
  }, [
    fetchTaskStatusChartData,
    fetchDailyTimeChartData,
    fetchCompareTimeChartData,
  ]);

  const [ScheduleAnalytics, setScheduleAnalytics] = useState<JSX.Element>();
  const fetchAi = useCallback(async () => {
    const { success, data } = await aiAction.analyzeSchedule();
    if (success && data) {
      setScheduleAnalytics(parseMarkdownToJSX(data));
    }
  }, []);

  useEffect(() => {
    fetchAi();
  }, [fetchAi]);

  function parseMarkdownToJSX(text: string) {
    let parsedText = text
      .replace(/\*\*(.*?)\*\*/g, (match, p1) => `<strong>${p1}</strong>`)
      .replace(/\*(.*?)\*/g, (match, p1) => `<em>${p1}</em>`);

    parsedText = parsedText.replace(
      /- (.*?)(?=\n|$)/g,
      (match, p1) => `<li>${p1}</li>`,
    );
    parsedText = parsedText.replace(/\n/g, '<br />');
    parsedText = parsedText.replace(
      /(<li>.*?<\/li>)/g,
      (match) => `<ul>${match}</ul>`,
    );
    return <div dangerouslySetInnerHTML={{ __html: parsedText }} />;
  }

  return (
    <div className={clsx('grid grid-cols-2 gap-6', 'w-full')}>
      <div
        className={clsx(
          'bg-foreground',
          'p-6 rounded-lg shadow-lg',
          'col-span-2 lg:col-span-1',
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div
            className={clsx(
              'flex items-center space-x-4',
              'text-on-foreground',
            )}
          >
            <FontAwesomeIcon icon={faRocket} className="size-5" />
            <h2 className="font-semibold text-lg">AI Analysis of Schedule</h2>
          </div>
          <button
            type="button"
            onClick={fetchAi}
            className="hover:opacity-60 transition-opacity duration-200"
          >
            <FontAwesomeIcon icon={faRotate} className="size-5" />
          </button>
        </div>
        {ScheduleAnalytics || <SkeletonLoading />}
      </div>
      <div
        className={clsx(
          'bg-foreground',
          'p-6 rounded-lg shadow-lg',
          'col-span-2 lg:col-span-1',
        )}
      >
        <h2 className={clsx('font-semibold text-lg', 'mb-8')}>
          Total tasks of each status
        </h2>
        <div className="w-full aspect-square">
          <Chart data={taskStatusChart} type="pie" />
        </div>
      </div>
      <div
        className={clsx(
          'bg-foreground',
          'px-6 py-8 rounded-lg shadow-lg',
          'col-span-2',
          'text-on-foreground',
        )}
      >
        <h2 className={clsx('font-semibold text-lg', 'mb-8')}>
          Total time spent / Total estimated time
        </h2>
        <Chart data={compareTimeChart} type="bar" />
      </div>
      <div
        className={clsx(
          'bg-foreground',
          'px-6 py-8 rounded-lg shadow-lg',
          'col-span-2',
        )}
      >
        <h2 className={clsx('font-bold text-xl', 'mb-8')}>
          Total time spent daily
        </h2>
        <Chart data={dailyTimeChart} type="line" />
      </div>
    </div>
  );
}

const statusToColorMap: Record<TASK_STATUS, string> = {
  [TASK_STATUS.TODO]: 'rgb(201, 203, 207)',
  [TASK_STATUS.IN_PROGRESS]: 'rgb(54, 162, 235)',
  [TASK_STATUS.ON_HOLD]: 'rgb(255, 205, 86)',
  [TASK_STATUS.REVIEW]: 'rgb(153, 102, 255)',
  [TASK_STATUS.BLOCKED]: 'rgb(238, 126, 150)',
  [TASK_STATUS.DONE]: 'rgb(75, 192, 96)',
  [TASK_STATUS.ARCHIVED]: 'rgb(151, 153, 156)',
  [TASK_STATUS.CANCELED]: 'rgb(255, 159, 64)',
  [TASK_STATUS.OVERDUE]: 'rgb(252, 81, 118)',
};

const statusToTextMap: Record<TASK_STATUS, string> = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.ON_HOLD]: 'On Hold',
  [TASK_STATUS.REVIEW]: 'Review',
  [TASK_STATUS.BLOCKED]: 'Blocked',
  [TASK_STATUS.DONE]: 'Done',
  [TASK_STATUS.ARCHIVED]: 'Archived',
  [TASK_STATUS.CANCELED]: 'Canceled',
  [TASK_STATUS.OVERDUE]: 'Overdue',
};

const SkeletonLoading = () => {
  return (
    <div className="space-y-4 p-4 max-w-3xl mx-auto">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>

      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
      </div>
    </div>
  );
};
