import { Controller } from '../../../logic/controller/controller';
import * as amqp from 'amqplib';
import { ScheduleAddService } from './schedule-add-service';
import { Schedule } from '../model/model';

export class ScheduleAddController extends Controller {
  constructor(private readonly service: ScheduleAddService) {
    super();
  }

  private consumer: amqp.Replies.Consume | undefined;
  private channel: amqp.Channel | undefined;

  public async register(channel: amqp.Channel): Promise<string> {
    await channel.assertQueue('add-schedule');
    await channel.assertQueue('add-schedule-result');
    this.consumer = await channel.consume('add-schedule', async (msg) => {
      // if not null
      if (msg) {
        const schedule: Schedule = JSON.parse(msg.content.toString());
        await this.service.addSchedule(schedule);
        channel.sendToQueue('add-schedule-result', Buffer.from(JSON.stringify(schedule)));
        await channel.ack(msg);
      }
    });
    return super.register();
  }

  async destroy(): Promise<string> {
    // stop consuming
    if (this.consumer && this.channel) {
      await this.channel.cancel(this.consumer.consumerTag);
    }
    return super.destroy();
  }
}