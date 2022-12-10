import { PrismaClient, Prisma } from '@prisma/client';
import { Schedule } from '../model/model';

export interface ScheduleAddService {
  addSchedule(schedule: Schedule): Promise<boolean>;
}

export class ScheduleAddService implements ScheduleAddService {
  constructor(private readonly prisma: PrismaClient) { }

  async addSchedule(schedule: Schedule): Promise<boolean> {
    const scheduleData: Prisma.ScheduleCreateInput = {
      title: schedule.title,
      days: {
        create: schedule.days.map<Prisma.DayCreateWithoutScheduleInput>(day => ({
          title: day.title,
          index: day.index,
          lessons: {
            create: day.lessons.map<Prisma.LessonCreateWithoutDayInput>(lesson => ({
              title: lesson.title,
              content: lesson.content,
              keyValues: {
                create: lesson.keyValues.map<Prisma.KVCreateWithoutLessonInput>(entry => ({
                  key: entry.key,
                  value: entry.value,
                })),
              },
            })),
          },
        })),
      },
      chat: {
        connectOrCreate: {
          where: {
            id: schedule.chatId,
          },
          create: {
            id: schedule.chatId,
          }
        },
      },
    };
    const result = await this.prisma.schedule.create({
      data: scheduleData
    });
    return result.id !== undefined;
  }
}