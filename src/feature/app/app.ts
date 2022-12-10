import { Controller } from '../../logic/controller/controller';
import * as amqp from 'amqplib';
import { Logger } from 'tslog';
import { PrismaClient } from '@prisma/client';
import { constants } from 'os';
import * as os from 'os';

export class App {
  constructor(
    private readonly args: {
      controllers: Controller[],
      rabbitChannel: amqp.Channel,
      rabbitConnection: amqp.Connection,
      logger: Logger<never>,
      prisma: PrismaClient,
    },
  ) {
    this.rabbitChannel = args.rabbitChannel;
    this.rabbitConnection = args.rabbitConnection;
    this.logger = args.logger;
    this.controllers = args.controllers;
    this.prisma = args.prisma;
  }

  private readonly rabbitChannel: amqp.Channel;
  private readonly rabbitConnection: amqp.Connection;
  private readonly logger: Logger<never>;
  private readonly controllers: Controller[];
  private readonly prisma: PrismaClient;

  public start(): void {
    this.logger.info('Starting application...');
    this.controllers.forEach((controller) => {
      controller.register(this.rabbitChannel).then((message) => {
        this.logger.info(message);
      });
    });
    this.logger.info('Application started');
    process.on('SIGTERM', () => {
      this.gracefulShutdown('SIGTERM');
    });
    process.on('SIGINT', () => {
      this.gracefulShutdown('SIGINT');
    });
    process.on('SIGQUIT', () => {
      this.gracefulShutdown('SIGQUIT');
    });
  }

  private gracefulShutdown(stopSignal: 'SIGTERM' | 'SIGINT' | 'SIGQUIT'): void {
    this.logger.info(`${stopSignal} received: gracefully shutting down`);
    // close all controllers
    Promise.all(this.controllers.map((controller) => controller.destroy())).then((msg) => {
      msg.forEach((message) => {
        this.logger.info(message);
      });
      Promise.all([
        this.rabbitConnection.close(),
        this.prisma.$disconnect(),
      ]).then(() => {
        this.logger.info('Graceful shutdown completed');
        process.exit(0);
      });
    });
  }
}