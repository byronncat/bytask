import type {
  TaskStatusAnalytics,
  DailyTimeAnalytics,
  CompareTimeAnalytics,
} from 'analytics';
import type { NextRequest } from 'next/server';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import { authAction_v2 } from '@/api';
import { TaskModel, TimeSessionModel } from '@/database';
import { STATUS_CODE } from '@/constants/serverConfig';
import { ANALYTICS_REQUIREMENT } from '@/constants/analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // const range = searchParams.get('range') as ANALYTICS_RANGE;
    const field = searchParams.get('field') as ANALYTICS_REQUIREMENT;

    const sessionPayload = await authAction_v2.authenticate();
    if (!sessionPayload) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: STATUS_CODE.UNAUTHORIZED,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const matchFilter: Record<string, any> = {
      uid: sessionPayload.user.id,
    };

    if (field === ANALYTICS_REQUIREMENT.COMPARE_TIME) {
      // const compareTimeAnalytics: CompareTimeAnalytics[] =
      //   await TaskModel.aggregate([
      //     {
      //       $match: {
      //         ...matchFilter,
      //         start_date: { $exists: true, $ne: null },
      //         due_date: { $exists: true, $ne: null },
      //       },
      //     },
      //     {
      //       $lookup: {
      //         from: 'times',
      //         localField: 'id',
      //         foreignField: 'task_id',
      //         as: 'timeSessions',
      //       },
      //     },
      //     {
      //       $addFields: {
      //         timeSessions: {
      //           $map: {
      //             input: '$timeSessions',
      //             as: 'session',
      //             in: {
      //               $mergeObjects: [
      //                 '$$session',
      //                 {
      //                   task_id: {
      //                     $toObjectId: '$$session.task_id', // Convert task_id to ObjectId
      //                   },
      //                 },
      //               ],
      //             },
      //           },
      //         },
      //       },
      //     },
      //     // {
      //     //   $addFields: {
      //     //     totalTimeEstimated: {
      //     //       $divide: [
      //     //         {
      //     //           $subtract: [
      //     //             { $toDate: '$due_date' },
      //     //             { $toDate: '$start_date' },
      //     //           ],
      //     //         },
      //     //         1000 * 60 * 60 * 24, // Convert milliseconds to days
      //     //       ],
      //     //     },
      //     //     totalTimeSpent: {
      //     //       $sum: {
      //     //         $map: {
      //     //           input: '$timeSessions',
      //     //           as: 'session',
      //     //           in: {
      //     //             $divide: [
      //     //               {
      //     //                 $subtract: [
      //     //                   { $toDate: '$$session.end_at' },
      //     //                   { $toDate: '$$session.start_at' },
      //     //                 ],
      //     //               },
      //     //               1000 * 60 * 60 * 24, // Convert milliseconds to days
      //     //             ],
      //     //           },
      //     //         },
      //     //       },
      //     //     },
      //     //   },
      //     // },
      //     // {
      //     //   $project: {
      //     //     task_title: '$title',
      //     //     totalTimeEstimated: 1,
      //     //     totalTimeSpent: 1,
      //     //   },
      //     // },
      //   ]);

      const tasksWithValidDates = await TaskModel.aggregate([
        {
          $match: {
            ...matchFilter,
            start_date: { $ne: null },
            due_date: { $ne: null },
          },
        },
        {
          $addFields: {
            start_date_converted: { $toDate: '$start_date' },
            due_date_converted: { $toDate: '$due_date' },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            totalTimeEstimated: {
              $divide: [
                { $subtract: ['$due_date_converted', '$start_date_converted'] },
                1000 * 60 * 60, // Convert to hours
              ],
            },
          },
        },
      ]);

      // Get the task IDs with valid dates
      const validTaskIds = tasksWithValidDates.map((task) => task._id);

      // Get time spent from time sessions for valid tasks
      const timeSpentByTask = await TimeSessionModel.aggregate([
        {
          $match: {
            ...matchFilter,
            task_id: { $in: validTaskIds.map((id) => id.toString()) },
          },
        },
        {
          $addFields: {
            start_at_date: { $toDate: '$start_at' },
            end_at_date: { $toDate: '$end_at' },
          },
        },
        {
          $group: {
            _id: '$task_id',
            totalTimeSpent: {
              $sum: {
                $divide: [
                  { $subtract: ['$end_at_date', '$start_at_date'] },
                  1000 * 60 * 60, // Convert to hours
                ],
              },
            },
          },
        },
      ]);

      // Combine the results
      const compareTimeAnalytics: CompareTimeAnalytics[] = tasksWithValidDates
        .map((task) => {
          const timeSpent = timeSpentByTask.find(
            (t) => t._id === task._id.toString(),
          );

          return {
            task_title: task.title,
            totalTimeEstimated: Number(task.totalTimeEstimated.toFixed(2)),
            totalTimeSpent: timeSpent
              ? Number(timeSpent.totalTimeSpent.toFixed(2))
              : 0,
          };
        })
        .filter(
          (analytics) =>
            analytics.totalTimeEstimated > 0 || analytics.totalTimeSpent > 0,
        );

      return new Response(JSON.stringify(compareTimeAnalytics), {
        status: STATUS_CODE.OK,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (field === ANALYTICS_REQUIREMENT.DAILY_TIME) {
      const now = new Date();
      const pastWeekDates = eachDayOfInterval({
        start: subDays(now, 6),
        end: now,
      }).map((date) => format(date, 'yyyy-MM-dd'));

      const dailyTimeAnalytics: DailyTimeAnalytics[] =
        await TimeSessionModel.aggregate([
          { $match: matchFilter },
          {
            $addFields: {
              start_at_date: { $toDate: '$start_at' },
              end_at_date: { $toDate: '$end_at' },
            },
          },
          {
            $project: {
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$start_at_date' },
              },
              duration: {
                $subtract: ['$end_at_date', '$start_at_date'],
              },
            },
          },
          {
            $group: {
              _id: '$date',
              totalTimeSpent: { $sum: '$duration' },
            },
          },
          {
            $project: {
              date: '$_id',
              totalTimeSpent: { $divide: ['$totalTimeSpent', 1000 * 60 * 60] },
              _id: 0,
            },
          },
          {
            $sort: { date: 1 },
          },
        ]);

      const filledDailyTimeAnalytics = pastWeekDates.map((date) => {
        const record = dailyTimeAnalytics.find((d) => d.date === date);
        return {
          date,
          totalTimeSpent: record ? record.totalTimeSpent : 0,
        };
      });

      return new Response(JSON.stringify(filledDailyTimeAnalytics), {
        status: STATUS_CODE.OK,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (field === ANALYTICS_REQUIREMENT.TASK_STATUS) {
      const analyticsTasks: TaskStatusAnalytics[] = await TaskModel.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            status: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ]);

      return new Response(JSON.stringify(analyticsTasks), {
        status: STATUS_CODE.OK,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Invalid field' }), {
      status: STATUS_CODE.BAD_REQUEST,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const message = typeof error === 'string' ? error : 'Internal server error';
    console.error('[Error]:', message);
    return new Response(JSON.stringify({ message }), {
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
