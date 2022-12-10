import * as amqp from 'amqplib';
import { Logger } from 'tslog';

export abstract class Controller {
  /**
   * Register the controller to the RabbitMQ channel
   * @param channel
   * @param logger
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async register(channel?: amqp.Channel, logger?: Logger<never>): Promise<string> {
    return `Registered ${this.constructor.name}`;
  }

  async destroy(): Promise<string> {
    return `Destroyed ${this.constructor.name}`;
  }
}