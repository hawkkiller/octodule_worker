import {PrismaClient} from '@prisma/client';
import * as dotenv from 'dotenv';
import {Config} from "./config/config";
import * as amqp from "amqplib"

bootstrap().then();

async function bootstrap() {
    await dotenv.config();

    const config = Config.getConfig()

    const prisma = new PrismaClient();

    await prisma.$connect();

    const amqpConn = await amqp.connect(config.rabbitMQHost)
    const channel = await amqpConn.createChannel()
    await channel.assertQueue('add-schedule-result')
    channel.sendToQueue('add-schedule-result', Buffer.from('Misha'))

    await launch();
}

async function launch() {

}
