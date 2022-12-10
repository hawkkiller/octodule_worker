import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Config } from './config/config';
import * as amqp from 'amqplib';
import { App } from './feature/app/app';
import { Logger } from 'tslog';
import { ScheduleAddController } from './feature/schedule/logic/schedule-add-controller';
import { ScheduleAddService } from './feature/schedule/logic/schedule-add-service';

bootstrap().then();

async function bootstrap() {
  const logger = new Logger<never>(
    {
      stylePrettyLogs: true,
    },
  );
  logger.info('Loading config from ENV');
  await dotenv.config();

  logger.info('Getting config');
  const config = Config.getConfig();

  logger.info('Configuring RabbitMQ');
  const [rabbitConnection, rabbitChannel] = await configureRabbit(config);

  const prisma = new PrismaClient();

  logger.info('Connecting to database');
  await prisma.$connect();

  const scheduleAppController = new ScheduleAddController(
    new ScheduleAddService(prisma),
  );

  const app = new App(
    {
      controllers: [
        scheduleAppController,
      ],
      rabbitChannel: rabbitChannel,
      logger: logger,
      rabbitConnection: rabbitConnection,
      prisma: prisma,
    },
  );
  // start app
  app.start();
}

async function configureRabbit(config: Config): Promise<[amqp.Connection, amqp.Channel]> {
  const amqpConn = await amqp.connect(config.rabbitMQHost);
  const channel = await amqpConn.createChannel();
  return [amqpConn, channel];
}