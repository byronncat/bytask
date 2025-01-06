import { aiServiceApi, authAction_v2 } from '@/api';
import { TaskModel } from '@/database';
import { STATUS_CODE } from '@/constants/serverConfig';

export async function GET() {
  try {
    const sessionPayload = await authAction_v2.authenticate();
    if (!sessionPayload) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: STATUS_CODE.UNAUTHORIZED,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const tasks = await TaskModel.find({
      uid: sessionPayload.user.id,
      $and: [
        {
          $or: [
            { due_date: { $gte: new Date() } },
            { due_date: null },
            { due_date: { $exists: false } },
          ],
        },
        {
          $or: [{ due_date: { $ne: null } }, { start_date: { $ne: null } }],
        },
      ],
    });

    const prompt = `Here is the user's schedule: 
  ${tasks
    .map(
      (task) =>
        `Task: ${task.title}, Priority: ${task.priority}, Due: ${task.due_date}`,
    )
    .join(
      '\n',
    )}Please provide feedback on potential risks like burnout or improvements.`;

    const aiResponse = await aiServiceApi.analyzeSchedule(prompt);
    if (!aiResponse.success) {
      return new Response(JSON.stringify({ message: aiResponse.message }), {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(aiResponse.data), {
      status: STATUS_CODE.OK,
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
