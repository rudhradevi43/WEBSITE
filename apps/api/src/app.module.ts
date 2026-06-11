import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AiModule } from "./modules/ai/ai.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { ApplicationsModule } from "./modules/applications/applications.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ResumesModule } from "./modules/resumes/resumes.module";
import { SavedSearchesModule } from "./modules/saved-searches/saved-searches.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    AuditModule,
    AuthModule,
    JobsModule,
    ResumesModule,
    ApplicationsModule,
    CompaniesModule,
    AnalyticsModule,
    NotificationsModule,
    SavedSearchesModule,
    AiModule
  ]
})
export class AppModule {}
