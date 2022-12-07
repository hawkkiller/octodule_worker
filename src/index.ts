import { Controller } from './logic/controller';
import { Config } from './config/config';
import { Telegraf } from 'telegraf';
import { Bot } from './util/custom-types/telegraf.types';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { EchoController } from './feature/echo/echo.controller';
import { AddScheduleServiceImpl } from './feature/schedule/add-schedule.service';
import { AddScheduleController } from './feature/schedule/add-schedule.controller';

bootstrap();

async function bootstrap() {
  await dotenv.config();
  const config = Config.getConfig();

  const bot = new Telegraf(config.botToken);

  const prisma = new PrismaClient();

  await prisma.$connect();

  const echoController = new EchoController();

  const addScheduleController = new AddScheduleController(
    new AddScheduleServiceImpl(),
  );

  const controllers: Controller[] = [echoController, addScheduleController];

  registerControllers(bot, controllers);

  await launch({
    bot: bot,
  });
}

function registerControllers(bot: Bot, controllers: Controller[]) {
  controllers.forEach((controller) => {
    controller.register(bot);
  });
}

async function launch(args: {
  bot: Bot,
}) {
  const { bot } = args;

  bot.launch();
}
