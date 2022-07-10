import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { UserInterceptor } from "./interceptors/user.interceptor";
import { UserService } from "./services/user.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new UserInterceptor(app.get(UserService)))
  await app.listen(3000);
}

bootstrap();
