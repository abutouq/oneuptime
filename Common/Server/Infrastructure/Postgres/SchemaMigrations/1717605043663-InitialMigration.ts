import { MigrationInterface, QueryRunner, Table } from "typeorm";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export default class InitialMigration implements MigrationInterface {
  public name: string = "InitialMigration1717605043663";

  @CaptureSpan()
  public async up(queryRunner: QueryRunner): Promise<void> {
    // check if File table already exists, then dont run the migration
    const fileTable: Table | undefined = await queryRunner.getTable("File");

    if (fileTable) {
      return;
    }

    await queryRunner.query(
      `CREATE TABLE "File" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "file" bytea NOT NULL, "name" character varying(100) NOT NULL, "type" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "isPublic" character varying(100) NOT NULL DEFAULT true, CONSTRAINT "PK_a5e28609454dda7dc62b97d235c" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "name" character varying(50), "email" character varying(100) NOT NULL, "newUnverifiedTemporaryEmail" character varying(100), "slug" character varying(100) NOT NULL, "password" character varying(64), "isEmailVerified" boolean NOT NULL DEFAULT false, "companyName" character varying(100), "jobRole" character varying(100), "companySize" character varying(100), "referral" character varying(100), "companyPhoneNumber" character varying(30), "profilePictureId" uuid, "twoFactorAuthEnabled" boolean NOT NULL DEFAULT false, "twoFactorSecretCode" character varying(100), "twoFactorAuthUrl" character varying(100), "backupCodes" text, "jwtRefreshToken" character varying(100), "paymentProviderCustomerId" character varying(100), "resetPasswordToken" character varying(100), "resetPasswordExpires" TIMESTAMP WITH TIME ZONE, "timezone" character varying(100), "lastActive" TIMESTAMP WITH TIME ZONE, "promotionName" character varying(100), "isDisabled" boolean NOT NULL DEFAULT false, "paymentFailedDate" TIMESTAMP WITH TIME ZONE, "isMasterAdmin" boolean NOT NULL DEFAULT false, "isBlocked" boolean NOT NULL DEFAULT false, "alertPhoneNumber" character varying(30), "alertPhoneVerificationCode" character varying(8), "utmSource" character varying(500), "utmMedium" character varying(500), "utmCampaign" character varying(500), "utmTerm" character varying(500), "utmContent" character varying(500), "utmUrl" character varying(500), "alertPhoneVerificationCodeRequestTime" TIMESTAMP WITH TIME ZONE, "tempAlertPhoneNumber" character varying(30), "deletedByUserId" uuid, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "UQ_70f42c60b74c0e931f0d599f03d" UNIQUE ("slug"), CONSTRAINT "PK_decdf2abb1c7cbeb1a805aada89" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_70f42c60b74c0e931f0d599f03" ON "User" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "AcmeCertificate" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "domain" character varying(100) NOT NULL, "certificate" text NOT NULL, "certificateKey" text NOT NULL, "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "deletedByUserId" uuid, CONSTRAINT "PK_185a0eac2bf16488e0b0c940735" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8545260bc2f2b2cdb2e7184362" ON "AcmeCertificate" ("domain") `,
    );
    await queryRunner.query(
      `CREATE TABLE "AcmeChallenge" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "domain" character varying(500) NOT NULL, "token" character varying(500) NOT NULL, "challenge" character varying NOT NULL, "deletedByUserId" uuid, CONSTRAINT "PK_72f3dfbc2c52c2d9442b5dbfec2" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fe7dd70f059b5b9bd0452d3ebf" ON "AcmeChallenge" ("domain") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_936afe487b8f9da2f6aae1d11d" ON "AcmeChallenge" ("token") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Reseller" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "resellerId" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(100) NOT NULL, "username" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "changePlanLink" character varying(100), "hidePhoneNumberOnSignup" boolean, "enableTelemetryFeatures" boolean DEFAULT false, CONSTRAINT "PK_c6ba1f78a2b2458d85c318e0c0f" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ResellerPlan" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "resellerId" uuid NOT NULL, "planId" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "planType" character varying(100) NOT NULL, "description" character varying(100) NOT NULL, "monitorLimit" integer, "teamMemberLimit" integer, "createdByUserId" uuid, "deletedByUserId" uuid, "otherFeatures" character varying(100), CONSTRAINT "PK_92b9172e490226e492c5cede708" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc269bd109ac405a458b2acc67" ON "ResellerPlan" ("resellerId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Project" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "paymentProviderPlanId" character varying(100), "paymentProviderSubscriptionId" character varying(100), "paymentProviderMeteredSubscriptionId" character varying(100), "paymentProviderSubscriptionSeats" integer, "trialEndsAt" TIMESTAMP WITH TIME ZONE, "paymentProviderCustomerId" character varying(100), "paymentProviderSubscriptionStatus" character varying(100), "paymentProviderMeteredSubscriptionStatus" character varying(100), "paymentProviderPromoCode" character varying(100), "createdByUserId" uuid, "deletedByUserId" uuid, "isBlocked" boolean NOT NULL DEFAULT false, "isFeatureFlagMonitorGroupsEnabled" boolean DEFAULT false, "unpaidSubscriptionNotificationCount" smallint, "paymentFailedDate" TIMESTAMP WITH TIME ZONE, "paymentSuccessDate" TIMESTAMP WITH TIME ZONE, "workflowRunsInLast30Days" integer, "requireSsoForLogin" boolean NOT NULL DEFAULT false, "activeMonitorsLimit" integer, "seatLimit" integer, "currentActiveMonitorsCount" integer, "smsOrCallCurrentBalanceInUSDCents" integer NOT NULL DEFAULT '0', "autoRechargeSmsOrCallByBalanceInUSD" integer NOT NULL DEFAULT '20', "autoRechargeSmsOrCallWhenCurrentBalanceFallsInUSD" integer NOT NULL DEFAULT '10', "enableSmsNotifications" boolean NOT NULL DEFAULT false, "enableCallNotifications" boolean NOT NULL DEFAULT false, "enableAutoRechargeSmsOrCallBalance" boolean NOT NULL DEFAULT false, "lowCallAndSMSBalanceNotificationSentToOwners" boolean NOT NULL DEFAULT false, "failedCallAndSMSBalanceChargeNotificationSentToOwners" boolean NOT NULL DEFAULT false, "notEnabledSmsOrCallNotificationSentToOwners" boolean NOT NULL DEFAULT false, "planName" character varying(100), "lastActive" TIMESTAMP WITH TIME ZONE, "createdOwnerPhone" character varying(30), "createdOwnerEmail" character varying(100), "createdOwnerName" character varying(50), "utmSource" character varying(500), "utmMedium" character varying(500), "utmCampaign" character varying(500), "utmTerm" character varying(500), "utmContent" character varying(500), "utmUrl" character varying(500), "createdOwnerCompanyName" character varying(100), "resellerId" uuid, "resellerPlanId" uuid, "resellerLicenseId" character varying(100), CONSTRAINT "UQ_38f5c1d2bf0743a868288fc8e64" UNIQUE ("slug"), CONSTRAINT "PK_08138e668356f0fe5d9fb43ba6a" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38f5c1d2bf0743a868288fc8e6" ON "Project" ("slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4ee6a519d48b26fe2a78fdc1c9" ON "Project" ("resellerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b5ee87614c184778810283c299" ON "Project" ("resellerPlanId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ApiKey" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "apiKey" uuid NOT NULL, CONSTRAINT "PK_e71aa2e686b8cc09ac083b362a1" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bb1019f0078a21b4854f5cb3ed" ON "ApiKey" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e26b8c243b0ed1395bd52aaaf" ON "ApiKey" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17bec9c02846cdf64b5d6bb71f" ON "ApiKey" ("apiKey") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Label" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "color" character varying(7) NOT NULL, CONSTRAINT "PK_fa0b1a36a5943fe60fc72b7332d" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f10d59c2ba66e085722e0053cb" ON "Label" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ApiKeyPermission" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "apiKeyId" uuid NOT NULL, "projectId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "permission" character varying(100) NOT NULL, "isBlockPermission" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_557178680bd9b61c3fb437bbfb3" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0cf347c575f15d3836615f5325" ON "ApiKeyPermission" ("apiKeyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb09dd7fefa9d5d44b1907be5f" ON "ApiKeyPermission" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "BillingInvoice" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "amount" numeric NOT NULL, "currencyCode" character varying(100) NOT NULL, "downloadableLink" text NOT NULL, "status" character varying(100) NOT NULL, "paymentProviderCustomerId" character varying(100) NOT NULL, "paymentProviderSubscriptionId" character varying(100), "paymentProviderInvoiceId" character varying(100) NOT NULL, CONSTRAINT "PK_44308aa9517968a8b794fae6f5f" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ab13e9a92ce4801c37c2a0a77" ON "BillingInvoice" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "BillingPaymentMethod" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "type" character varying(100) NOT NULL, "paymentProviderPaymentMethodId" character varying(100) NOT NULL, "paymentProviderCustomerId" character varying(100) NOT NULL, "last4Digits" character varying(100) NOT NULL, "isDefault" boolean, CONSTRAINT "PK_9752e07a1ef457e672017373d13" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db4bb9add01b7d8286869fd9a0" ON "BillingPaymentMethod" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "CallLog" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "toNumber" character varying(30) NOT NULL, "fromNumber" character varying(30) NOT NULL, "callData" jsonb NOT NULL, "statusMessage" character varying(500), "status" character varying(100) NOT NULL, "callCostInUSDCents" integer NOT NULL DEFAULT '0', "deletedByUserId" uuid, CONSTRAINT "PK_86bec18cba9886025ef8e24a88b" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5648767682195afaeb09098a21" ON "CallLog" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14a8701025e30ab54de66990dc" ON "CallLog" ("toNumber") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af110ffcec14a2770dada25c92" ON "CallLog" ("fromNumber") `,
    );
    await queryRunner.query(
      `CREATE TABLE "DataMigrations" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "name" character varying(100) NOT NULL, "executed" boolean NOT NULL DEFAULT true, "executedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_ebe23fc5dac97954a1e0295988d" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Domain" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "domain" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isVerified" boolean NOT NULL DEFAULT false, "domainVerificationText" character varying(100) NOT NULL, CONSTRAINT "UQ_6bf543b5b16ff1e18637a1d6e26" UNIQUE ("domainVerificationText"), CONSTRAINT "PK_4c9c7a5e777572225bde32ddd8e" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1ce90d3f9693be29b72fabe93" ON "Domain" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ProjectSMTPConfig" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "username" character varying(100), "password" character varying(500), "hostname" character varying(100) NOT NULL, "port" integer NOT NULL, "fromEmail" character varying(100) NOT NULL, "fromName" character varying(100) NOT NULL, "secure" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8ac366e3dfa1bd3cb1560cc8f87" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a540dab929fa6582b93f258ffe" ON "ProjectSMTPConfig" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "EmailLog" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "toEmail" character varying(100), "fromEmail" character varying(100), "subject" character varying(500) NOT NULL, "statusMessage" character varying(500), "status" character varying(100) NOT NULL, "projectSmtpConfigId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_ad2639709254abb94b89551e613" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b72c5131b3dd1f3edf201a561" ON "EmailLog" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c92ae54071acce65fa134d855" ON "EmailLog" ("toEmail") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4d606cbaafbdbbf5130c97058" ON "EmailLog" ("fromEmail") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_046364c162885b6ac65d5dd367" ON "EmailLog" ("projectSmtpConfigId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "EmailVerificationToken" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "userId" uuid NOT NULL, "email" character varying(100) NOT NULL, "token" uuid NOT NULL, "expires" TIMESTAMP WITH TIME ZONE NOT NULL, "deletedByUserId" uuid, CONSTRAINT "UQ_0817e87f2e8de1019a09b1eb606" UNIQUE ("token"), CONSTRAINT "PK_527b465552328251512aea2587a" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0817e87f2e8de1019a09b1eb60" ON "EmailVerificationToken" ("token") `,
    );
    await queryRunner.query(
      `CREATE TABLE "GlobalConfig" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "disableSignup" boolean DEFAULT false, "isSMTPSecure" boolean, "smtpUsername" character varying(100), "smtpPassword" character varying(100), "smtpPort" integer, "smtpHost" character varying(100), "smtpFromEmail" character varying(100), "smtpFromName" character varying(100), "twilioAccountSID" character varying(100), "twilioAuthToken" character varying(100), "twilioPhoneNumber" character varying(30), "emailServerType" character varying, "sendgridApiKey" character varying, "sendgridFromEmail" character varying, "sendgridFromName" character varying, "isMasterApiKeyEnabled" boolean DEFAULT false, "masterApiKey" uuid, "adminNotificationEmail" character varying(100), CONSTRAINT "UQ_5f6e5421b62acf7ac0dc24efe1f" UNIQUE ("disableSignup"), CONSTRAINT "UQ_7f637cadeb879b83663c724ada6" UNIQUE ("isSMTPSecure"), CONSTRAINT "UQ_9cfe51eb0e99f5b3c3f4183540a" UNIQUE ("smtpUsername"), CONSTRAINT "UQ_26512a721317adaa03d37eb00d4" UNIQUE ("smtpPassword"), CONSTRAINT "UQ_ec87ad4cb593cbce6c29c63f2e5" UNIQUE ("smtpPort"), CONSTRAINT "UQ_6abdf5f1b02c3f1f4b63455b5b7" UNIQUE ("smtpHost"), CONSTRAINT "UQ_f180b8fbfd18df3fc9e09d3dc0e" UNIQUE ("smtpFromEmail"), CONSTRAINT "UQ_8cca9c2a2c1bae5509cbbbb4d4c" UNIQUE ("smtpFromName"), CONSTRAINT "UQ_ff4de79bf16e52712a4b264f906" UNIQUE ("twilioAccountSID"), CONSTRAINT "UQ_bc4b634ed3ed8854b06872115a0" UNIQUE ("twilioAuthToken"), CONSTRAINT "UQ_c223b66a0ca2fa8095cb7a6c7cc" UNIQUE ("twilioPhoneNumber"), CONSTRAINT "UQ_0be4582bb7cc1337e58f1d9b45e" UNIQUE ("emailServerType"), CONSTRAINT "UQ_1489dd2e4879912dd7caa0dee5c" UNIQUE ("sendgridApiKey"), CONSTRAINT "UQ_cc133cd137597be73a2540ece9f" UNIQUE ("sendgridFromEmail"), CONSTRAINT "UQ_6d73f5eea5f1d49c1701fb04f2d" UNIQUE ("sendgridFromName"), CONSTRAINT "UQ_7d5fa0275bdc336a22af4ab2b96" UNIQUE ("isMasterApiKeyEnabled"), CONSTRAINT "UQ_117d0b6a9f6c32be770c07f1cf6" UNIQUE ("masterApiKey"), CONSTRAINT "UQ_b99fa557d0e88c933575e7deaa9" UNIQUE ("adminNotificationEmail"), CONSTRAINT "PK_b494a3ff229268d132914e71282" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "GreenlockCertificate" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "key" character varying(500) NOT NULL, "blob" text NOT NULL, "isKeyPair" boolean NOT NULL DEFAULT false, "deletedByUserId" uuid, CONSTRAINT "PK_f7a338910a034c62b3efa5aa701" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d47fcf292f2ceae490da8404d8" ON "GreenlockCertificate" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "GreenlockChallenge" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "key" character varying(500) NOT NULL, "token" character varying(500) NOT NULL, "challenge" character varying NOT NULL, "deletedByUserId" uuid, CONSTRAINT "PK_e2685e2af35bad33efc615c365c" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36dde33ab3f3fefb63cb164c7d" ON "GreenlockChallenge" ("key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8358adfc13448a58e30a799f6e" ON "GreenlockChallenge" ("token") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentSeverity" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "color" character varying(7) NOT NULL, "order" smallint NOT NULL, CONSTRAINT "PK_55c88aed1689e00cce0fdbf4d78" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_00d2f503174bf201abc6e77afd" ON "IncidentSeverity" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentState" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "color" character varying(7) NOT NULL, "isCreatedState" boolean NOT NULL DEFAULT false, "isAcknowledgedState" boolean NOT NULL DEFAULT false, "isResolvedState" boolean NOT NULL DEFAULT false, "order" smallint NOT NULL, CONSTRAINT "PK_8d3b37bb11d8f5aa90bf6df2f1a" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d279e530067f599f3186e3821" ON "IncidentState" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorStatus" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "color" character varying(7) NOT NULL, "isOperationalState" boolean NOT NULL DEFAULT false, "isOfflineState" boolean NOT NULL DEFAULT false, "priority" integer NOT NULL, CONSTRAINT "PK_2d865658fb987bbe9c9b7517103" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db1783158a23bd20dbebaae56e" ON "MonitorStatus" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Monitor" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "monitorType" character varying(100) NOT NULL, "currentMonitorStatusId" uuid NOT NULL, "monitorSteps" jsonb, "monitoringInterval" character varying(100), "customFields" jsonb, "isOwnerNotifiedOfResourceCreation" boolean NOT NULL DEFAULT false, "disableActiveMonitoring" boolean NOT NULL DEFAULT false, "incomingRequestReceivedAt" TIMESTAMP WITH TIME ZONE, "disableActiveMonitoringBecauseOfScheduledMaintenanceEvent" boolean NOT NULL DEFAULT false, "disableActiveMonitoringBecauseOfManualIncident" boolean NOT NULL DEFAULT false, "serverMonitorRequestReceivedAt" TIMESTAMP WITH TIME ZONE, "serverMonitorSecretKey" uuid, "incomingRequestSecretKey" uuid, "incomingMonitorRequest" jsonb, "serverMonitorResponse" jsonb, CONSTRAINT "UQ_42ecc6e0ac9984cd24d5f9ddd8d" UNIQUE ("slug"), CONSTRAINT "PK_eb992d1e4e316083d3535709e43" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_996acfb590bda327843f78b7ad" ON "Monitor" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36d301a9e41af9b6e62b0c0a02" ON "Monitor" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_42ecc6e0ac9984cd24d5f9ddd8" ON "Monitor" ("slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d3461ab640467c8c2100ea55c7" ON "Monitor" ("currentMonitorStatusId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db5cc02633b36957c9be4d70c6" ON "Monitor" ("monitoringInterval") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b4c392c3163a2a32da5b401c91" ON "Monitor" ("isOwnerNotifiedOfResourceCreation") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e0f03c5e067eeb505b2b87aa8" ON "Monitor" ("disableActiveMonitoring") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bfee6c29045d1c236d9395f65" ON "Monitor" ("incomingRequestReceivedAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ea5170227069c85269b3a6db93" ON "Monitor" ("disableActiveMonitoringBecauseOfScheduledMaintenanceEvent") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9c8f4b9103fa6b62ff5a121f36" ON "Monitor" ("disableActiveMonitoringBecauseOfManualIncident") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28d1e0cdf3fcf1ac30249f5d3a" ON "Monitor" ("serverMonitorRequestReceivedAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_899a35fe28dd2661f9c999c130" ON "Monitor" ("serverMonitorSecretKey") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2fb8ee83943588b9c5f3358570" ON "Monitor" ("incomingRequestSecretKey") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicy" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "repeatPolicyIfNoOneAcknowledges" boolean NOT NULL DEFAULT false, "repeatPolicyIfNoOneAcknowledgesNoOfTimes" integer NOT NULL DEFAULT '0', "customFields" jsonb, CONSTRAINT "UQ_68884a658e2c47f67c9b2dd9af5" UNIQUE ("slug"), CONSTRAINT "PK_728c01bb7c570a189dcd5f8f846" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_31508550a088ba2cc843a6c90c" ON "OnCallDutyPolicy" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_570a79facd5fe1c01ccdca55ae" ON "OnCallDutyPolicy" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68884a658e2c47f67c9b2dd9af" ON "OnCallDutyPolicy" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Probe" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "key" character varying NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(50), "slug" character varying(100) NOT NULL, "probeVersion" character varying(30) NOT NULL, "lastAlive" TIMESTAMP WITH TIME ZONE, "iconFileId" uuid, "projectId" uuid, "deletedByUserId" uuid, "createdByUserId" uuid, "isGlobalProbe" boolean NOT NULL DEFAULT false, "shouldAutoEnableProbeOnNewMonitors" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_8f390f96121dc8772b0c29518a4" UNIQUE ("key"), CONSTRAINT "PK_41e4920c56fbb2d208bc4de73a2" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Incident" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "title" character varying(500) NOT NULL, "description" text, "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "currentIncidentStateId" uuid NOT NULL, "incidentSeverityId" uuid NOT NULL, "changeMonitorStatusToId" uuid, "isStatusPageSubscribersNotifiedOnIncidentCreated" boolean NOT NULL DEFAULT false, "shouldStatusPageSubscribersBeNotifiedOnIncidentCreated" boolean NOT NULL DEFAULT true, "customFields" jsonb, "isOwnerNotifiedOfResourceCreation" boolean NOT NULL DEFAULT false, "rootCause" text, "createdStateLog" jsonb, "createdCriteriaId" character varying, "createdIncidentTemplateId" character varying, "createdByProbeId" uuid, "isCreatedAutomatically" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_eb410c8eb2e2eadfa5880936fe2" UNIQUE ("slug"), CONSTRAINT "PK_bc6d93c3f46bc96e209c379996b" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eccbc31fa1f58bd051b6f7e108" ON "Incident" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f53415da5b48954185a6c32b7" ON "Incident" ("title") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb410c8eb2e2eadfa5880936fe" ON "Incident" ("slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6592d4f7f3b260efc23fc9b4bc" ON "Incident" ("currentIncidentStateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3f28fe3b32abed354a49b26c9c" ON "Incident" ("incidentSeverityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ed0ec4960a85240f51e6779a00" ON "Incident" ("changeMonitorStatusToId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c3ad64a7aaf39c1f7885527e24" ON "Incident" ("isOwnerNotifiedOfResourceCreation") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5218e92f700d91afe6a8db79cb" ON "Incident" ("rootCause") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ee2acd83fe08dfe3b46a533b7f" ON "Incident" ("createdCriteriaId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6ddd5e3433dcdc6832b2a93845" ON "Incident" ("createdIncidentTemplateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e537806a80e869917ca1d7e2e" ON "Incident" ("createdByProbeId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentCustomField" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "type" character varying(100), "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_9cdf1c2cd13120af17445219e7a" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_59e7f6a43dbc5ee54e1a1aaaaf" ON "IncidentCustomField" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentInternalNote" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "incidentId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "note" text NOT NULL, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d81f41e2baba0591716e3d1f762" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ac48058b3e5f9e8361d2b8328c" ON "IncidentInternalNote" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b92e75645fd252e4c2f866047d" ON "IncidentInternalNote" ("incidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_582d48a4d9cce7dd74ea1dd282" ON "IncidentInternalNote" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentNoteTemplate" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "note" text NOT NULL, "templateName" character varying(100) NOT NULL, "templateDescription" character varying(500) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_7c2220728bdefd8c1f0878dd3da" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_21d5bc0d24b3e5032dd391ec8d" ON "IncidentNoteTemplate" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7904e01f4867510e9cb3ba09cd" ON "IncidentNoteTemplate" ("note") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Team" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isPermissionsEditable" boolean NOT NULL DEFAULT true, "isTeamDeleteable" boolean NOT NULL DEFAULT true, "shouldHaveAtLeastOneMember" boolean NOT NULL DEFAULT false, "isTeamEditable" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_fcdfc85e8e6b0a1f8128ce572ac" UNIQUE ("slug"), CONSTRAINT "PK_2e76d339d65d3fe4156bbcdd96b" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_baac847c494f692f03fd686e9c" ON "Team" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_319e120005dff229ac97e9e21d" ON "Team" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fcdfc85e8e6b0a1f8128ce572a" ON "Team" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentOwnerTeam" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "teamId" uuid NOT NULL, "incidentId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cf830a956d75a7d10fba1d323f9" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95f76375ccac835f815d7e926a" ON "IncidentOwnerTeam" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_389aadeb39a0806e80d4001016" ON "IncidentOwnerTeam" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_408324d3635a826538a792422f" ON "IncidentOwnerTeam" ("incidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a913a00c56edac2d2e3364fb8b" ON "IncidentOwnerTeam" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentOwnerUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "incidentId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_28a06b920ce7baf44968e1fa0b3" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ee7ae6757442fba470b213015" ON "IncidentOwnerUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6311087eeb14ab51e6a1e6133f" ON "IncidentOwnerUser" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6aa9a6b46f8e044d722da8f5a7" ON "IncidentOwnerUser" ("incidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8347c45d2b96d4f809bbefeb80" ON "IncidentOwnerUser" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentPublicNote" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "incidentId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "note" text NOT NULL, "isStatusPageSubscribersNotifiedOnNoteCreated" boolean NOT NULL DEFAULT false, "shouldStatusPageSubscribersBeNotifiedOnNoteCreated" boolean NOT NULL DEFAULT true, "isOwnerNotified" boolean NOT NULL DEFAULT false, "postedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d7a24846b34fe3538745bf3fcb9" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9a77e5f286b5724f4e2280d0a" ON "IncidentPublicNote" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a6964d3aab71608daab9f20e30" ON "IncidentPublicNote" ("incidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8bbc15605fce799ab2abf6532b" ON "IncidentPublicNote" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentStateTimeline" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "incidentId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "incidentStateId" uuid NOT NULL, "isStatusPageSubscribersNotified" boolean NOT NULL DEFAULT false, "shouldStatusPageSubscribersBeNotified" boolean NOT NULL DEFAULT true, "isOwnerNotified" boolean NOT NULL DEFAULT false, "stateChangeLog" jsonb, "rootCause" text, "endsAt" TIMESTAMP WITH TIME ZONE, "startsAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5f3add0368060e7eb60e540ea5b" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_764daa366a4e195768a49e0ee3" ON "IncidentStateTimeline" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fe2dff414a1f67260e3c518981" ON "IncidentStateTimeline" ("incidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff0fca6570d47798771763533a" ON "IncidentStateTimeline" ("incidentStateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5a1a64bc4c38107b25a4bdcd17" ON "IncidentStateTimeline" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7db6b1a8fbbc9eb44c2e7f5047" ON "IncidentStateTimeline" ("rootCause") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_71c94e9f34772d46fd50e18b64" ON "IncidentStateTimeline" ("endsAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc5784aa146b249a22afe48b7e" ON "IncidentStateTimeline" ("startsAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentTemplate" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "title" character varying(500) NOT NULL, "templateName" character varying(100) NOT NULL, "templateDescription" character varying(500) NOT NULL, "description" text, "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "incidentSeverityId" uuid, "changeMonitorStatusToId" uuid, "customFields" jsonb, CONSTRAINT "UQ_9fe9e55006c2a1f26727e479ab4" UNIQUE ("slug"), CONSTRAINT "PK_f00b9bff4a246bd76cfe7179435" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b82dafef226b0fae1ad6cb1857" ON "IncidentTemplate" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0683d65aa3e3483127671d120f" ON "IncidentTemplate" ("title") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9fe9e55006c2a1f26727e479ab" ON "IncidentTemplate" ("slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ceff6a4dfdccecc4aa40dbfe91" ON "IncidentTemplate" ("incidentSeverityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6d7627ab9d5172c66fc5019216" ON "IncidentTemplate" ("changeMonitorStatusToId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentTemplateOwnerTeam" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "teamId" uuid NOT NULL, "incidentTemplateId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e466241948b2440f2683b38c865" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf172eb6797a64ee3750e3f3e2" ON "IncidentTemplateOwnerTeam" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e8090c6569c3a5dbd7ef7485c9" ON "IncidentTemplateOwnerTeam" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a895b946fccb109dedd55b85f6" ON "IncidentTemplateOwnerTeam" ("incidentTemplateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2cb2fc022da183b99cf06f0043" ON "IncidentTemplateOwnerTeam" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentTemplateOwnerUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "incidentTemplateId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ef8497118e191717349bda8fe18" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_da9dd65b4401b954a0ea2b5c8d" ON "IncidentTemplateOwnerUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36b9b0204f4b17063483cb7308" ON "IncidentTemplateOwnerUser" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_876dd05e0dfc64219ef5df241c" ON "IncidentTemplateOwnerUser" ("incidentTemplateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38583ea60d2df4a525098065f3" ON "IncidentTemplateOwnerUser" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorCustomField" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "type" character varying(100), "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_333fe20ed9ea0c59c79e766d2ed" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c6b61e904d8e3fec1ae719b9e" ON "MonitorCustomField" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorGroup" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "UQ_04092730e7f93ee58b544f484c5" UNIQUE ("slug"), CONSTRAINT "PK_61a04922aee7dd836f27b89a970" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_13905ff40843b11145f21e33ff" ON "MonitorGroup" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_136524b17f6dbf70f1e720e8f6" ON "MonitorGroup" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_04092730e7f93ee58b544f484c" ON "MonitorGroup" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorGroupOwnerTeam" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "teamId" uuid NOT NULL, "monitorGroupId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_370b2e5defa4d1cce38673a384c" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d7052620f268d0fa17f948a85" ON "MonitorGroupOwnerTeam" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8f19947114087883cea771e1cb" ON "MonitorGroupOwnerTeam" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_618bcd9015c257b0727df36fd1" ON "MonitorGroupOwnerTeam" ("monitorGroupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0736d9a7117c25ee216507fa47" ON "MonitorGroupOwnerTeam" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorGroupOwnerUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "monitorGroupId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_436159266b7e87be025d1acedb9" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5cfbebf8b07405652f5382e15" ON "MonitorGroupOwnerUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b25f4a18bec8cb177e8d65c5f" ON "MonitorGroupOwnerUser" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a4095ee3d04454071816a5bad" ON "MonitorGroupOwnerUser" ("monitorGroupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c88d50a62d9ba48e9578c9128" ON "MonitorGroupOwnerUser" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorGroupResource" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "monitorGroupId" uuid NOT NULL, "monitorId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_6af7cd205f96311471e5e9979b3" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_825791d5edb2403d7937f16ed9" ON "MonitorGroupResource" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf3dcaa746835ae36615a39d86" ON "MonitorGroupResource" ("monitorGroupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_50b373c428cfd4566cc5caf98e" ON "MonitorGroupResource" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorOwnerTeam" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "teamId" uuid NOT NULL, "monitorId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b9c6db3ddceeab34383b8f36fbe" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a6213072d8637e6e625bc7892" ON "MonitorOwnerTeam" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_63e5bbac01d1f68c7b08f126cd" ON "MonitorOwnerTeam" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1d5265d1f3ca2f8b8e461e4998" ON "MonitorOwnerTeam" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_acb20c616e3781a3a5506f89ef" ON "MonitorOwnerTeam" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorOwnerUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "monitorId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4d05a001b7a955f011c7933effb" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12a3497e1404fcdbc4e8963a58" ON "MonitorOwnerUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_324f1d50d0427bbd0e3308c459" ON "MonitorOwnerUser" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a65ce9b11b2d7bde123aa7633f" ON "MonitorOwnerUser" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab449be4e08009bfc2e68f5c78" ON "MonitorOwnerUser" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorProbe" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "probeId" uuid NOT NULL, "monitorId" uuid NOT NULL, "lastPingAt" TIMESTAMP WITH TIME ZONE, "nextPingAt" TIMESTAMP WITH TIME ZONE, "createdByUserId" uuid, "deletedByUserId" uuid, "isEnabled" boolean NOT NULL DEFAULT true, "lastMonitoringLog" jsonb, CONSTRAINT "PK_6888f9282ecc31fe8d6d089e015" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d887935f224b896ce64872c37c" ON "MonitorProbe" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d50a0e0e624369e7f90a62e8d" ON "MonitorProbe" ("probeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a540272f483ef1de68f7e64748" ON "MonitorProbe" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorSecret" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "secretValue" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_0ea8e83c6410e83ceb84bfbab3d" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c3629c5ae14e97bede3bc548e" ON "MonitorSecret" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorStatusTimeline" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "monitorId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "monitorStatusId" uuid NOT NULL, "isOwnerNotified" boolean NOT NULL DEFAULT false, "statusChangeLog" jsonb, "rootCause" text, "endsAt" TIMESTAMP WITH TIME ZONE, "startsAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_266e2a64b41ff8497a2e8461ef4" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_80213eb3f228f1e3d423f5127e" ON "MonitorStatusTimeline" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c08a7c1ef8d511b335a991aac4" ON "MonitorStatusTimeline" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_574feb4161c5216c2c7ee0faaf" ON "MonitorStatusTimeline" ("monitorStatusId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ea6641468483b2ace63144031" ON "MonitorStatusTimeline" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_01ac1d1ef9e72aeb6dac6575dd" ON "MonitorStatusTimeline" ("rootCause") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_26f6632b71574ff4dbe87c352d" ON "MonitorStatusTimeline" ("endsAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2606f4914507b3471f40864348" ON "MonitorStatusTimeline" ("startsAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyCustomField" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "type" character varying(100), "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_42e1ccec0ecdd48a12a0f235a19" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e791474e098f276eda27704b47" ON "OnCallDutyPolicyCustomField" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyEscalationRule" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "escalateAfterInMinutes" integer, "order" integer NOT NULL, CONSTRAINT "PK_560358a01ddcdec1b21fbf76409" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d45a545669dc46da25cc60d1df" ON "OnCallDutyPolicyEscalationRule" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b90c1cda36981c41e3965a9380" ON "OnCallDutyPolicyEscalationRule" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3e66222024c1119865f3eae0f" ON "OnCallDutyPolicyEscalationRule" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4020168f8d1ee248b8d4bd6293" ON "OnCallDutyPolicyEscalationRule" ("escalateAfterInMinutes") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicySchedule" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "UQ_f2f09fcba2e6eabe61d16aa2423" UNIQUE ("slug"), CONSTRAINT "PK_d2a1948140b469f311129c52db8" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e1b7c3c3e8305a10716cdb8d6" ON "OnCallDutyPolicySchedule" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15bea18a6b3f9730ce6fad2804" ON "OnCallDutyPolicySchedule" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f2f09fcba2e6eabe61d16aa242" ON "OnCallDutyPolicySchedule" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyEscalationRuleSchedule" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, "onCallDutyPolicyScheduleId" uuid, "onCallDutyPolicyEscalationRuleId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_86a8318c50e27e228aad5c544be" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_efa24aa8feb92d4e15a707c20e" ON "OnCallDutyPolicyEscalationRuleSchedule" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_651a4ab9e3cbb20f6b62a87a6b" ON "OnCallDutyPolicyEscalationRuleSchedule" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_089081f83ef22cdba5a0903ce5" ON "OnCallDutyPolicyEscalationRuleSchedule" ("onCallDutyPolicyEscalationRuleId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyEscalationRuleTeam" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, "teamId" uuid, "onCallDutyPolicyEscalationRuleId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_6aec616275791acb65c0c81fe05" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8aff8439fbfb07e7388aa9011" ON "OnCallDutyPolicyEscalationRuleTeam" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5121f361345d858ce740a55a2" ON "OnCallDutyPolicyEscalationRuleTeam" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e7d4060e2fabe0957b9fedb42" ON "OnCallDutyPolicyEscalationRuleTeam" ("onCallDutyPolicyEscalationRuleId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyEscalationRuleUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, "onCallDutyPolicyEscalationRuleId" uuid NOT NULL, "userId" uuid, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_8aded5412d5176f07878de3fc87" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b15552e664640f67346193598a" ON "OnCallDutyPolicyEscalationRuleUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9ca3fbb66842324aa987d4c972" ON "OnCallDutyPolicyEscalationRuleUser" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bff6f4ae726b5c5cbae10e7d74" ON "OnCallDutyPolicyEscalationRuleUser" ("onCallDutyPolicyEscalationRuleId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyExecutionLog" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, "triggeredByIncidentId" uuid, "status" character varying(100) NOT NULL, "statusMessage" character varying(500) NOT NULL, "userNotificationEventType" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "acknowledgedByUserId" uuid, "acknowledgedAt" TIMESTAMP WITH TIME ZONE, "acknowledgedByTeamId" uuid, "lastExecutedEscalationRuleOrder" integer, "lastEscalationRuleExecutedAt" TIMESTAMP WITH TIME ZONE, "lastExecutedEscalationRuleId" uuid, "executeNextEscalationRuleInMinutes" integer, "onCallPolicyExecutionRepeatCount" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_516d5244ab7e4b73b5cc3a7d1ba" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_00e9676d39eeb807de70443051" ON "OnCallDutyPolicyExecutionLog" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4bb332263960531a4c9e2d425" ON "OnCallDutyPolicyExecutionLog" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fbb50489ef5eb354f46d479e2a" ON "OnCallDutyPolicyExecutionLog" ("lastExecutedEscalationRuleOrder") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_296e2be818e3fba28e43b457fb" ON "OnCallDutyPolicyExecutionLog" ("lastEscalationRuleExecutedAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4a0ffc5e9e698bb2612ba0e55" ON "OnCallDutyPolicyExecutionLog" ("lastExecutedEscalationRuleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6ad07641fe00f29edc65716aca" ON "OnCallDutyPolicyExecutionLog" ("executeNextEscalationRuleInMinutes") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a217798f1dbf12d31b498a1020" ON "OnCallDutyPolicyExecutionLog" ("onCallPolicyExecutionRepeatCount") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyExecutionLogTimeline" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, "triggeredByIncidentId" uuid NOT NULL, "onCallDutyPolicyExecutionLogId" uuid NOT NULL, "onCallDutyPolicyEscalationRuleId" uuid NOT NULL, "userNotificationEventType" character varying(100) NOT NULL, "alertSentToUserId" uuid, "userBelongsToTeamId" uuid, "onCallDutyScheduleId" uuid, "statusMessage" character varying(500) NOT NULL, "status" character varying(100) NOT NULL, "createdByUserId" uuid, "isAcknowledged" boolean, "acknowledgedAt" TIMESTAMP WITH TIME ZONE, "deletedByUserId" uuid, CONSTRAINT "PK_720de860de392ed64dc9b2a75d1" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_591b7ed73c964e105bfecc6fd6" ON "OnCallDutyPolicyExecutionLogTimeline" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c5a798ca667fedda71d4ed5465" ON "OnCallDutyPolicyExecutionLogTimeline" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90119ec7f77fa2efd82261e044" ON "OnCallDutyPolicyExecutionLogTimeline" ("triggeredByIncidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_872c2f6a9739bab1b57b6d51ea" ON "OnCallDutyPolicyExecutionLogTimeline" ("onCallDutyPolicyExecutionLogId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ad4222a4c48b8a64e3a58b351" ON "OnCallDutyPolicyExecutionLogTimeline" ("onCallDutyPolicyEscalationRuleId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyScheduleLayer" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "onCallDutyPolicyScheduleId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "order" integer NOT NULL, "startsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "rotation" jsonb NOT NULL DEFAULT '{"_type":"Recurring","value":{"intervalType":"Day","intervalCount":{"_type":"PositiveNumber","value":1}}}', "handOffTime" TIMESTAMP WITH TIME ZONE NOT NULL, "restrictionTimes" jsonb NOT NULL DEFAULT '{"_type":"RestrictionTimes","value":{"restictionType":"None","dayRestrictionTimes":null,"weeklyRestrictionTimes":[]}}', CONSTRAINT "PK_d7a261a9f6c6b17e582bf0c3639" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b892ef36671f1ea1c8457a96d" ON "OnCallDutyPolicyScheduleLayer" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6fa6574a45cf1352c5a3b96251" ON "OnCallDutyPolicyScheduleLayer" ("onCallDutyPolicyScheduleId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyScheduleLayerUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "onCallDutyPolicyScheduleId" uuid NOT NULL, "onCallDutyPolicyScheduleLayerId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "order" integer NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_1c9f5d86c8045253f4ef592db0e" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_08afccd6cbbd1a7015d4fe25e3" ON "OnCallDutyPolicyScheduleLayerUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b36bba6d9898331920805a29c" ON "OnCallDutyPolicyScheduleLayerUser" ("onCallDutyPolicyScheduleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_41f4ecc29351e1a406e83b30a9" ON "OnCallDutyPolicyScheduleLayerUser" ("onCallDutyPolicyScheduleLayerId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ProjectCallSMSConfig" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "twilioAccountSID" character varying(100), "twilioAuthToken" character varying(100), "twilioPhoneNumber" character varying(30), CONSTRAINT "UQ_0886139eac04ad49627e446d477" UNIQUE ("twilioAccountSID"), CONSTRAINT "UQ_2eb1a240d549a7701b6e82d2f94" UNIQUE ("twilioAuthToken"), CONSTRAINT "UQ_50235223d7fd7b0c27063bfb08e" UNIQUE ("twilioPhoneNumber"), CONSTRAINT "PK_3661ce6081b280d86a68821d8d4" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20334b9571a6cd1a871e70d8e7" ON "ProjectCallSMSConfig" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ProjectSSO" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "signatureMethod" character varying(100) NOT NULL, "digestMethod" character varying(100) NOT NULL, "signOnURL" text NOT NULL, "issuerURL" text NOT NULL, "publicCertificate" text NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isEnabled" boolean NOT NULL DEFAULT false, "isTested" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cba071f29cefd68a7109c987dc0" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be9e6751765501ea1db126fcb2" ON "ProjectSSO" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "PromoCode" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "promoCodeId" character varying(100) NOT NULL, "planType" character varying(100), "userEmail" character varying(100), "createdByUserId" uuid, "deletedByUserId" uuid, "resellerId" uuid, "resellerPlanId" uuid, "resellerLicenseId" character varying(100), "isPromoCodeUsed" boolean NOT NULL DEFAULT false, "promoCodeUsedAt" TIMESTAMP WITH TIME ZONE, "projectId" uuid, CONSTRAINT "PK_80093d5bf3e6bc69726124cf0ef" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6dcdf97c0834dd44b4f2c93e66" ON "PromoCode" ("resellerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7aecf4b1ae3e45647cb911f4c1" ON "PromoCode" ("resellerPlanId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7b405e2a9ae144be016bcf973" ON "PromoCode" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceState" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "color" character varying(7) NOT NULL, "isScheduledState" boolean NOT NULL DEFAULT false, "isOngoingState" boolean NOT NULL DEFAULT false, "isEndedState" boolean NOT NULL DEFAULT false, "isResolvedState" boolean NOT NULL DEFAULT false, "order" smallint NOT NULL, CONSTRAINT "PK_6a6e85bc85c65a673855bd5fcc4" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57a31fb2a5e4caa223d2506a4e" ON "ScheduledMaintenanceState" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPage" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "pageTitle" character varying(100), "pageDescription" character varying(500), "description" character varying(500), "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "faviconFileId" uuid, "logoFileId" uuid, "coverImageFileId" uuid, "headerHTML" text, "footerHTML" text, "customCSS" text, "customJavaScript" text, "isPublicStatusPage" boolean NOT NULL DEFAULT true, "showIncidentLabelsOnStatusPage" boolean NOT NULL DEFAULT false, "showScheduledEventLabelsOnStatusPage" boolean NOT NULL DEFAULT false, "enableSubscribers" boolean NOT NULL DEFAULT true, "enableEmailSubscribers" boolean NOT NULL DEFAULT true, "allowSubscribersToChooseResources" boolean NOT NULL DEFAULT false, "enableSmsSubscribers" boolean NOT NULL DEFAULT false, "copyrightText" character varying, "customFields" jsonb, "requireSsoForLogin" boolean NOT NULL DEFAULT false, "smtpConfigId" uuid, "callSmsConfigId" uuid, "isOwnerNotifiedOfResourceCreation" boolean NOT NULL DEFAULT false, "showIncidentHistoryInDays" integer NOT NULL DEFAULT '14', "showAnnouncementHistoryInDays" integer NOT NULL DEFAULT '14', "showScheduledEventHistoryInDays" integer NOT NULL DEFAULT '14', "overviewPageDescription" text, "hidePoweredByOneUptimeBranding" boolean NOT NULL DEFAULT false, "defaultBarColor" character varying(7), CONSTRAINT "UQ_4cf5977515ca677e569942fb096" UNIQUE ("slug"), CONSTRAINT "PK_6a581c0dbe022a59d4d6e197332" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34a4c35e0d7afe6f023825a68c" ON "StatusPage" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f7df6dd7b1a85b933bd953b47" ON "StatusPage" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4cf5977515ca677e569942fb09" ON "StatusPage" ("slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61944d851b4a7213d79ef28174" ON "StatusPage" ("smtpConfigId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4e347d3f99b67dacd149beaf61" ON "StatusPage" ("callSmsConfigId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b8a8b32e0d7e06ed8a9a3171ab" ON "StatusPage" ("isOwnerNotifiedOfResourceCreation") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7213cf79fce2db23927de0aac0" ON "StatusPage" ("showIncidentHistoryInDays") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97509c6e7f41b59c5447cec669" ON "StatusPage" ("showAnnouncementHistoryInDays") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cfcd002648dcf692a2e126ab05" ON "StatusPage" ("showScheduledEventHistoryInDays") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b5138c4c7dc1c36ef592af784f" ON "StatusPage" ("overviewPageDescription") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenance" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "title" character varying(100) NOT NULL, "description" text, "slug" character varying(100) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "currentScheduledMaintenanceStateId" uuid NOT NULL, "changeMonitorStatusToId" uuid, "startsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isStatusPageSubscribersNotifiedOnEventScheduled" boolean NOT NULL DEFAULT false, "shouldStatusPageSubscribersBeNotifiedOnEventCreated" boolean NOT NULL DEFAULT true, "shouldStatusPageSubscribersBeNotifiedWhenEventChangedToOngoing" boolean NOT NULL DEFAULT true, "shouldStatusPageSubscribersBeNotifiedWhenEventChangedToEnded" boolean NOT NULL DEFAULT true, "customFields" jsonb, "isOwnerNotifiedOfResourceCreation" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e0d4bcb3e28628a47b8b55ead8c" UNIQUE ("slug"), CONSTRAINT "PK_be50d5233ebfd8db940db9e50b6" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4059dd569d6a482062352bf266" ON "ScheduledMaintenance" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20f04dff3b9d1f3d62985dd9de" ON "ScheduledMaintenance" ("title") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e0d4bcb3e28628a47b8b55ead8" ON "ScheduledMaintenance" ("slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_883038abda021ce79fa838d027" ON "ScheduledMaintenance" ("currentScheduledMaintenanceStateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fab9cc7e6ffcf02872fccfab97" ON "ScheduledMaintenance" ("changeMonitorStatusToId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8306d145e77473ee7ac859a0d" ON "ScheduledMaintenance" ("isOwnerNotifiedOfResourceCreation") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceCustomField" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "type" character varying(100), "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_b4c186084a3be506bf61ead8cda" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3621c488327e1c00518aa4e881" ON "ScheduledMaintenanceCustomField" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceInternalNote" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "scheduledMaintenanceId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "note" text NOT NULL, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_277bd22df1a0a0292a6361ef165" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d79c49a0a613a6b432fd400e69" ON "ScheduledMaintenanceInternalNote" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a53ef45aebd4a6a6e7dde7f896" ON "ScheduledMaintenanceInternalNote" ("scheduledMaintenanceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39a27db645744ef9177d4ab7c9" ON "ScheduledMaintenanceInternalNote" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceNoteTemplate" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "note" text NOT NULL, "templateName" character varying(100) NOT NULL, "templateDescription" character varying(500) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_2d15584043cc151b1291fb02c26" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b4cb4c1312eb72459907e1bbe9" ON "ScheduledMaintenanceNoteTemplate" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49d4245d0066dc1e14a63a4234" ON "ScheduledMaintenanceNoteTemplate" ("note") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceOwnerTeam" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "teamId" uuid NOT NULL, "scheduledMaintenanceId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_260c660b0cb76b661f66d873f40" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3053b1725658b4a120b4e3185" ON "ScheduledMaintenanceOwnerTeam" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1206beb611e0779ce2248ecbae" ON "ScheduledMaintenanceOwnerTeam" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1251fb7d4a4bf8586f2bd1528e" ON "ScheduledMaintenanceOwnerTeam" ("scheduledMaintenanceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cbe4eac5f23c115ddd4a695747" ON "ScheduledMaintenanceOwnerTeam" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceOwnerUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "scheduledMaintenanceId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cd8d017d0e0ec04d7c17a081c7d" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_518742c7037d9a38a6594dc18a" ON "ScheduledMaintenanceOwnerUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be6a25806925f93b8949e61929" ON "ScheduledMaintenanceOwnerUser" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_967c33f7bce5de522c1d1a80e7" ON "ScheduledMaintenanceOwnerUser" ("scheduledMaintenanceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d71879db35e7c4104b56bef09" ON "ScheduledMaintenanceOwnerUser" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenancePublicNote" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "scheduledMaintenanceId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "note" text NOT NULL, "isStatusPageSubscribersNotifiedOnNoteCreated" boolean NOT NULL DEFAULT false, "shouldStatusPageSubscribersBeNotifiedOnNoteCreated" boolean NOT NULL DEFAULT true, "isOwnerNotified" boolean NOT NULL DEFAULT false, "postedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_62d669cf499354d7c8438f76f37" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_73c6737ab4a7718c45932bffad" ON "ScheduledMaintenancePublicNote" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_937aabd4adbfce78663406a248" ON "ScheduledMaintenancePublicNote" ("scheduledMaintenanceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b7ec5df94e08afda7569ea1ff" ON "ScheduledMaintenancePublicNote" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceStateTimeline" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "scheduledMaintenanceId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "scheduledMaintenanceStateId" uuid NOT NULL, "isStatusPageSubscribersNotified" boolean NOT NULL DEFAULT false, "shouldStatusPageSubscribersBeNotified" boolean NOT NULL DEFAULT true, "isOwnerNotified" boolean NOT NULL DEFAULT false, "endsAt" TIMESTAMP WITH TIME ZONE, "startsAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ca5a043c4ab040e7ae65eaf6eb1" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4faf556988f5b6a755ef2e85ae" ON "ScheduledMaintenanceStateTimeline" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_411146017bcfe98bbe028b8d15" ON "ScheduledMaintenanceStateTimeline" ("scheduledMaintenanceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c0f750d3a964180d1e1efa16e" ON "ScheduledMaintenanceStateTimeline" ("scheduledMaintenanceStateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58aa5722dde40c062793ede637" ON "ScheduledMaintenanceStateTimeline" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_978cd5638c6e44186cbd1099d9" ON "ScheduledMaintenanceStateTimeline" ("endsAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_590161c4f8e0b63e7ed3fd2163" ON "ScheduledMaintenanceStateTimeline" ("startsAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ShortLink" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "shortId" character varying(100) NOT NULL, "link" text NOT NULL, "deletedByUserId" uuid, CONSTRAINT "PK_7ddbabbe684e03ba2d9e508d2a1" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_339f8fe3bc6fb4440541cc61a4" ON "ShortLink" ("shortId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "SmsLog" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "toNumber" character varying(30) NOT NULL, "fromNumber" character varying(30) NOT NULL, "smsText" text, "statusMessage" character varying(500), "status" character varying(100) NOT NULL, "smsCostInUSDCents" integer NOT NULL DEFAULT '0', "deletedByUserId" uuid, CONSTRAINT "PK_ce409036fe144b388c56688d33e" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a30bbda7f5480e498ebc609663" ON "SmsLog" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12854d2b71004825924a476dfc" ON "SmsLog" ("toNumber") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68d0fe13df157c0a93d1ff6fa1" ON "SmsLog" ("fromNumber") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageAnnouncement" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "title" character varying(100) NOT NULL, "showAnnouncementAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAnnouncementAt" TIMESTAMP WITH TIME ZONE NOT NULL, "description" text NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isStatusPageSubscribersNotified" boolean NOT NULL DEFAULT false, "shouldStatusPageSubscribersBeNotified" boolean NOT NULL DEFAULT true, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4e9a99bb763b7be65ef01a2f40f" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5e9c5a7393ac9aa477d625de67" ON "StatusPageAnnouncement" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c5cbb3fcaf6be56918520501c" ON "StatusPageAnnouncement" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageCustomField" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "type" character varying(100), "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_8b102bbed53bc8f5793a1411469" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f5ae90bc48a0ddeb50cd009aa" ON "StatusPageCustomField" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageDomain" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "domainId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "subdomain" character varying(100) NOT NULL, "fullDomain" character varying(100) NOT NULL, "createdByUserId" uuid, "cnameVerificationToken" character varying(100) NOT NULL, "isCnameVerified" boolean NOT NULL DEFAULT false, "isSslOrdered" boolean NOT NULL DEFAULT false, "isSslProvisioned" boolean NOT NULL DEFAULT false, "deletedByUserId" uuid, CONSTRAINT "PK_e9ae7614164ee86237ed0b64a1c" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40cca185c8cf933c04a0534676" ON "StatusPageDomain" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7fab5bc54a8f36eac8f31c8256" ON "StatusPageDomain" ("domainId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_842a66fcb103388fcedffef75f" ON "StatusPageDomain" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageFooterLink" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "title" character varying(100) NOT NULL, "link" character varying(100) NOT NULL, "createdByUserId" uuid, "order" integer NOT NULL, "deletedByUserId" uuid, CONSTRAINT "PK_73ac6c05ace86d6b2f1a1f9daf6" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f8f65447c9b881860bf742dc9" ON "StatusPageFooterLink" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a80c698b2205074f53376d631" ON "StatusPageFooterLink" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageGroup" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" text, "createdByUserId" uuid, "order" integer NOT NULL, "isExpandedByDefault" boolean NOT NULL DEFAULT true, "deletedByUserId" uuid, CONSTRAINT "PK_dfba3695e73b92b24f3408b0040" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a96c34f030a6e39218352a947" ON "StatusPageGroup" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5dbcfd7d38e5ea7a78a6a78a33" ON "StatusPageGroup" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageHeaderLink" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "title" character varying(100) NOT NULL, "link" character varying(100) NOT NULL, "createdByUserId" uuid, "order" integer NOT NULL, "deletedByUserId" uuid, CONSTRAINT "PK_11c21c610618e5f36a5d04bb2a4" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_70d70692cbe9d9be188723df4f" ON "StatusPageHeaderLink" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_99c017b6ced8da63abdfbb506e" ON "StatusPageHeaderLink" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageHistoryChartBarColorRule" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "uptimePercentGreaterThanOrEqualTo" numeric NOT NULL, "barColor" character varying(7) NOT NULL, "createdByUserId" uuid, "order" integer NOT NULL, "deletedByUserId" uuid, CONSTRAINT "PK_c91ba8fce53892bef71f7876abf" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a65f8fabf888d227d64570f52b" ON "StatusPageHistoryChartBarColorRule" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54edc7ff7a74a0310a512c5389" ON "StatusPageHistoryChartBarColorRule" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageOwnerTeam" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "teamId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d0d67c8db3a8eb42aeb18819c52" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9fac66064d88c514d2e5503237" ON "StatusPageOwnerTeam" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f60296efefe379693bfd55a776" ON "StatusPageOwnerTeam" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a98e42d8df3ba84bd0f79da55" ON "StatusPageOwnerTeam" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14768105dd06f0e3e75ec5b051" ON "StatusPageOwnerTeam" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageOwnerUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isOwnerNotified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_449db4a6703eb1dd929d0d48cca" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c28e05c08656f8aa756734c37c" ON "StatusPageOwnerUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c59f811e0660c5522e45e85b6" ON "StatusPageOwnerUser" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_69b1659abafe656563259784d0" ON "StatusPageOwnerUser" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_feea72d826c4bf508a95c7c757" ON "StatusPageOwnerUser" ("isOwnerNotified") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPagePrivateUser" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "email" character varying(100), "password" character varying(64), "resetPasswordToken" character varying(100), "resetPasswordExpires" TIMESTAMP WITH TIME ZONE, "lastActive" TIMESTAMP WITH TIME ZONE, "createdByUserId" uuid, "isSsoUser" boolean NOT NULL DEFAULT false, "deletedByUserId" uuid, CONSTRAINT "PK_6a541c0c9e0538dcc1499df13ae" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ce45fe77324ede75166d0f57d" ON "StatusPagePrivateUser" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0589c51161d13b752fed41a319" ON "StatusPagePrivateUser" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageResource" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "monitorId" uuid, "monitorGroupId" uuid, "statusPageGroupId" uuid, "displayName" character varying(100) NOT NULL, "displayDescription" text, "displayTooltip" character varying(500), "showCurrentStatus" boolean NOT NULL DEFAULT true, "showUptimePercent" boolean NOT NULL DEFAULT false, "uptimePercentPrecision" character varying, "showStatusHistoryChart" boolean NOT NULL DEFAULT true, "createdByUserId" uuid, "order" integer NOT NULL, "deletedByUserId" uuid, CONSTRAINT "PK_31a5bda3b231f58c41603a56180" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8fba35fb87a0ad6037eb8fc804" ON "StatusPageResource" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ade3f7acf902dcb313d230ca1f" ON "StatusPageResource" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b1c4fe08e1d90ae4d26d934653" ON "StatusPageResource" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a55bb812676bff276cef1f14c8" ON "StatusPageResource" ("monitorGroupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b61276c47d6091295dec9e535" ON "StatusPageResource" ("statusPageGroupId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageSSO" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "signatureMethod" character varying(100) NOT NULL, "digestMethod" character varying(100) NOT NULL, "signOnURL" text NOT NULL, "issuerURL" text NOT NULL, "publicCertificate" text NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "isEnabled" boolean NOT NULL DEFAULT false, "isTested" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_55453332aa136bd5e3962a1abb1" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1d63fa142dd4175ef256f21d2a" ON "StatusPageSSO" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc05de7939af3ada1567fc7106" ON "StatusPageSSO" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageSubscriber" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "statusPageId" uuid NOT NULL, "subscriberEmail" character varying(100), "subscriberPhone" character varying(30), "subscriberWebhook" character varying, "createdByUserId" uuid, "deletedByUserId" uuid, "isUnsubscribed" boolean NOT NULL DEFAULT false, "isSubscribedToAllResources" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_9f289c2fb525ab8f6cefec03923" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6adf943966e01699e86117d2e3" ON "StatusPageSubscriber" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_217b295d5882faa6cf3418ed81" ON "StatusPageSubscriber" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "TeamMember" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "teamId" uuid, "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "hasAcceptedInvitation" boolean NOT NULL DEFAULT false, "invitationAcceptedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6f582955f553c7e3035937933ca" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3cc297d538f01065f9925cfb11" ON "TeamMember" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd952f76f5a5297ce69a9a588e" ON "TeamMember" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "TeamPermission" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "teamId" uuid, "createdByUserId" uuid, "deletedByUserId" uuid, "permission" character varying(100) NOT NULL, "isBlockPermission" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_34aa36d573354d1f1e7901c4b11" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_78293e9cc1746e5f29ccccfdfc" ON "TeamPermission" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5064c0bdc8ff238952f9a2acf4" ON "TeamPermission" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "TelemetryService" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "telemetryServiceToken" uuid NOT NULL, "retainTelemetryDataForDays" integer DEFAULT '15', "serviceColor" character varying, CONSTRAINT "PK_0bb1c96ecbe42ec7d65544eaecc" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3a3321fd538aa014aa5e4f3522" ON "TelemetryService" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6c89ae3af06376fe3411cf8295" ON "TelemetryService" ("telemetryServiceToken") `,
    );
    await queryRunner.query(
      `CREATE TABLE "TelemetryUsageBilling" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "day" character varying(100) NOT NULL, "productType" character varying(100) NOT NULL, "retainTelemetryDataForDays" integer DEFAULT '15', "dataIngestedInGB" numeric NOT NULL, "totalCostInUSD" numeric NOT NULL, "isReportedToBillingProvider" boolean NOT NULL DEFAULT false, "telemetryServiceId" uuid NOT NULL, "reportedToBillingProviderAt" TIMESTAMP WITH TIME ZONE, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_218b46ea3e545bc0c017d7a5d81" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5670be95a9496b9380b7c0d793" ON "TelemetryUsageBilling" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91333210492e5d2f334231468a" ON "TelemetryUsageBilling" ("telemetryServiceId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "UserCall" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "phone" character varying(30) NOT NULL, "userId" uuid, "createdByUserId" uuid, "deletedByUserId" uuid, "isVerified" boolean NOT NULL DEFAULT false, "verificationCode" character varying(100) NOT NULL, CONSTRAINT "PK_6c486fc3456229565b1dbf1ad89" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db4e522c086be556e5101c4e91" ON "UserCall" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d90bd0e309ad43c4541bb428e" ON "UserCall" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "UserEmail" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "email" character varying(100) NOT NULL, "userId" uuid, "createdByUserId" uuid, "deletedByUserId" uuid, "isVerified" boolean NOT NULL DEFAULT false, "verificationCode" character varying(100) NOT NULL, CONSTRAINT "PK_72aad6f19ecf4ee9d19253b8b4e" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6beed22b36201aea1d70ba0d7" ON "UserEmail" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f713c701d85c69f706e4e82b8" ON "UserEmail" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "UserSMS" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "phone" character varying(30) NOT NULL, "userId" uuid, "createdByUserId" uuid, "deletedByUserId" uuid, "isVerified" boolean NOT NULL DEFAULT false, "verificationCode" character varying(100) NOT NULL, CONSTRAINT "PK_f46801e2914a3e668ccf632f29b" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6439689a29a2192708e3f3603d" ON "UserSMS" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3cb16b5c2d69dbdc812247788f" ON "UserSMS" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "UserNotificationRule" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "ruleType" character varying(100) NOT NULL, "userId" uuid, "createdByUserId" uuid, "deletedByUserId" uuid, "userCallId" uuid, "userSmsId" uuid, "userEmailId" uuid, "notifyAfterMinutes" integer NOT NULL DEFAULT '0', "incidentSeverityId" uuid, CONSTRAINT "PK_c40ab942792cd8e5ad426d95d93" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_69d439e9f60f05ae16732c4999" ON "UserNotificationRule" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32efb91af1b432a25ceb55bc0d" ON "UserNotificationRule" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ec8e7a39fcd38d0ea2d40b8afa" ON "UserNotificationRule" ("userCallId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32ca4397660dafe0cab7d03e5b" ON "UserNotificationRule" ("userSmsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b407063ee43233b0cc8e9106cb" ON "UserNotificationRule" ("userEmailId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1a5912cdf877c89121a3090cd" ON "UserNotificationRule" ("notifyAfterMinutes") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bf703b216d7f59424302dc5d70" ON "UserNotificationRule" ("incidentSeverityId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "UserNotificationSetting" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "eventType" character varying(100) NOT NULL, "userId" uuid, "createdByUserId" uuid, "deletedByUserId" uuid, "alertByEmail" boolean NOT NULL DEFAULT false, "alertBySMS" boolean NOT NULL DEFAULT false, "alertByCall" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e79f19e013370f8cf428f8bc9e4" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f110fc752889f922d6a3c57a5" ON "UserNotificationSetting" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e2565b0aa7d7e015fb6685afed" ON "UserNotificationSetting" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "UserOnCallLog" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "userId" uuid NOT NULL, "userBelongsToTeamId" uuid, "projectId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, "onCallDutyPolicyExecutionLogId" uuid NOT NULL, "onCallDutyPolicyEscalationRuleId" uuid NOT NULL, "triggeredByIncidentId" uuid NOT NULL, "status" character varying(100) NOT NULL, "userNotificationEventType" character varying(100) NOT NULL, "onCallDutyPolicyExecutionLogTimelineId" uuid NOT NULL, "statusMessage" character varying(500) NOT NULL, "createdByUserId" uuid, "deletedByUserId" uuid, "acknowledgedByUserId" uuid, "acknowledgedAt" TIMESTAMP WITH TIME ZONE, "executedNotificationRules" jsonb, "onCallDutyScheduleId" uuid, CONSTRAINT "PK_61d65627421be2a8a7e0486b054" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ea993eab5c402623b61203e325" ON "UserOnCallLog" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4cd37d481ef366d975c6a7cd9b" ON "UserOnCallLog" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f047dd6a708175bae0ee6f8c4b" ON "UserOnCallLog" ("onCallDutyPolicyExecutionLogId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_550f9f6177451d4902467991a1" ON "UserOnCallLog" ("onCallDutyPolicyEscalationRuleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7498ad42c4f77f7fab2a6bc2e3" ON "UserOnCallLog" ("onCallDutyPolicyExecutionLogTimelineId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "UserOnCallLogTimeline" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "userId" uuid NOT NULL, "projectId" uuid NOT NULL, "userNotificationLogId" uuid NOT NULL, "userNotificationRuleId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, "triggeredByIncidentId" uuid NOT NULL, "onCallDutyPolicyExecutionLogId" uuid NOT NULL, "onCallDutyPolicyExecutionLogTimelineId" uuid NOT NULL, "userNotificationEventType" character varying(100) NOT NULL, "onCallDutyPolicyEscalationRuleId" uuid NOT NULL, "userBelongsToTeamId" uuid, "statusMessage" character varying(500) NOT NULL, "status" character varying(100) NOT NULL, "createdByUserId" uuid, "isAcknowledged" boolean, "acknowledgedAt" TIMESTAMP WITH TIME ZONE, "userCallId" uuid, "userSmsId" uuid, "userEmailId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_f82bd96ee9c1e338f49c9327430" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_79580470f34858375cae5d353a" ON "UserOnCallLogTimeline" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc79ea74fba7b99835bd475081" ON "UserOnCallLogTimeline" ("userNotificationLogId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_06a427cdcbae1ddcb1301b860f" ON "UserOnCallLogTimeline" ("userNotificationRuleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef993920a9967b61fb3fb9bf16" ON "UserOnCallLogTimeline" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58a44736718a5ec4fe41526289" ON "UserOnCallLogTimeline" ("triggeredByIncidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6491952f9d8066aa5cfff92cd8" ON "UserOnCallLogTimeline" ("onCallDutyPolicyExecutionLogId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_26e16ed3e46c6a6589a88d3abb" ON "UserOnCallLogTimeline" ("onCallDutyPolicyExecutionLogTimelineId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_222212e7157f8816357a4f0253" ON "UserOnCallLogTimeline" ("onCallDutyPolicyEscalationRuleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5c3df01bbb2a9ce168b36b523" ON "UserOnCallLogTimeline" ("userCallId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12ef8407b6359205df8339f849" ON "UserOnCallLogTimeline" ("userSmsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_815c728d905c44bc440ec91308" ON "UserOnCallLogTimeline" ("userEmailId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Workflow" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" character varying(500), "createdByUserId" uuid, "deletedByUserId" uuid, "isEnabled" boolean NOT NULL DEFAULT false, "graph" jsonb, "triggerId" character varying(100), "triggerArguments" jsonb, "repeatableJobKey" character varying, CONSTRAINT "PK_9f6d966c72bccdb6fe2e12a5614" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a87518833c744b2df4324b61a6" ON "Workflow" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "WorkflowLog" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "workflowId" uuid NOT NULL, "logs" text NOT NULL, "workflowStatus" character varying NOT NULL, "startedAt" TIMESTAMP WITH TIME ZONE, "completedAt" TIMESTAMP WITH TIME ZONE, "deletedByUserId" uuid, CONSTRAINT "PK_dc0cc28be769df9d7e2cb670c72" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6c3dc31b09a96d81982a472e22" ON "WorkflowLog" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55293b16d84f048f44c771595b" ON "WorkflowLog" ("workflowId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "WorkflowVariable" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "projectId" uuid NOT NULL, "workflowId" uuid, "name" character varying(100) NOT NULL, "description" character varying(500), "content" text NOT NULL, "isSecret" boolean NOT NULL DEFAULT false, "createdByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_9c6680c9bd6a5a7beb7127e73f1" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bb47f6d0cabd55fde5b199ae20" ON "WorkflowVariable" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c093a47a2ecfa1d5f2d4aeb04a" ON "WorkflowVariable" ("workflowId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ApiKeyPermissionLabel" ("apiKeyPermissionId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_264b4d74ff24861aafb0b8fa2ea" PRIMARY KEY ("apiKeyPermissionId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0946f6b41113cd842ee69f69fb" ON "ApiKeyPermissionLabel" ("apiKeyPermissionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4db7f66405df73287c639ece90" ON "ApiKeyPermissionLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorLabel" ("monitorId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_7651b053ae253106356301ef280" PRIMARY KEY ("monitorId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3af64cebb5a7cc7f1ad0aa70c1" ON "MonitorLabel" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1866fb21ea1acd3d5c37e28ca1" ON "MonitorLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyLabel" ("onCallDutyPolicyId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_619f9dd19e4c9f2f0f695edb757" PRIMARY KEY ("onCallDutyPolicyId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4a3f7dc4e33b896b0984e7316" ON "OnCallDutyPolicyLabel" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c0248fe6856bbe029fc492ec7" ON "OnCallDutyPolicyLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentMonitor" ("incidentId" uuid NOT NULL, "monitorId" uuid NOT NULL, CONSTRAINT "PK_0d50be2afc9e6b3182fa5d61bbe" PRIMARY KEY ("incidentId", "monitorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55e3162c1259b1b092f0ac63ee" ON "IncidentMonitor" ("incidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e2000a938f2e12c6653e68780" ON "IncidentMonitor" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentOnCallDutyPolicy" ("onCallDutyPolicyId" uuid NOT NULL, "monitorId" uuid NOT NULL, CONSTRAINT "PK_185b450b39a568ea486b69df0df" PRIMARY KEY ("onCallDutyPolicyId", "monitorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d127b6da0e4fab9f905b4d332" ON "IncidentOnCallDutyPolicy" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f89b23e3cafd1c6a0bfd42c297" ON "IncidentOnCallDutyPolicy" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentLabel" ("incidentId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_40289610e0edf423d01074471ec" PRIMARY KEY ("incidentId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1084d1ddbabbcfcab7cd9d547a" ON "IncidentLabel" ("incidentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17f4085273d14d4d6145cf6585" ON "IncidentLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentTemplateMonitor" ("incidentTemplateId" uuid NOT NULL, "monitorId" uuid NOT NULL, CONSTRAINT "PK_9a793ac183fa115b23db033ae9f" PRIMARY KEY ("incidentTemplateId", "monitorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_390a45e855282ae55ad56d1e1f" ON "IncidentTemplateMonitor" ("incidentTemplateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_33fb90ba0116b7db4efd4ec7a4" ON "IncidentTemplateMonitor" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentTemplateOnCallDutyPolicy" ("incidentTemplateId" uuid NOT NULL, "onCallDutyPolicyId" uuid NOT NULL, CONSTRAINT "PK_219e90dde24e7096fdaee3089c7" PRIMARY KEY ("incidentTemplateId", "onCallDutyPolicyId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_99245f38769689fe8a172dcb81" ON "IncidentTemplateOnCallDutyPolicy" ("incidentTemplateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2b76b57ea6659f97a4bcd1156c" ON "IncidentTemplateOnCallDutyPolicy" ("onCallDutyPolicyId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "IncidentTemplateLabel" ("incidentTemplateId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_8c893e072c280f3ea36c40a4543" PRIMARY KEY ("incidentTemplateId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d527ebc73a91eefcae4beaaf82" ON "IncidentTemplateLabel" ("incidentTemplateId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fcf64673a74380a67159376b85" ON "IncidentTemplateLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorGroupLabel" ("monitorGroupId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_007b146dcc3053bcae3a480fc27" PRIMARY KEY ("monitorGroupId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2fed2a41449af9a9cf821b759d" ON "MonitorGroupLabel" ("monitorGroupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a91be5ccf47cbd470c3f9ee560" ON "MonitorGroupLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "MonitorSecretMonitor" ("monitorSecretId" uuid NOT NULL, "monitorId" uuid NOT NULL, CONSTRAINT "PK_bcabf4d30297287277c049e312f" PRIMARY KEY ("monitorSecretId", "monitorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fed65a7701822d21a66810bfe2" ON "MonitorSecretMonitor" ("monitorSecretId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ad10d0cd8fd68ac64ae3967dc" ON "MonitorSecretMonitor" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "OnCallDutyPolicyScheduleLabel" ("onCallDutyPolicyScheduleId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_309b0a81c1dc85eb7adbf52b074" PRIMARY KEY ("onCallDutyPolicyScheduleId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_facb426dc0647d760bba573c2d" ON "OnCallDutyPolicyScheduleLabel" ("onCallDutyPolicyScheduleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c27ee1fc2df7788145ed9e3333" ON "OnCallDutyPolicyScheduleLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ProjectSsoTeam" ("projectSsoId" uuid NOT NULL, "teamId" uuid NOT NULL, CONSTRAINT "PK_0d5098a73b48af5e3bc6f04caf8" PRIMARY KEY ("projectSsoId", "teamId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_43c6fb265bd3b69e26f1d98b66" ON "ProjectSsoTeam" ("projectSsoId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d6d43b15c7dca2734a768379f8" ON "ProjectSsoTeam" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageLabel" ("statusPageId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_511c59beeae2315d01f21848d34" PRIMARY KEY ("statusPageId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d409a46e63e25fbd4fcc9d5242" ON "StatusPageLabel" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6842f6301436d26a3115406279" ON "StatusPageLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageDownMonitorStatus" ("statusPageId" uuid NOT NULL, "monitorStatusId" uuid NOT NULL, CONSTRAINT "PK_599e5298f4663a42124ef04819b" PRIMARY KEY ("statusPageId", "monitorStatusId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d5aa67b52755d47e81bb19feb" ON "StatusPageDownMonitorStatus" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e9f66cc920a6dfd8b20be8497c" ON "StatusPageDownMonitorStatus" ("monitorStatusId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceMonitor" ("scheduledMaintenanceId" uuid NOT NULL, "monitorId" uuid NOT NULL, CONSTRAINT "PK_c48a2ac3e9aa04d61c689416b92" PRIMARY KEY ("scheduledMaintenanceId", "monitorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f74e5e95ad88301cbc6e97da6" ON "ScheduledMaintenanceMonitor" ("scheduledMaintenanceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d1a5797fdd98c1fa2f99670aab" ON "ScheduledMaintenanceMonitor" ("monitorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceStatusPage" ("scheduledMaintenanceId" uuid NOT NULL, "statusPageId" uuid NOT NULL, CONSTRAINT "PK_1a8ec8af0d0f7d83627235f08f6" PRIMARY KEY ("scheduledMaintenanceId", "statusPageId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fcab6c2c59de7fa9e1a4ed52d3" ON "ScheduledMaintenanceStatusPage" ("scheduledMaintenanceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_266f1f927ed89d829a2349d2e2" ON "ScheduledMaintenanceStatusPage" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ScheduledMaintenanceLabel" ("scheduledMaintenanceId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_abb6424e4ce1a915ad291c98e7f" PRIMARY KEY ("scheduledMaintenanceId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c88790ffdbb71aa66a5795be22" ON "ScheduledMaintenanceLabel" ("scheduledMaintenanceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f3c993200714127eb2d0851cc" ON "ScheduledMaintenanceLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "AnnouncementStatusPage" ("announcementId" uuid NOT NULL, "statusPageId" uuid NOT NULL, CONSTRAINT "PK_d0372c7b16adafd18b8591980a1" PRIMARY KEY ("announcementId", "statusPageId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f10f946bb8a5da2ef395557805" ON "AnnouncementStatusPage" ("announcementId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d7895bb35944a68cccf8286521" ON "AnnouncementStatusPage" ("statusPageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "StatusPageSubscriberStatusPageResource" ("statusPageSubscriberId" uuid NOT NULL, "statusPageResourceId" uuid NOT NULL, CONSTRAINT "PK_1a244f904475ff50c824e0e565d" PRIMARY KEY ("statusPageSubscriberId", "statusPageResourceId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_618293911d2e52dc3c6a6873b4" ON "StatusPageSubscriberStatusPageResource" ("statusPageSubscriberId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4af9c94a4b3ba11b4739a25ef" ON "StatusPageSubscriberStatusPageResource" ("statusPageResourceId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "TeamPermissionLabel" ("teamPermissionId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_977590cfe880ea88b607aca0ed6" PRIMARY KEY ("teamPermissionId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7281dda2d397d6d75c2f5285bb" ON "TeamPermissionLabel" ("teamPermissionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4523aa1dd9163aaf37698d137e" ON "TeamPermissionLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ServiceLabel" ("telemetryServiceId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_69948538ec718918cb04dc06882" PRIMARY KEY ("telemetryServiceId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_94d495f938d819dab20480c5f8" ON "ServiceLabel" ("telemetryServiceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7711266422ebad1188c4879d66" ON "ServiceLabel" ("labelId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "WorkflowLabel" ("workflowId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_1c9a857f4e8cbba7c8ccbb911cd" PRIMARY KEY ("workflowId", "labelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3747a5f42be5c977e574abcd71" ON "WorkflowLabel" ("workflowId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4e72fad380eca9abfa3b989554" ON "WorkflowLabel" ("labelId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD CONSTRAINT "FK_1f25f5fc0032f7014482d9c195e" FOREIGN KEY ("profilePictureId") REFERENCES "File"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD CONSTRAINT "FK_644c3c0393979f57f71892ff0d7" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AcmeCertificate" ADD CONSTRAINT "FK_130a8fd12e7505eebfce670b198" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AcmeChallenge" ADD CONSTRAINT "FK_71371b224feb48f1d60e847cf1b" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Reseller" ADD CONSTRAINT "FK_fe790bb94630d701a8ad93287ce" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Reseller" ADD CONSTRAINT "FK_952b3ed48545aaf18033150dc66" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ResellerPlan" ADD CONSTRAINT "FK_fc269bd109ac405a458b2acc678" FOREIGN KEY ("resellerId") REFERENCES "Reseller"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ResellerPlan" ADD CONSTRAINT "FK_34cdc5e0500513f321f0da35a64" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ResellerPlan" ADD CONSTRAINT "FK_e756416e4b0983e158f71c47c1a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" ADD CONSTRAINT "FK_639312a8ef82cbd5cee77c5b1ba" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" ADD CONSTRAINT "FK_43989dee7f7af742f6d8ec2664a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" ADD CONSTRAINT "FK_4ee6a519d48b26fe2a78fdc1c9c" FOREIGN KEY ("resellerId") REFERENCES "Reseller"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" ADD CONSTRAINT "FK_b5ee87614c184778810283c2991" FOREIGN KEY ("resellerPlanId") REFERENCES "ResellerPlan"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKey" ADD CONSTRAINT "FK_bb1019f0078a21b4854f5cb3ed4" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKey" ADD CONSTRAINT "FK_891c55549057af9a0c90c925ebb" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKey" ADD CONSTRAINT "FK_bcbc7d80fb0cfe2cbb5ae7db791" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Label" ADD CONSTRAINT "FK_f10d59c2ba66e085722e0053cb7" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Label" ADD CONSTRAINT "FK_84520cbda97d2a9cb9da7ccb18c" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Label" ADD CONSTRAINT "FK_f46caf81c5fd7664ba8da9c99ba" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermission" ADD CONSTRAINT "FK_0cf347c575f15d3836615f53258" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermission" ADD CONSTRAINT "FK_fb09dd7fefa9d5d44b1907be5fd" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermission" ADD CONSTRAINT "FK_dc8eb846ffbceafbc9c60bbfaa5" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermission" ADD CONSTRAINT "FK_ac42ef4597147c260e89a0f3d3a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingInvoice" ADD CONSTRAINT "FK_0ab13e9a92ce4801c37c2a0a77f" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingInvoice" ADD CONSTRAINT "FK_15b8130f5378f2079ed5b2fe7d1" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingInvoice" ADD CONSTRAINT "FK_0a0a1a9865d157e46b1ecf14873" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingPaymentMethod" ADD CONSTRAINT "FK_db4bb9add01b7d8286869fd9a0a" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingPaymentMethod" ADD CONSTRAINT "FK_55c3c9a9fc28000262b811cebc8" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingPaymentMethod" ADD CONSTRAINT "FK_93a1554cb316127896f66acddd3" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CallLog" ADD CONSTRAINT "FK_5648767682195afaeb09098a213" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CallLog" ADD CONSTRAINT "FK_3e510124d923fe3b994936a7cb5" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "DataMigrations" ADD CONSTRAINT "FK_1619179d46a4411e1bb4af5d342" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "DataMigrations" ADD CONSTRAINT "FK_183a8261590c30a27a1b51f4bdb" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Domain" ADD CONSTRAINT "FK_f1ce90d3f9693be29b72fabe93b" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Domain" ADD CONSTRAINT "FK_12e6ebc5c806263d562045e9282" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Domain" ADD CONSTRAINT "FK_9ace4c275b42c057b7581543ce3" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSMTPConfig" ADD CONSTRAINT "FK_a540dab929fa6582b93f258ffe5" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSMTPConfig" ADD CONSTRAINT "FK_3b7ed2d3bd1a2ee9638cccef5b0" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSMTPConfig" ADD CONSTRAINT "FK_d5458705e98b89c08c0d960422e" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailLog" ADD CONSTRAINT "FK_7b72c5131b3dd1f3edf201a561c" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailLog" ADD CONSTRAINT "FK_046364c162885b6ac65d5dd367c" FOREIGN KEY ("projectSmtpConfigId") REFERENCES "ProjectSMTPConfig"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailLog" ADD CONSTRAINT "FK_6d0739da601917d316494fcae3b" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "FK_0b65c7ffb685f6ed78aac195b1a" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "FK_9e86ebfdbef16789e9571f22074" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "GreenlockCertificate" ADD CONSTRAINT "FK_895b9b802ed002a3804136bacf1" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "GreenlockChallenge" ADD CONSTRAINT "FK_7517f5a285255f031b0f6d9663c" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentSeverity" ADD CONSTRAINT "FK_00d2f503174bf201abc6e77afde" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentSeverity" ADD CONSTRAINT "FK_2677e0a9dbf97ba0f4a7849eac6" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentSeverity" ADD CONSTRAINT "FK_d0d87151a7872a44c3d2457bfdc" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentState" ADD CONSTRAINT "FK_3d279e530067f599f3186e3821d" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentState" ADD CONSTRAINT "FK_eb33bd015e0e57ee96b60f8d773" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentState" ADD CONSTRAINT "FK_88a0ecd4b1714ac0e2eef9ac27d" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatus" ADD CONSTRAINT "FK_db1783158a23bd20dbebaae56ef" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatus" ADD CONSTRAINT "FK_bdda7fecdf44ed43ef2004e7be5" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatus" ADD CONSTRAINT "FK_55a0e488581a0d02bcdd67a4348" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" ADD CONSTRAINT "FK_996acfb590bda327843f78b7ad3" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" ADD CONSTRAINT "FK_a84bbba0dbad47918136d4dfb43" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" ADD CONSTRAINT "FK_73bdf22259019b90836aac86b28" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" ADD CONSTRAINT "FK_d3461ab640467c8c2100ea55c79" FOREIGN KEY ("currentMonitorStatusId") REFERENCES "MonitorStatus"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicy" ADD CONSTRAINT "FK_31508550a088ba2cc843a6c90c4" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicy" ADD CONSTRAINT "FK_c0c63ac58f97fd254bb5c2813dc" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicy" ADD CONSTRAINT "FK_0424b49cfcd68cdd1721df53acd" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Probe" ADD CONSTRAINT "FK_6bd931aae4920e296ea08864cd0" FOREIGN KEY ("iconFileId") REFERENCES "File"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Probe" ADD CONSTRAINT "FK_b357696dc9462ad3f9e84c6dc52" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Probe" ADD CONSTRAINT "FK_1963e116be9832b23490cca933f" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Probe" ADD CONSTRAINT "FK_272ece82a96099041b93c9141e3" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" ADD CONSTRAINT "FK_eccbc31fa1f58bd051b6f7e108b" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" ADD CONSTRAINT "FK_9b101f023b5db6491203d5c9951" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" ADD CONSTRAINT "FK_067855888a3d71803d3a5aeaecf" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" ADD CONSTRAINT "FK_6592d4f7f3b260efc23fc9b4bc9" FOREIGN KEY ("currentIncidentStateId") REFERENCES "IncidentState"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" ADD CONSTRAINT "FK_3f28fe3b32abed354a49b26c9cb" FOREIGN KEY ("incidentSeverityId") REFERENCES "IncidentSeverity"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" ADD CONSTRAINT "FK_ed0ec4960a85240f51e6779a00a" FOREIGN KEY ("changeMonitorStatusToId") REFERENCES "MonitorStatus"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" ADD CONSTRAINT "FK_7e537806a80e869917ca1d7e2e4" FOREIGN KEY ("createdByProbeId") REFERENCES "Probe"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentCustomField" ADD CONSTRAINT "FK_59e7f6a43dbc5ee54e1a1aaaaf1" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentCustomField" ADD CONSTRAINT "FK_5c1c7369e696f580186a4ff12de" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentCustomField" ADD CONSTRAINT "FK_bc64c76e766b1b880845afbcbf7" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentInternalNote" ADD CONSTRAINT "FK_ac48058b3e5f9e8361d2b8328c2" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentInternalNote" ADD CONSTRAINT "FK_b92e75645fd252e4c2f866047de" FOREIGN KEY ("incidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentInternalNote" ADD CONSTRAINT "FK_c798e09321f06d8a180916d7a5e" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentInternalNote" ADD CONSTRAINT "FK_8f23b820cbbed6d96cfedd162a2" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentNoteTemplate" ADD CONSTRAINT "FK_21d5bc0d24b3e5032dd391ec8da" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentNoteTemplate" ADD CONSTRAINT "FK_515b6970fdd528d4c9f85a5e9a4" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentNoteTemplate" ADD CONSTRAINT "FK_3c00f2b005264318a274cd38a94" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Team" ADD CONSTRAINT "FK_baac847c494f692f03fd686e9c7" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Team" ADD CONSTRAINT "FK_4be4aa023ba1c6d6443b81b3b91" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Team" ADD CONSTRAINT "FK_0d4912bf03a7a645ce95142155b" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" ADD CONSTRAINT "FK_95f76375ccac835f815d7e926a2" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" ADD CONSTRAINT "FK_389aadeb39a0806e80d4001016e" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" ADD CONSTRAINT "FK_408324d3635a826538a792422f3" FOREIGN KEY ("incidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" ADD CONSTRAINT "FK_278f483fc81c21b1bd1311ee289" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" ADD CONSTRAINT "FK_60242ecfcecaa5cb1c5241bed4c" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" ADD CONSTRAINT "FK_0ee7ae6757442fba470b213015c" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" ADD CONSTRAINT "FK_6311087eeb14ab51e6a1e6133f7" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" ADD CONSTRAINT "FK_6aa9a6b46f8e044d722da8f5a7f" FOREIGN KEY ("incidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" ADD CONSTRAINT "FK_52591665c92658ef82944d63d26" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" ADD CONSTRAINT "FK_c473db8745d0ebeb147a72986cb" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentPublicNote" ADD CONSTRAINT "FK_a9a77e5f286b5724f4e2280d0a1" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentPublicNote" ADD CONSTRAINT "FK_a6964d3aab71608daab9f20e304" FOREIGN KEY ("incidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentPublicNote" ADD CONSTRAINT "FK_691a99e582fcddcc892d8573afc" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentPublicNote" ADD CONSTRAINT "FK_cf04d778a5502be606f63e01603" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" ADD CONSTRAINT "FK_764daa366a4e195768a49e0ee39" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" ADD CONSTRAINT "FK_fe2dff414a1f67260e3c5189811" FOREIGN KEY ("incidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" ADD CONSTRAINT "FK_16d198b59f3416a8ddc630a90d2" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" ADD CONSTRAINT "FK_6b6b9dbf9ca5448c9297a58ad04" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" ADD CONSTRAINT "FK_ff0fca6570d47798771763533a9" FOREIGN KEY ("incidentStateId") REFERENCES "IncidentState"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" ADD CONSTRAINT "FK_b82dafef226b0fae1ad6cb18570" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" ADD CONSTRAINT "FK_b03e46665e4c075ed1398fcc409" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" ADD CONSTRAINT "FK_0e6a4e065ffb22f95ecfc259e9a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" ADD CONSTRAINT "FK_ceff6a4dfdccecc4aa40dbfe91a" FOREIGN KEY ("incidentSeverityId") REFERENCES "IncidentSeverity"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" ADD CONSTRAINT "FK_6d7627ab9d5172c66fc50192163" FOREIGN KEY ("changeMonitorStatusToId") REFERENCES "MonitorStatus"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" ADD CONSTRAINT "FK_cf172eb6797a64ee3750e3f3e21" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" ADD CONSTRAINT "FK_e8090c6569c3a5dbd7ef7485c99" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" ADD CONSTRAINT "FK_a895b946fccb109dedd55b85f6d" FOREIGN KEY ("incidentTemplateId") REFERENCES "IncidentTemplate"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" ADD CONSTRAINT "FK_3e8a4bd1594da3438d8fb8a6687" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" ADD CONSTRAINT "FK_af037dc245d77c282061fea1b1b" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" ADD CONSTRAINT "FK_da9dd65b4401b954a0ea2b5c8d5" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" ADD CONSTRAINT "FK_36b9b0204f4b17063483cb7308e" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" ADD CONSTRAINT "FK_876dd05e0dfc64219ef5df241c3" FOREIGN KEY ("incidentTemplateId") REFERENCES "IncidentTemplate"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" ADD CONSTRAINT "FK_a53f8aab99766a87c73c52b9037" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" ADD CONSTRAINT "FK_026e918a31de467eeb8e30ae8d1" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorCustomField" ADD CONSTRAINT "FK_1c6b61e904d8e3fec1ae719b9ef" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorCustomField" ADD CONSTRAINT "FK_93a4da4182f93ba24ab958c1b73" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorCustomField" ADD CONSTRAINT "FK_817e69522c8d2f1e2fd3f857e91" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroup" ADD CONSTRAINT "FK_13905ff40843b11145f21e33ff5" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroup" ADD CONSTRAINT "FK_abaf236c1877143fe160991cc45" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroup" ADD CONSTRAINT "FK_edd658b85b2ef7ac9b2f0687d8a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" ADD CONSTRAINT "FK_0d7052620f268d0fa17f948a851" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" ADD CONSTRAINT "FK_8f19947114087883cea771e1cb4" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" ADD CONSTRAINT "FK_618bcd9015c257b0727df36fd11" FOREIGN KEY ("monitorGroupId") REFERENCES "MonitorGroup"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" ADD CONSTRAINT "FK_7ce36c144e83082213587e19c23" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" ADD CONSTRAINT "FK_fdbe93e29e60763a306358cab55" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" ADD CONSTRAINT "FK_d5cfbebf8b07405652f5382e157" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" ADD CONSTRAINT "FK_4b25f4a18bec8cb177e8d65c5f9" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" ADD CONSTRAINT "FK_6a4095ee3d04454071816a5bad8" FOREIGN KEY ("monitorGroupId") REFERENCES "MonitorGroup"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" ADD CONSTRAINT "FK_9267db147738caed0ccfdc3af22" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" ADD CONSTRAINT "FK_e9bced91dce29928ebeec834905" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" ADD CONSTRAINT "FK_825791d5edb2403d7937f16ed91" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" ADD CONSTRAINT "FK_cf3dcaa746835ae36615a39d862" FOREIGN KEY ("monitorGroupId") REFERENCES "MonitorGroup"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" ADD CONSTRAINT "FK_50b373c428cfd4566cc5caf98e6" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" ADD CONSTRAINT "FK_cf595b683e26e560526404663fe" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" ADD CONSTRAINT "FK_1a54eaa2d0187d10de84107a09b" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" ADD CONSTRAINT "FK_6a6213072d8637e6e625bc78929" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" ADD CONSTRAINT "FK_63e5bbac01d1f68c7b08f126cd4" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" ADD CONSTRAINT "FK_1d5265d1f3ca2f8b8e461e4998c" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" ADD CONSTRAINT "FK_58610249ec4cf593e36210dcb84" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" ADD CONSTRAINT "FK_7ebfe3ddcf597fb73ee8eac2ff4" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" ADD CONSTRAINT "FK_12a3497e1404fcdbc4e8963a58e" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" ADD CONSTRAINT "FK_324f1d50d0427bbd0e3308c4592" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" ADD CONSTRAINT "FK_a65ce9b11b2d7bde123aa7633fd" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" ADD CONSTRAINT "FK_e2cf60b88171dfe5fdd0e4fe6c1" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" ADD CONSTRAINT "FK_e1ae2c698e6bde0a98c50162235" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" ADD CONSTRAINT "FK_d887935f224b896ce64872c37c7" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" ADD CONSTRAINT "FK_2d50a0e0e624369e7f90a62e8dc" FOREIGN KEY ("probeId") REFERENCES "Probe"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" ADD CONSTRAINT "FK_a540272f483ef1de68f7e647486" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" ADD CONSTRAINT "FK_4399ab64a5c00d55e5ce254deeb" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" ADD CONSTRAINT "FK_a182ba062c0a216395d0dbdbdee" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecret" ADD CONSTRAINT "FK_7c3629c5ae14e97bede3bc548e5" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecret" ADD CONSTRAINT "FK_a886cd3bbdfd84d01167f92cb65" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecret" ADD CONSTRAINT "FK_e4262f178662aaacdb54d4c4f4e" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" ADD CONSTRAINT "FK_80213eb3f228f1e3d423f5127e2" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" ADD CONSTRAINT "FK_c08a7c1ef8d511b335a991aac47" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" ADD CONSTRAINT "FK_d7f555ef162fe878e4ed62a3e23" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" ADD CONSTRAINT "FK_d293a7e96c5bf427072514f21a9" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" ADD CONSTRAINT "FK_574feb4161c5216c2c7ee0faaf8" FOREIGN KEY ("monitorStatusId") REFERENCES "MonitorStatus"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyCustomField" ADD CONSTRAINT "FK_e791474e098f276eda27704b479" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyCustomField" ADD CONSTRAINT "FK_456bff32fd0428134ef7396385f" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyCustomField" ADD CONSTRAINT "FK_43230e739b31e3f56284407b586" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRule" ADD CONSTRAINT "FK_d45a545669dc46da25cc60d1df5" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRule" ADD CONSTRAINT "FK_b90c1cda36981c41e3965a93800" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRule" ADD CONSTRAINT "FK_ad8097a9359965d02ccbb16358b" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRule" ADD CONSTRAINT "FK_5c0911d261a941b00d41b6e5fda" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicySchedule" ADD CONSTRAINT "FK_0e1b7c3c3e8305a10716cdb8d6e" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicySchedule" ADD CONSTRAINT "FK_ecb5141b27e85674c294a2541b3" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicySchedule" ADD CONSTRAINT "FK_01e63400072d0bc6debee836cbf" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" ADD CONSTRAINT "FK_efa24aa8feb92d4e15a707c20ec" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" ADD CONSTRAINT "FK_651a4ab9e3cbb20f6b62a87a6b8" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" ADD CONSTRAINT "FK_13a87c38fe2efa41940783af690" FOREIGN KEY ("onCallDutyPolicyScheduleId") REFERENCES "OnCallDutyPolicySchedule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" ADD CONSTRAINT "FK_089081f83ef22cdba5a0903ce59" FOREIGN KEY ("onCallDutyPolicyEscalationRuleId") REFERENCES "OnCallDutyPolicyEscalationRule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" ADD CONSTRAINT "FK_90700af75cbe8129db898ac8adb" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" ADD CONSTRAINT "FK_878e14be4e6366ec646f874347a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" ADD CONSTRAINT "FK_c8aff8439fbfb07e7388aa9011b" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" ADD CONSTRAINT "FK_f5121f361345d858ce740a55a25" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" ADD CONSTRAINT "FK_26ba1a6edd877647cedd1eae8ca" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" ADD CONSTRAINT "FK_0e7d4060e2fabe0957b9fedb429" FOREIGN KEY ("onCallDutyPolicyEscalationRuleId") REFERENCES "OnCallDutyPolicyEscalationRule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" ADD CONSTRAINT "FK_da2e065de293a14b69964fb3233" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" ADD CONSTRAINT "FK_73ae2b2702aef4601c39d4d909a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" ADD CONSTRAINT "FK_b15552e664640f67346193598a1" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" ADD CONSTRAINT "FK_9ca3fbb66842324aa987d4c9722" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" ADD CONSTRAINT "FK_bff6f4ae726b5c5cbae10e7d743" FOREIGN KEY ("onCallDutyPolicyEscalationRuleId") REFERENCES "OnCallDutyPolicyEscalationRule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" ADD CONSTRAINT "FK_5a7b7a746409a175423a1bbd5c4" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" ADD CONSTRAINT "FK_f9a45cea88022a9cf5b96c13e65" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" ADD CONSTRAINT "FK_d35f668f524cc88f580a7651fe2" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" ADD CONSTRAINT "FK_00e9676d39eeb807de704430512" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" ADD CONSTRAINT "FK_e4bb332263960531a4c9e2d4254" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" ADD CONSTRAINT "FK_a230899d6c2b16621954c46fb16" FOREIGN KEY ("triggeredByIncidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" ADD CONSTRAINT "FK_16b426d34ff2c5cbd6ecfd70820" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" ADD CONSTRAINT "FK_e9302e15399b67938e0121a0545" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" ADD CONSTRAINT "FK_63f6618df216b74b72e62491b09" FOREIGN KEY ("acknowledgedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" ADD CONSTRAINT "FK_3015ddfeb130417c55489da807e" FOREIGN KEY ("acknowledgedByTeamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" ADD CONSTRAINT "FK_d4a0ffc5e9e698bb2612ba0e55f" FOREIGN KEY ("lastExecutedEscalationRuleId") REFERENCES "OnCallDutyPolicyEscalationRule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_591b7ed73c964e105bfecc6fd6d" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_c5a798ca667fedda71d4ed54651" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_90119ec7f77fa2efd82261e0448" FOREIGN KEY ("triggeredByIncidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_872c2f6a9739bab1b57b6d51eac" FOREIGN KEY ("onCallDutyPolicyExecutionLogId") REFERENCES "OnCallDutyPolicyExecutionLog"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_0ad4222a4c48b8a64e3a58b3519" FOREIGN KEY ("onCallDutyPolicyEscalationRuleId") REFERENCES "OnCallDutyPolicyEscalationRule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_0ae6ea2e2d38fd31543768e3609" FOREIGN KEY ("alertSentToUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_039098d4af133bd9c2b90978ef4" FOREIGN KEY ("userBelongsToTeamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_65998388ab4266dda712502ad65" FOREIGN KEY ("onCallDutyScheduleId") REFERENCES "OnCallDutyPolicySchedule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_43f833a79cf4201b3fa1deed023" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" ADD CONSTRAINT "FK_166f3696b3c70989507dd7e1f2e" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayer" ADD CONSTRAINT "FK_3b892ef36671f1ea1c8457a96d6" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayer" ADD CONSTRAINT "FK_6fa6574a45cf1352c5a3b962512" FOREIGN KEY ("onCallDutyPolicyScheduleId") REFERENCES "OnCallDutyPolicySchedule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayer" ADD CONSTRAINT "FK_1db1083a896b0f77a0e87f26463" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayer" ADD CONSTRAINT "FK_f22b52355207d2c0d5a13c168e8" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" ADD CONSTRAINT "FK_08afccd6cbbd1a7015d4fe25e39" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" ADD CONSTRAINT "FK_9b36bba6d9898331920805a29ca" FOREIGN KEY ("onCallDutyPolicyScheduleId") REFERENCES "OnCallDutyPolicySchedule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" ADD CONSTRAINT "FK_41f4ecc29351e1a406e83b30a93" FOREIGN KEY ("onCallDutyPolicyScheduleLayerId") REFERENCES "OnCallDutyPolicyScheduleLayer"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" ADD CONSTRAINT "FK_b2ccbfcc3964caf3dfd89243f8f" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" ADD CONSTRAINT "FK_49e5a41e1d771fe9e385295bd9a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" ADD CONSTRAINT "FK_416e830c88f2ecfa149f4cd51c8" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectCallSMSConfig" ADD CONSTRAINT "FK_20334b9571a6cd1a871e70d8e76" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectCallSMSConfig" ADD CONSTRAINT "FK_e873aa20a371bd92e220332a992" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectCallSMSConfig" ADD CONSTRAINT "FK_f5bc0e2b81886b21004e2a5f67b" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSSO" ADD CONSTRAINT "FK_be9e6751765501ea1db126fcb23" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSSO" ADD CONSTRAINT "FK_28011315533e2d819295d261ee4" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSSO" ADD CONSTRAINT "FK_00ea9e456217ffbfff35f1e944f" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" ADD CONSTRAINT "FK_90e44f45272c0da256951183086" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" ADD CONSTRAINT "FK_3169f7934171e8f697bb993b010" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" ADD CONSTRAINT "FK_6dcdf97c0834dd44b4f2c93e664" FOREIGN KEY ("resellerId") REFERENCES "Reseller"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" ADD CONSTRAINT "FK_7aecf4b1ae3e45647cb911f4c10" FOREIGN KEY ("resellerPlanId") REFERENCES "ResellerPlan"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" ADD CONSTRAINT "FK_a7b405e2a9ae144be016bcf973d" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceState" ADD CONSTRAINT "FK_57a31fb2a5e4caa223d2506a4e1" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceState" ADD CONSTRAINT "FK_88044fd50006f1897e8c760d136" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceState" ADD CONSTRAINT "FK_4f803428e0926584d1f7c44a3d4" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD CONSTRAINT "FK_34a4c35e0d7afe6f023825a68c7" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD CONSTRAINT "FK_da54bb2c4997ee1a3b73026d7f5" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD CONSTRAINT "FK_71f429afb7678d132472b3c87b0" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD CONSTRAINT "FK_1f17f293352ebdc3bcf383158cc" FOREIGN KEY ("faviconFileId") REFERENCES "File"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD CONSTRAINT "FK_84df83d1f492a19a08aee465500" FOREIGN KEY ("logoFileId") REFERENCES "File"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD CONSTRAINT "FK_602b456a61d73a96e97f483064d" FOREIGN KEY ("coverImageFileId") REFERENCES "File"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD CONSTRAINT "FK_61944d851b4a7213d79ef281744" FOREIGN KEY ("smtpConfigId") REFERENCES "ProjectSMTPConfig"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD CONSTRAINT "FK_4e347d3f99b67dacd149beaf61d" FOREIGN KEY ("callSmsConfigId") REFERENCES "ProjectCallSMSConfig"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" ADD CONSTRAINT "FK_4059dd569d6a482062352bf266a" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" ADD CONSTRAINT "FK_5442fd86c96d45e062d5ee1f093" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" ADD CONSTRAINT "FK_50ddf8bb21e988ea5d419a66cb9" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" ADD CONSTRAINT "FK_883038abda021ce79fa838d0273" FOREIGN KEY ("currentScheduledMaintenanceStateId") REFERENCES "ScheduledMaintenanceState"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" ADD CONSTRAINT "FK_fab9cc7e6ffcf02872fccfab978" FOREIGN KEY ("changeMonitorStatusToId") REFERENCES "MonitorStatus"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceCustomField" ADD CONSTRAINT "FK_3621c488327e1c00518aa4e8816" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceCustomField" ADD CONSTRAINT "FK_c7cdb245d3d98be14482f092eca" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceCustomField" ADD CONSTRAINT "FK_9094eed77fb6e8f7ecf1502f5e0" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceInternalNote" ADD CONSTRAINT "FK_d79c49a0a613a6b432fd400e69b" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceInternalNote" ADD CONSTRAINT "FK_a53ef45aebd4a6a6e7dde7f896a" FOREIGN KEY ("scheduledMaintenanceId") REFERENCES "ScheduledMaintenance"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceInternalNote" ADD CONSTRAINT "FK_69757967d2ee696f487fb8ac37e" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceInternalNote" ADD CONSTRAINT "FK_7fb00788b6ac97988dd43e2e1b2" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceNoteTemplate" ADD CONSTRAINT "FK_b4cb4c1312eb72459907e1bbe9b" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceNoteTemplate" ADD CONSTRAINT "FK_e38c1102001ae0b70c22e046424" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceNoteTemplate" ADD CONSTRAINT "FK_4c3d6b87bb1e8739cdeb8b92f74" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" ADD CONSTRAINT "FK_e3053b1725658b4a120b4e3185d" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" ADD CONSTRAINT "FK_1206beb611e0779ce2248ecbaeb" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" ADD CONSTRAINT "FK_1251fb7d4a4bf8586f2bd1528eb" FOREIGN KEY ("scheduledMaintenanceId") REFERENCES "ScheduledMaintenance"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" ADD CONSTRAINT "FK_cc0e8ca9e9065ca0cc24bf6275b" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" ADD CONSTRAINT "FK_52a3a932530026bafef87e62177" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" ADD CONSTRAINT "FK_518742c7037d9a38a6594dc18a6" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" ADD CONSTRAINT "FK_be6a25806925f93b8949e61929b" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" ADD CONSTRAINT "FK_967c33f7bce5de522c1d1a80e7b" FOREIGN KEY ("scheduledMaintenanceId") REFERENCES "ScheduledMaintenance"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" ADD CONSTRAINT "FK_c91d4d420e3faaf15fa928fd214" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" ADD CONSTRAINT "FK_6e6b087ba99fe433f83f87e0a35" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenancePublicNote" ADD CONSTRAINT "FK_73c6737ab4a7718c45932bffada" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenancePublicNote" ADD CONSTRAINT "FK_937aabd4adbfce78663406a2487" FOREIGN KEY ("scheduledMaintenanceId") REFERENCES "ScheduledMaintenance"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenancePublicNote" ADD CONSTRAINT "FK_1f67cfb63bd3488b7c5c5b7fac7" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenancePublicNote" ADD CONSTRAINT "FK_28e179283c409e0751aae713949" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" ADD CONSTRAINT "FK_4faf556988f5b6a755ef2e85ae8" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" ADD CONSTRAINT "FK_411146017bcfe98bbe028b8d15a" FOREIGN KEY ("scheduledMaintenanceId") REFERENCES "ScheduledMaintenance"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" ADD CONSTRAINT "FK_2392299477cfc4f612ecb73e839" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" ADD CONSTRAINT "FK_aa84fcdf2fef6c2005ebab2c197" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" ADD CONSTRAINT "FK_7c0f750d3a964180d1e1efa16ea" FOREIGN KEY ("scheduledMaintenanceStateId") REFERENCES "ScheduledMaintenanceState"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ShortLink" ADD CONSTRAINT "FK_11f179cd8e9beee22b89c316972" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "SmsLog" ADD CONSTRAINT "FK_a30bbda7f5480e498ebc609663b" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "SmsLog" ADD CONSTRAINT "FK_d00778bcfaa735fbb5dc91c1945" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageAnnouncement" ADD CONSTRAINT "FK_5e9c5a7393ac9aa477d625de673" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageAnnouncement" ADD CONSTRAINT "FK_1491bd0895d515969eee2a08c80" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageAnnouncement" ADD CONSTRAINT "FK_7251cbbaa75eb9570830b0cab32" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageCustomField" ADD CONSTRAINT "FK_4f5ae90bc48a0ddeb50cd009aaf" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageCustomField" ADD CONSTRAINT "FK_e0abd7540f860de19607dc25bc0" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageCustomField" ADD CONSTRAINT "FK_26b4a892f3b31c5b0b285c4e5cb" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" ADD CONSTRAINT "FK_40cca185c8cf933c04a0534676b" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" ADD CONSTRAINT "FK_7fab5bc54a8f36eac8f31c82565" FOREIGN KEY ("domainId") REFERENCES "Domain"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" ADD CONSTRAINT "FK_842a66fcb103388fcedffef75f7" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" ADD CONSTRAINT "FK_106e359f945432d6583bd30ff4b" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" ADD CONSTRAINT "FK_6c82107f63d1a3186d579a6d9cb" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageFooterLink" ADD CONSTRAINT "FK_5f8f65447c9b881860bf742dc98" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageFooterLink" ADD CONSTRAINT "FK_1a80c698b2205074f53376d631b" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageFooterLink" ADD CONSTRAINT "FK_bd6f15ab951095e624ea664d9a6" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageFooterLink" ADD CONSTRAINT "FK_0328201140b59b4b813f83b06a9" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageGroup" ADD CONSTRAINT "FK_4a96c34f030a6e39218352a947a" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageGroup" ADD CONSTRAINT "FK_5dbcfd7d38e5ea7a78a6a78a330" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageGroup" ADD CONSTRAINT "FK_0a63a8ee804658921edf1e870af" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageGroup" ADD CONSTRAINT "FK_61191c9c00f7279615e13af4bbd" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHeaderLink" ADD CONSTRAINT "FK_70d70692cbe9d9be188723df4f0" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHeaderLink" ADD CONSTRAINT "FK_99c017b6ced8da63abdfbb506eb" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHeaderLink" ADD CONSTRAINT "FK_88048566089097605e26fdb2893" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHeaderLink" ADD CONSTRAINT "FK_0d3a63f1c684e78297b213c348e" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHistoryChartBarColorRule" ADD CONSTRAINT "FK_a65f8fabf888d227d64570f52b3" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHistoryChartBarColorRule" ADD CONSTRAINT "FK_54edc7ff7a74a0310a512c53895" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHistoryChartBarColorRule" ADD CONSTRAINT "FK_5d973aa991ba9f06b642d3fc9d7" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHistoryChartBarColorRule" ADD CONSTRAINT "FK_8041d41239c4218bf136bf20591" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" ADD CONSTRAINT "FK_9fac66064d88c514d2e5503237a" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" ADD CONSTRAINT "FK_f60296efefe379693bfd55a7760" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" ADD CONSTRAINT "FK_6a98e42d8df3ba84bd0f79da550" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" ADD CONSTRAINT "FK_7c1168daf53c46678045ff39d31" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" ADD CONSTRAINT "FK_e992fcc346afa21a89ba9f75f25" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" ADD CONSTRAINT "FK_c28e05c08656f8aa756734c37c5" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" ADD CONSTRAINT "FK_3c59f811e0660c5522e45e85b6a" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" ADD CONSTRAINT "FK_69b1659abafe656563259784d02" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" ADD CONSTRAINT "FK_4ecb38fa1941bb0961641803f21" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" ADD CONSTRAINT "FK_8d7351e844adfd5c279fd8e9f3b" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPagePrivateUser" ADD CONSTRAINT "FK_1ce45fe77324ede75166d0f57dd" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPagePrivateUser" ADD CONSTRAINT "FK_0589c51161d13b752fed41a3193" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPagePrivateUser" ADD CONSTRAINT "FK_e47c85ead36095d040493775a3f" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPagePrivateUser" ADD CONSTRAINT "FK_524d2e71f90ef8f78d85d5fdfd1" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" ADD CONSTRAINT "FK_8fba35fb87a0ad6037eb8fc8040" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" ADD CONSTRAINT "FK_ade3f7acf902dcb313d230ca1f5" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" ADD CONSTRAINT "FK_b1c4fe08e1d90ae4d26d934653c" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" ADD CONSTRAINT "FK_a55bb812676bff276cef1f14c86" FOREIGN KEY ("monitorGroupId") REFERENCES "MonitorGroup"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" ADD CONSTRAINT "FK_9b61276c47d6091295dec9e5350" FOREIGN KEY ("statusPageGroupId") REFERENCES "StatusPageGroup"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" ADD CONSTRAINT "FK_51e0fbc6d460394b1cd38959790" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" ADD CONSTRAINT "FK_d2b2f7ffe8f976fda20f4b96c5b" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSSO" ADD CONSTRAINT "FK_1d63fa142dd4175ef256f21d2a6" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSSO" ADD CONSTRAINT "FK_dc05de7939af3ada1567fc7106b" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSSO" ADD CONSTRAINT "FK_8e2cbcf07eba956fe976ca3d043" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSSO" ADD CONSTRAINT "FK_0bfc26bce8ea92b8b8a9e0400de" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriber" ADD CONSTRAINT "FK_6adf943966e01699e86117d2e34" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriber" ADD CONSTRAINT "FK_217b295d5882faa6cf3418ed811" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriber" ADD CONSTRAINT "FK_61cecfd27c2d41eb58330df1d8c" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriber" ADD CONSTRAINT "FK_35ad85d2f341ebfeaca7ad67af1" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" ADD CONSTRAINT "FK_3cc297d538f01065f9925cfb11a" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" ADD CONSTRAINT "FK_fd952f76f5a5297ce69a9a588eb" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" ADD CONSTRAINT "FK_4ab0af827040dbce6ef21ec7780" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" ADD CONSTRAINT "FK_a9e764a6ad587e6e386abe3b9de" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" ADD CONSTRAINT "FK_945ca87238e7465782215c25d8d" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermission" ADD CONSTRAINT "FK_78293e9cc1746e5f29ccccfdfc0" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermission" ADD CONSTRAINT "FK_5064c0bdc8ff238952f9a2acf43" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermission" ADD CONSTRAINT "FK_e2c33d5f98cb42f8c1f76a85095" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermission" ADD CONSTRAINT "FK_73a2d0db1de4e66582e376098de" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryService" ADD CONSTRAINT "FK_3a3321fd538aa014aa5e4f35220" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryService" ADD CONSTRAINT "FK_5d0b92dc9ab2bfd71432e9a3536" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryService" ADD CONSTRAINT "FK_46ea9e637b4454993665a436d56" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryUsageBilling" ADD CONSTRAINT "FK_5670be95a9496b9380b7c0d7935" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryUsageBilling" ADD CONSTRAINT "FK_91333210492e5d2f334231468a7" FOREIGN KEY ("telemetryServiceId") REFERENCES "TelemetryService"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryUsageBilling" ADD CONSTRAINT "FK_d71562eb0c2861797502bd99917" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryUsageBilling" ADD CONSTRAINT "FK_510252373d4e5917029308384fb" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCall" ADD CONSTRAINT "FK_db4e522c086be556e5101c4e910" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCall" ADD CONSTRAINT "FK_4d90bd0e309ad43c4541bb428e9" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCall" ADD CONSTRAINT "FK_1b46d8793ef542c059369481d42" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCall" ADD CONSTRAINT "FK_996ab46825df7f3512e735c450c" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserEmail" ADD CONSTRAINT "FK_e6beed22b36201aea1d70ba0d72" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserEmail" ADD CONSTRAINT "FK_1f713c701d85c69f706e4e82b85" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserEmail" ADD CONSTRAINT "FK_06413c119aae9c3f75154c2346c" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserEmail" ADD CONSTRAINT "FK_a1aa5e10dcfb571521324bbd665" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserSMS" ADD CONSTRAINT "FK_6439689a29a2192708e3f3603da" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserSMS" ADD CONSTRAINT "FK_3cb16b5c2d69dbdc812247788f8" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserSMS" ADD CONSTRAINT "FK_99fc3cdf366fd3d266fbf2d657c" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserSMS" ADD CONSTRAINT "FK_0bae98162ec44540ff85f724daa" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" ADD CONSTRAINT "FK_69d439e9f60f05ae16732c49999" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" ADD CONSTRAINT "FK_32efb91af1b432a25ceb55bc0dc" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" ADD CONSTRAINT "FK_85b73b64802058915df58fa013b" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" ADD CONSTRAINT "FK_b1292f2480d0c4985898d7bf33a" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" ADD CONSTRAINT "FK_ec8e7a39fcd38d0ea2d40b8afaf" FOREIGN KEY ("userCallId") REFERENCES "UserCall"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" ADD CONSTRAINT "FK_32ca4397660dafe0cab7d03e5b1" FOREIGN KEY ("userSmsId") REFERENCES "UserSMS"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" ADD CONSTRAINT "FK_b407063ee43233b0cc8e9106cbb" FOREIGN KEY ("userEmailId") REFERENCES "UserEmail"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" ADD CONSTRAINT "FK_bf703b216d7f59424302dc5d70b" FOREIGN KEY ("incidentSeverityId") REFERENCES "IncidentSeverity"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationSetting" ADD CONSTRAINT "FK_6f110fc752889f922d6a3c57a55" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationSetting" ADD CONSTRAINT "FK_e2565b0aa7d7e015fb6685afede" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationSetting" ADD CONSTRAINT "FK_aee7abeffd1c60d49f710fb3749" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationSetting" ADD CONSTRAINT "FK_b023f12dc00bcfc50d6d9ad4f71" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_7941aa92c7c740400b272d69072" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_3a4b15ce8357c6735ac1b4ae606" FOREIGN KEY ("userBelongsToTeamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_ea993eab5c402623b61203e3256" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_4cd37d481ef366d975c6a7cd9bf" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_f047dd6a708175bae0ee6f8c4bf" FOREIGN KEY ("onCallDutyPolicyExecutionLogId") REFERENCES "OnCallDutyPolicyExecutionLog"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_550f9f6177451d4902467991a15" FOREIGN KEY ("onCallDutyPolicyEscalationRuleId") REFERENCES "OnCallDutyPolicyEscalationRule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_eeb0dd05d1dec542c3de5fb5074" FOREIGN KEY ("triggeredByIncidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_7498ad42c4f77f7fab2a6bc2e33" FOREIGN KEY ("onCallDutyPolicyExecutionLogTimelineId") REFERENCES "OnCallDutyPolicyExecutionLogTimeline"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_91488d7d3341bf1113902f4786c" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_ac31bad932e24418ce0bb1bbb14" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_b70804c755c008c15794b6cc18d" FOREIGN KEY ("acknowledgedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" ADD CONSTRAINT "FK_123b1825525b963fe9555d62641" FOREIGN KEY ("onCallDutyScheduleId") REFERENCES "OnCallDutyPolicySchedule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_2a893e347fdab643867abd8dda7" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_79580470f34858375cae5d353a9" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_dc79ea74fba7b99835bd475081c" FOREIGN KEY ("userNotificationLogId") REFERENCES "UserOnCallLog"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_06a427cdcbae1ddcb1301b860f2" FOREIGN KEY ("userNotificationRuleId") REFERENCES "UserNotificationRule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_ef993920a9967b61fb3fb9bf162" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_58a44736718a5ec4fe41526289a" FOREIGN KEY ("triggeredByIncidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_6491952f9d8066aa5cfff92cd85" FOREIGN KEY ("onCallDutyPolicyExecutionLogId") REFERENCES "OnCallDutyPolicyExecutionLog"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_26e16ed3e46c6a6589a88d3abba" FOREIGN KEY ("onCallDutyPolicyExecutionLogTimelineId") REFERENCES "OnCallDutyPolicyExecutionLogTimeline"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_222212e7157f8816357a4f02536" FOREIGN KEY ("onCallDutyPolicyEscalationRuleId") REFERENCES "OnCallDutyPolicyEscalationRule"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_6650020ce6e235164a09d1ca019" FOREIGN KEY ("userBelongsToTeamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_03d67a4d7fa9f087327ab0f74a7" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_a93a41d65df4cbe518393695084" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_d5c3df01bbb2a9ce168b36b5234" FOREIGN KEY ("userCallId") REFERENCES "UserCall"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_12ef8407b6359205df8339f8494" FOREIGN KEY ("userSmsId") REFERENCES "UserSMS"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" ADD CONSTRAINT "FK_815c728d905c44bc440ec91308b" FOREIGN KEY ("userEmailId") REFERENCES "UserEmail"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Workflow" ADD CONSTRAINT "FK_a87518833c744b2df4324b61a6d" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Workflow" ADD CONSTRAINT "FK_13c42a014f8c10862f23d02eb49" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Workflow" ADD CONSTRAINT "FK_367e2e759f520b31d727d22b803" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLog" ADD CONSTRAINT "FK_6c3dc31b09a96d81982a472e22b" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLog" ADD CONSTRAINT "FK_55293b16d84f048f44c771595bb" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLog" ADD CONSTRAINT "FK_a4e2e2861f3ece2b7d6d5e399e2" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowVariable" ADD CONSTRAINT "FK_bb47f6d0cabd55fde5b199ae206" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowVariable" ADD CONSTRAINT "FK_c093a47a2ecfa1d5f2d4aeb04a0" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowVariable" ADD CONSTRAINT "FK_92fbc4d230accb3d12c098ca4d2" FOREIGN KEY ("createdByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowVariable" ADD CONSTRAINT "FK_3e414e10cb4927e233ffd32651c" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermissionLabel" ADD CONSTRAINT "FK_0946f6b41113cd842ee69f69fb1" FOREIGN KEY ("apiKeyPermissionId") REFERENCES "ApiKeyPermission"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermissionLabel" ADD CONSTRAINT "FK_4db7f66405df73287c639ece904" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorLabel" ADD CONSTRAINT "FK_3af64cebb5a7cc7f1ad0aa70c11" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorLabel" ADD CONSTRAINT "FK_1866fb21ea1acd3d5c37e28ca1b" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyLabel" ADD CONSTRAINT "FK_d4a3f7dc4e33b896b0984e73164" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyLabel" ADD CONSTRAINT "FK_1c0248fe6856bbe029fc492ec71" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentMonitor" ADD CONSTRAINT "FK_55e3162c1259b1b092f0ac63eeb" FOREIGN KEY ("incidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentMonitor" ADD CONSTRAINT "FK_9e2000a938f2e12c6653e68780c" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOnCallDutyPolicy" ADD CONSTRAINT "FK_2d127b6da0e4fab9f905b4d332d" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOnCallDutyPolicy" ADD CONSTRAINT "FK_f89b23e3cafd1c6a0bfd42c297d" FOREIGN KEY ("monitorId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentLabel" ADD CONSTRAINT "FK_1084d1ddbabbcfcab7cd9d547a4" FOREIGN KEY ("incidentId") REFERENCES "Incident"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentLabel" ADD CONSTRAINT "FK_17f4085273d14d4d6145cf65855" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateMonitor" ADD CONSTRAINT "FK_390a45e855282ae55ad56d1e1fc" FOREIGN KEY ("incidentTemplateId") REFERENCES "IncidentTemplate"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateMonitor" ADD CONSTRAINT "FK_33fb90ba0116b7db4efd4ec7a45" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOnCallDutyPolicy" ADD CONSTRAINT "FK_99245f38769689fe8a172dcb81a" FOREIGN KEY ("incidentTemplateId") REFERENCES "IncidentTemplate"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOnCallDutyPolicy" ADD CONSTRAINT "FK_2b76b57ea6659f97a4bcd1156c1" FOREIGN KEY ("onCallDutyPolicyId") REFERENCES "OnCallDutyPolicy"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateLabel" ADD CONSTRAINT "FK_d527ebc73a91eefcae4beaaf822" FOREIGN KEY ("incidentTemplateId") REFERENCES "IncidentTemplate"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateLabel" ADD CONSTRAINT "FK_fcf64673a74380a67159376b85f" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupLabel" ADD CONSTRAINT "FK_2fed2a41449af9a9cf821b759de" FOREIGN KEY ("monitorGroupId") REFERENCES "MonitorGroup"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupLabel" ADD CONSTRAINT "FK_a91be5ccf47cbd470c3f9ee5606" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecretMonitor" ADD CONSTRAINT "FK_fed65a7701822d21a66810bfe29" FOREIGN KEY ("monitorSecretId") REFERENCES "MonitorSecret"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecretMonitor" ADD CONSTRAINT "FK_8ad10d0cd8fd68ac64ae3967dc9" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLabel" ADD CONSTRAINT "FK_facb426dc0647d760bba573c2dd" FOREIGN KEY ("onCallDutyPolicyScheduleId") REFERENCES "OnCallDutyPolicySchedule"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLabel" ADD CONSTRAINT "FK_c27ee1fc2df7788145ed9e3333c" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSsoTeam" ADD CONSTRAINT "FK_43c6fb265bd3b69e26f1d98b66c" FOREIGN KEY ("projectSsoId") REFERENCES "ProjectSSO"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSsoTeam" ADD CONSTRAINT "FK_d6d43b15c7dca2734a768379f8c" FOREIGN KEY ("teamId") REFERENCES "Team"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageLabel" ADD CONSTRAINT "FK_d409a46e63e25fbd4fcc9d5242f" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageLabel" ADD CONSTRAINT "FK_6842f6301436d26a31154062793" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDownMonitorStatus" ADD CONSTRAINT "FK_5d5aa67b52755d47e81bb19febf" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDownMonitorStatus" ADD CONSTRAINT "FK_e9f66cc920a6dfd8b20be8497cf" FOREIGN KEY ("monitorStatusId") REFERENCES "MonitorStatus"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceMonitor" ADD CONSTRAINT "FK_9f74e5e95ad88301cbc6e97da6d" FOREIGN KEY ("scheduledMaintenanceId") REFERENCES "ScheduledMaintenance"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceMonitor" ADD CONSTRAINT "FK_d1a5797fdd98c1fa2f99670aab8" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStatusPage" ADD CONSTRAINT "FK_fcab6c2c59de7fa9e1a4ed52d37" FOREIGN KEY ("scheduledMaintenanceId") REFERENCES "ScheduledMaintenance"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStatusPage" ADD CONSTRAINT "FK_266f1f927ed89d829a2349d2e20" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceLabel" ADD CONSTRAINT "FK_c88790ffdbb71aa66a5795be229" FOREIGN KEY ("scheduledMaintenanceId") REFERENCES "ScheduledMaintenance"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceLabel" ADD CONSTRAINT "FK_4f3c993200714127eb2d0851cc4" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnnouncementStatusPage" ADD CONSTRAINT "FK_f10f946bb8a5da2ef3955578053" FOREIGN KEY ("announcementId") REFERENCES "StatusPageAnnouncement"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnnouncementStatusPage" ADD CONSTRAINT "FK_d7895bb35944a68cccf8286521d" FOREIGN KEY ("statusPageId") REFERENCES "StatusPage"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriberStatusPageResource" ADD CONSTRAINT "FK_618293911d2e52dc3c6a6873b4c" FOREIGN KEY ("statusPageSubscriberId") REFERENCES "StatusPageSubscriber"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriberStatusPageResource" ADD CONSTRAINT "FK_f4af9c94a4b3ba11b4739a25ef4" FOREIGN KEY ("statusPageResourceId") REFERENCES "StatusPageResource"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermissionLabel" ADD CONSTRAINT "FK_7281dda2d397d6d75c2f5285bb8" FOREIGN KEY ("teamPermissionId") REFERENCES "TeamPermission"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermissionLabel" ADD CONSTRAINT "FK_4523aa1dd9163aaf37698d137e1" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ServiceLabel" ADD CONSTRAINT "FK_94d495f938d819dab20480c5f80" FOREIGN KEY ("telemetryServiceId") REFERENCES "TelemetryService"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ServiceLabel" ADD CONSTRAINT "FK_7711266422ebad1188c4879d669" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLabel" ADD CONSTRAINT "FK_3747a5f42be5c977e574abcd713" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLabel" ADD CONSTRAINT "FK_4e72fad380eca9abfa3b9895546" FOREIGN KEY ("labelId") REFERENCES "Label"("_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  @CaptureSpan()
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "WorkflowLabel" DROP CONSTRAINT "FK_4e72fad380eca9abfa3b9895546"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLabel" DROP CONSTRAINT "FK_3747a5f42be5c977e574abcd713"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ServiceLabel" DROP CONSTRAINT "FK_7711266422ebad1188c4879d669"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ServiceLabel" DROP CONSTRAINT "FK_94d495f938d819dab20480c5f80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermissionLabel" DROP CONSTRAINT "FK_4523aa1dd9163aaf37698d137e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermissionLabel" DROP CONSTRAINT "FK_7281dda2d397d6d75c2f5285bb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriberStatusPageResource" DROP CONSTRAINT "FK_f4af9c94a4b3ba11b4739a25ef4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriberStatusPageResource" DROP CONSTRAINT "FK_618293911d2e52dc3c6a6873b4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnnouncementStatusPage" DROP CONSTRAINT "FK_d7895bb35944a68cccf8286521d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AnnouncementStatusPage" DROP CONSTRAINT "FK_f10f946bb8a5da2ef3955578053"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceLabel" DROP CONSTRAINT "FK_4f3c993200714127eb2d0851cc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceLabel" DROP CONSTRAINT "FK_c88790ffdbb71aa66a5795be229"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStatusPage" DROP CONSTRAINT "FK_266f1f927ed89d829a2349d2e20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStatusPage" DROP CONSTRAINT "FK_fcab6c2c59de7fa9e1a4ed52d37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceMonitor" DROP CONSTRAINT "FK_d1a5797fdd98c1fa2f99670aab8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceMonitor" DROP CONSTRAINT "FK_9f74e5e95ad88301cbc6e97da6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDownMonitorStatus" DROP CONSTRAINT "FK_e9f66cc920a6dfd8b20be8497cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDownMonitorStatus" DROP CONSTRAINT "FK_5d5aa67b52755d47e81bb19febf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageLabel" DROP CONSTRAINT "FK_6842f6301436d26a31154062793"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageLabel" DROP CONSTRAINT "FK_d409a46e63e25fbd4fcc9d5242f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSsoTeam" DROP CONSTRAINT "FK_d6d43b15c7dca2734a768379f8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSsoTeam" DROP CONSTRAINT "FK_43c6fb265bd3b69e26f1d98b66c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLabel" DROP CONSTRAINT "FK_c27ee1fc2df7788145ed9e3333c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLabel" DROP CONSTRAINT "FK_facb426dc0647d760bba573c2dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecretMonitor" DROP CONSTRAINT "FK_8ad10d0cd8fd68ac64ae3967dc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecretMonitor" DROP CONSTRAINT "FK_fed65a7701822d21a66810bfe29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupLabel" DROP CONSTRAINT "FK_a91be5ccf47cbd470c3f9ee5606"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupLabel" DROP CONSTRAINT "FK_2fed2a41449af9a9cf821b759de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateLabel" DROP CONSTRAINT "FK_fcf64673a74380a67159376b85f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateLabel" DROP CONSTRAINT "FK_d527ebc73a91eefcae4beaaf822"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOnCallDutyPolicy" DROP CONSTRAINT "FK_2b76b57ea6659f97a4bcd1156c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOnCallDutyPolicy" DROP CONSTRAINT "FK_99245f38769689fe8a172dcb81a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateMonitor" DROP CONSTRAINT "FK_33fb90ba0116b7db4efd4ec7a45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateMonitor" DROP CONSTRAINT "FK_390a45e855282ae55ad56d1e1fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentLabel" DROP CONSTRAINT "FK_17f4085273d14d4d6145cf65855"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentLabel" DROP CONSTRAINT "FK_1084d1ddbabbcfcab7cd9d547a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOnCallDutyPolicy" DROP CONSTRAINT "FK_f89b23e3cafd1c6a0bfd42c297d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOnCallDutyPolicy" DROP CONSTRAINT "FK_2d127b6da0e4fab9f905b4d332d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentMonitor" DROP CONSTRAINT "FK_9e2000a938f2e12c6653e68780c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentMonitor" DROP CONSTRAINT "FK_55e3162c1259b1b092f0ac63eeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyLabel" DROP CONSTRAINT "FK_1c0248fe6856bbe029fc492ec71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyLabel" DROP CONSTRAINT "FK_d4a3f7dc4e33b896b0984e73164"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorLabel" DROP CONSTRAINT "FK_1866fb21ea1acd3d5c37e28ca1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorLabel" DROP CONSTRAINT "FK_3af64cebb5a7cc7f1ad0aa70c11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermissionLabel" DROP CONSTRAINT "FK_4db7f66405df73287c639ece904"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermissionLabel" DROP CONSTRAINT "FK_0946f6b41113cd842ee69f69fb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowVariable" DROP CONSTRAINT "FK_3e414e10cb4927e233ffd32651c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowVariable" DROP CONSTRAINT "FK_92fbc4d230accb3d12c098ca4d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowVariable" DROP CONSTRAINT "FK_c093a47a2ecfa1d5f2d4aeb04a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowVariable" DROP CONSTRAINT "FK_bb47f6d0cabd55fde5b199ae206"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLog" DROP CONSTRAINT "FK_a4e2e2861f3ece2b7d6d5e399e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLog" DROP CONSTRAINT "FK_55293b16d84f048f44c771595bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WorkflowLog" DROP CONSTRAINT "FK_6c3dc31b09a96d81982a472e22b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Workflow" DROP CONSTRAINT "FK_367e2e759f520b31d727d22b803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Workflow" DROP CONSTRAINT "FK_13c42a014f8c10862f23d02eb49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Workflow" DROP CONSTRAINT "FK_a87518833c744b2df4324b61a6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_815c728d905c44bc440ec91308b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_12ef8407b6359205df8339f8494"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_d5c3df01bbb2a9ce168b36b5234"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_a93a41d65df4cbe518393695084"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_03d67a4d7fa9f087327ab0f74a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_6650020ce6e235164a09d1ca019"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_222212e7157f8816357a4f02536"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_26e16ed3e46c6a6589a88d3abba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_6491952f9d8066aa5cfff92cd85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_58a44736718a5ec4fe41526289a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_ef993920a9967b61fb3fb9bf162"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_06a427cdcbae1ddcb1301b860f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_dc79ea74fba7b99835bd475081c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_79580470f34858375cae5d353a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLogTimeline" DROP CONSTRAINT "FK_2a893e347fdab643867abd8dda7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_123b1825525b963fe9555d62641"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_b70804c755c008c15794b6cc18d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_ac31bad932e24418ce0bb1bbb14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_91488d7d3341bf1113902f4786c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_7498ad42c4f77f7fab2a6bc2e33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_eeb0dd05d1dec542c3de5fb5074"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_550f9f6177451d4902467991a15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_f047dd6a708175bae0ee6f8c4bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_4cd37d481ef366d975c6a7cd9bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_ea993eab5c402623b61203e3256"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_3a4b15ce8357c6735ac1b4ae606"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOnCallLog" DROP CONSTRAINT "FK_7941aa92c7c740400b272d69072"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationSetting" DROP CONSTRAINT "FK_b023f12dc00bcfc50d6d9ad4f71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationSetting" DROP CONSTRAINT "FK_aee7abeffd1c60d49f710fb3749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationSetting" DROP CONSTRAINT "FK_e2565b0aa7d7e015fb6685afede"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationSetting" DROP CONSTRAINT "FK_6f110fc752889f922d6a3c57a55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" DROP CONSTRAINT "FK_bf703b216d7f59424302dc5d70b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" DROP CONSTRAINT "FK_b407063ee43233b0cc8e9106cbb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" DROP CONSTRAINT "FK_32ca4397660dafe0cab7d03e5b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" DROP CONSTRAINT "FK_ec8e7a39fcd38d0ea2d40b8afaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" DROP CONSTRAINT "FK_b1292f2480d0c4985898d7bf33a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" DROP CONSTRAINT "FK_85b73b64802058915df58fa013b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" DROP CONSTRAINT "FK_32efb91af1b432a25ceb55bc0dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserNotificationRule" DROP CONSTRAINT "FK_69d439e9f60f05ae16732c49999"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserSMS" DROP CONSTRAINT "FK_0bae98162ec44540ff85f724daa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserSMS" DROP CONSTRAINT "FK_99fc3cdf366fd3d266fbf2d657c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserSMS" DROP CONSTRAINT "FK_3cb16b5c2d69dbdc812247788f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserSMS" DROP CONSTRAINT "FK_6439689a29a2192708e3f3603da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserEmail" DROP CONSTRAINT "FK_a1aa5e10dcfb571521324bbd665"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserEmail" DROP CONSTRAINT "FK_06413c119aae9c3f75154c2346c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserEmail" DROP CONSTRAINT "FK_1f713c701d85c69f706e4e82b85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserEmail" DROP CONSTRAINT "FK_e6beed22b36201aea1d70ba0d72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCall" DROP CONSTRAINT "FK_996ab46825df7f3512e735c450c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCall" DROP CONSTRAINT "FK_1b46d8793ef542c059369481d42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCall" DROP CONSTRAINT "FK_4d90bd0e309ad43c4541bb428e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCall" DROP CONSTRAINT "FK_db4e522c086be556e5101c4e910"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryUsageBilling" DROP CONSTRAINT "FK_510252373d4e5917029308384fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryUsageBilling" DROP CONSTRAINT "FK_d71562eb0c2861797502bd99917"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryUsageBilling" DROP CONSTRAINT "FK_91333210492e5d2f334231468a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryUsageBilling" DROP CONSTRAINT "FK_5670be95a9496b9380b7c0d7935"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryService" DROP CONSTRAINT "FK_46ea9e637b4454993665a436d56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryService" DROP CONSTRAINT "FK_5d0b92dc9ab2bfd71432e9a3536"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TelemetryService" DROP CONSTRAINT "FK_3a3321fd538aa014aa5e4f35220"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermission" DROP CONSTRAINT "FK_73a2d0db1de4e66582e376098de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermission" DROP CONSTRAINT "FK_e2c33d5f98cb42f8c1f76a85095"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermission" DROP CONSTRAINT "FK_5064c0bdc8ff238952f9a2acf43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamPermission" DROP CONSTRAINT "FK_78293e9cc1746e5f29ccccfdfc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" DROP CONSTRAINT "FK_945ca87238e7465782215c25d8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" DROP CONSTRAINT "FK_a9e764a6ad587e6e386abe3b9de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" DROP CONSTRAINT "FK_4ab0af827040dbce6ef21ec7780"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" DROP CONSTRAINT "FK_fd952f76f5a5297ce69a9a588eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TeamMember" DROP CONSTRAINT "FK_3cc297d538f01065f9925cfb11a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriber" DROP CONSTRAINT "FK_35ad85d2f341ebfeaca7ad67af1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriber" DROP CONSTRAINT "FK_61cecfd27c2d41eb58330df1d8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriber" DROP CONSTRAINT "FK_217b295d5882faa6cf3418ed811"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSubscriber" DROP CONSTRAINT "FK_6adf943966e01699e86117d2e34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSSO" DROP CONSTRAINT "FK_0bfc26bce8ea92b8b8a9e0400de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSSO" DROP CONSTRAINT "FK_8e2cbcf07eba956fe976ca3d043"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSSO" DROP CONSTRAINT "FK_dc05de7939af3ada1567fc7106b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageSSO" DROP CONSTRAINT "FK_1d63fa142dd4175ef256f21d2a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" DROP CONSTRAINT "FK_d2b2f7ffe8f976fda20f4b96c5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" DROP CONSTRAINT "FK_51e0fbc6d460394b1cd38959790"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" DROP CONSTRAINT "FK_9b61276c47d6091295dec9e5350"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" DROP CONSTRAINT "FK_a55bb812676bff276cef1f14c86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" DROP CONSTRAINT "FK_b1c4fe08e1d90ae4d26d934653c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" DROP CONSTRAINT "FK_ade3f7acf902dcb313d230ca1f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageResource" DROP CONSTRAINT "FK_8fba35fb87a0ad6037eb8fc8040"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPagePrivateUser" DROP CONSTRAINT "FK_524d2e71f90ef8f78d85d5fdfd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPagePrivateUser" DROP CONSTRAINT "FK_e47c85ead36095d040493775a3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPagePrivateUser" DROP CONSTRAINT "FK_0589c51161d13b752fed41a3193"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPagePrivateUser" DROP CONSTRAINT "FK_1ce45fe77324ede75166d0f57dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" DROP CONSTRAINT "FK_8d7351e844adfd5c279fd8e9f3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" DROP CONSTRAINT "FK_4ecb38fa1941bb0961641803f21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" DROP CONSTRAINT "FK_69b1659abafe656563259784d02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" DROP CONSTRAINT "FK_3c59f811e0660c5522e45e85b6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerUser" DROP CONSTRAINT "FK_c28e05c08656f8aa756734c37c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" DROP CONSTRAINT "FK_e992fcc346afa21a89ba9f75f25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" DROP CONSTRAINT "FK_7c1168daf53c46678045ff39d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" DROP CONSTRAINT "FK_6a98e42d8df3ba84bd0f79da550"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" DROP CONSTRAINT "FK_f60296efefe379693bfd55a7760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageOwnerTeam" DROP CONSTRAINT "FK_9fac66064d88c514d2e5503237a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHistoryChartBarColorRule" DROP CONSTRAINT "FK_8041d41239c4218bf136bf20591"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHistoryChartBarColorRule" DROP CONSTRAINT "FK_5d973aa991ba9f06b642d3fc9d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHistoryChartBarColorRule" DROP CONSTRAINT "FK_54edc7ff7a74a0310a512c53895"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHistoryChartBarColorRule" DROP CONSTRAINT "FK_a65f8fabf888d227d64570f52b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHeaderLink" DROP CONSTRAINT "FK_0d3a63f1c684e78297b213c348e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHeaderLink" DROP CONSTRAINT "FK_88048566089097605e26fdb2893"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHeaderLink" DROP CONSTRAINT "FK_99c017b6ced8da63abdfbb506eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageHeaderLink" DROP CONSTRAINT "FK_70d70692cbe9d9be188723df4f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageGroup" DROP CONSTRAINT "FK_61191c9c00f7279615e13af4bbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageGroup" DROP CONSTRAINT "FK_0a63a8ee804658921edf1e870af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageGroup" DROP CONSTRAINT "FK_5dbcfd7d38e5ea7a78a6a78a330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageGroup" DROP CONSTRAINT "FK_4a96c34f030a6e39218352a947a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageFooterLink" DROP CONSTRAINT "FK_0328201140b59b4b813f83b06a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageFooterLink" DROP CONSTRAINT "FK_bd6f15ab951095e624ea664d9a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageFooterLink" DROP CONSTRAINT "FK_1a80c698b2205074f53376d631b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageFooterLink" DROP CONSTRAINT "FK_5f8f65447c9b881860bf742dc98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" DROP CONSTRAINT "FK_6c82107f63d1a3186d579a6d9cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" DROP CONSTRAINT "FK_106e359f945432d6583bd30ff4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" DROP CONSTRAINT "FK_842a66fcb103388fcedffef75f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" DROP CONSTRAINT "FK_7fab5bc54a8f36eac8f31c82565"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageDomain" DROP CONSTRAINT "FK_40cca185c8cf933c04a0534676b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageCustomField" DROP CONSTRAINT "FK_26b4a892f3b31c5b0b285c4e5cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageCustomField" DROP CONSTRAINT "FK_e0abd7540f860de19607dc25bc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageCustomField" DROP CONSTRAINT "FK_4f5ae90bc48a0ddeb50cd009aaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageAnnouncement" DROP CONSTRAINT "FK_7251cbbaa75eb9570830b0cab32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageAnnouncement" DROP CONSTRAINT "FK_1491bd0895d515969eee2a08c80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPageAnnouncement" DROP CONSTRAINT "FK_5e9c5a7393ac9aa477d625de673"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SmsLog" DROP CONSTRAINT "FK_d00778bcfaa735fbb5dc91c1945"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SmsLog" DROP CONSTRAINT "FK_a30bbda7f5480e498ebc609663b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ShortLink" DROP CONSTRAINT "FK_11f179cd8e9beee22b89c316972"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" DROP CONSTRAINT "FK_7c0f750d3a964180d1e1efa16ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" DROP CONSTRAINT "FK_aa84fcdf2fef6c2005ebab2c197"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" DROP CONSTRAINT "FK_2392299477cfc4f612ecb73e839"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" DROP CONSTRAINT "FK_411146017bcfe98bbe028b8d15a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceStateTimeline" DROP CONSTRAINT "FK_4faf556988f5b6a755ef2e85ae8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenancePublicNote" DROP CONSTRAINT "FK_28e179283c409e0751aae713949"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenancePublicNote" DROP CONSTRAINT "FK_1f67cfb63bd3488b7c5c5b7fac7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenancePublicNote" DROP CONSTRAINT "FK_937aabd4adbfce78663406a2487"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenancePublicNote" DROP CONSTRAINT "FK_73c6737ab4a7718c45932bffada"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" DROP CONSTRAINT "FK_6e6b087ba99fe433f83f87e0a35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" DROP CONSTRAINT "FK_c91d4d420e3faaf15fa928fd214"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" DROP CONSTRAINT "FK_967c33f7bce5de522c1d1a80e7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" DROP CONSTRAINT "FK_be6a25806925f93b8949e61929b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerUser" DROP CONSTRAINT "FK_518742c7037d9a38a6594dc18a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" DROP CONSTRAINT "FK_52a3a932530026bafef87e62177"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" DROP CONSTRAINT "FK_cc0e8ca9e9065ca0cc24bf6275b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" DROP CONSTRAINT "FK_1251fb7d4a4bf8586f2bd1528eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" DROP CONSTRAINT "FK_1206beb611e0779ce2248ecbaeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceOwnerTeam" DROP CONSTRAINT "FK_e3053b1725658b4a120b4e3185d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceNoteTemplate" DROP CONSTRAINT "FK_4c3d6b87bb1e8739cdeb8b92f74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceNoteTemplate" DROP CONSTRAINT "FK_e38c1102001ae0b70c22e046424"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceNoteTemplate" DROP CONSTRAINT "FK_b4cb4c1312eb72459907e1bbe9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceInternalNote" DROP CONSTRAINT "FK_7fb00788b6ac97988dd43e2e1b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceInternalNote" DROP CONSTRAINT "FK_69757967d2ee696f487fb8ac37e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceInternalNote" DROP CONSTRAINT "FK_a53ef45aebd4a6a6e7dde7f896a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceInternalNote" DROP CONSTRAINT "FK_d79c49a0a613a6b432fd400e69b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceCustomField" DROP CONSTRAINT "FK_9094eed77fb6e8f7ecf1502f5e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceCustomField" DROP CONSTRAINT "FK_c7cdb245d3d98be14482f092eca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceCustomField" DROP CONSTRAINT "FK_3621c488327e1c00518aa4e8816"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" DROP CONSTRAINT "FK_fab9cc7e6ffcf02872fccfab978"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" DROP CONSTRAINT "FK_883038abda021ce79fa838d0273"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" DROP CONSTRAINT "FK_50ddf8bb21e988ea5d419a66cb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" DROP CONSTRAINT "FK_5442fd86c96d45e062d5ee1f093"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenance" DROP CONSTRAINT "FK_4059dd569d6a482062352bf266a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP CONSTRAINT "FK_4e347d3f99b67dacd149beaf61d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP CONSTRAINT "FK_61944d851b4a7213d79ef281744"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP CONSTRAINT "FK_602b456a61d73a96e97f483064d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP CONSTRAINT "FK_84df83d1f492a19a08aee465500"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP CONSTRAINT "FK_1f17f293352ebdc3bcf383158cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP CONSTRAINT "FK_71f429afb7678d132472b3c87b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP CONSTRAINT "FK_da54bb2c4997ee1a3b73026d7f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP CONSTRAINT "FK_34a4c35e0d7afe6f023825a68c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceState" DROP CONSTRAINT "FK_4f803428e0926584d1f7c44a3d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceState" DROP CONSTRAINT "FK_88044fd50006f1897e8c760d136"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ScheduledMaintenanceState" DROP CONSTRAINT "FK_57a31fb2a5e4caa223d2506a4e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" DROP CONSTRAINT "FK_a7b405e2a9ae144be016bcf973d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" DROP CONSTRAINT "FK_7aecf4b1ae3e45647cb911f4c10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" DROP CONSTRAINT "FK_6dcdf97c0834dd44b4f2c93e664"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" DROP CONSTRAINT "FK_3169f7934171e8f697bb993b010"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PromoCode" DROP CONSTRAINT "FK_90e44f45272c0da256951183086"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSSO" DROP CONSTRAINT "FK_00ea9e456217ffbfff35f1e944f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSSO" DROP CONSTRAINT "FK_28011315533e2d819295d261ee4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSSO" DROP CONSTRAINT "FK_be9e6751765501ea1db126fcb23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectCallSMSConfig" DROP CONSTRAINT "FK_f5bc0e2b81886b21004e2a5f67b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectCallSMSConfig" DROP CONSTRAINT "FK_e873aa20a371bd92e220332a992"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectCallSMSConfig" DROP CONSTRAINT "FK_20334b9571a6cd1a871e70d8e76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" DROP CONSTRAINT "FK_416e830c88f2ecfa149f4cd51c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" DROP CONSTRAINT "FK_49e5a41e1d771fe9e385295bd9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" DROP CONSTRAINT "FK_b2ccbfcc3964caf3dfd89243f8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" DROP CONSTRAINT "FK_41f4ecc29351e1a406e83b30a93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" DROP CONSTRAINT "FK_9b36bba6d9898331920805a29ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayerUser" DROP CONSTRAINT "FK_08afccd6cbbd1a7015d4fe25e39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayer" DROP CONSTRAINT "FK_f22b52355207d2c0d5a13c168e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayer" DROP CONSTRAINT "FK_1db1083a896b0f77a0e87f26463"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayer" DROP CONSTRAINT "FK_6fa6574a45cf1352c5a3b962512"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyScheduleLayer" DROP CONSTRAINT "FK_3b892ef36671f1ea1c8457a96d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_166f3696b3c70989507dd7e1f2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_43f833a79cf4201b3fa1deed023"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_65998388ab4266dda712502ad65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_039098d4af133bd9c2b90978ef4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_0ae6ea2e2d38fd31543768e3609"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_0ad4222a4c48b8a64e3a58b3519"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_872c2f6a9739bab1b57b6d51eac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_90119ec7f77fa2efd82261e0448"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_c5a798ca667fedda71d4ed54651"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLogTimeline" DROP CONSTRAINT "FK_591b7ed73c964e105bfecc6fd6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" DROP CONSTRAINT "FK_d4a0ffc5e9e698bb2612ba0e55f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" DROP CONSTRAINT "FK_3015ddfeb130417c55489da807e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" DROP CONSTRAINT "FK_63f6618df216b74b72e62491b09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" DROP CONSTRAINT "FK_e9302e15399b67938e0121a0545"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" DROP CONSTRAINT "FK_16b426d34ff2c5cbd6ecfd70820"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" DROP CONSTRAINT "FK_a230899d6c2b16621954c46fb16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" DROP CONSTRAINT "FK_e4bb332263960531a4c9e2d4254"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyExecutionLog" DROP CONSTRAINT "FK_00e9676d39eeb807de704430512"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" DROP CONSTRAINT "FK_d35f668f524cc88f580a7651fe2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" DROP CONSTRAINT "FK_f9a45cea88022a9cf5b96c13e65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" DROP CONSTRAINT "FK_5a7b7a746409a175423a1bbd5c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" DROP CONSTRAINT "FK_bff6f4ae726b5c5cbae10e7d743"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" DROP CONSTRAINT "FK_9ca3fbb66842324aa987d4c9722"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleUser" DROP CONSTRAINT "FK_b15552e664640f67346193598a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" DROP CONSTRAINT "FK_73ae2b2702aef4601c39d4d909a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" DROP CONSTRAINT "FK_da2e065de293a14b69964fb3233"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" DROP CONSTRAINT "FK_0e7d4060e2fabe0957b9fedb429"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" DROP CONSTRAINT "FK_26ba1a6edd877647cedd1eae8ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" DROP CONSTRAINT "FK_f5121f361345d858ce740a55a25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleTeam" DROP CONSTRAINT "FK_c8aff8439fbfb07e7388aa9011b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" DROP CONSTRAINT "FK_878e14be4e6366ec646f874347a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" DROP CONSTRAINT "FK_90700af75cbe8129db898ac8adb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" DROP CONSTRAINT "FK_089081f83ef22cdba5a0903ce59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" DROP CONSTRAINT "FK_13a87c38fe2efa41940783af690"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" DROP CONSTRAINT "FK_651a4ab9e3cbb20f6b62a87a6b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRuleSchedule" DROP CONSTRAINT "FK_efa24aa8feb92d4e15a707c20ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicySchedule" DROP CONSTRAINT "FK_01e63400072d0bc6debee836cbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicySchedule" DROP CONSTRAINT "FK_ecb5141b27e85674c294a2541b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicySchedule" DROP CONSTRAINT "FK_0e1b7c3c3e8305a10716cdb8d6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRule" DROP CONSTRAINT "FK_5c0911d261a941b00d41b6e5fda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRule" DROP CONSTRAINT "FK_ad8097a9359965d02ccbb16358b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRule" DROP CONSTRAINT "FK_b90c1cda36981c41e3965a93800"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyEscalationRule" DROP CONSTRAINT "FK_d45a545669dc46da25cc60d1df5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyCustomField" DROP CONSTRAINT "FK_43230e739b31e3f56284407b586"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyCustomField" DROP CONSTRAINT "FK_456bff32fd0428134ef7396385f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicyCustomField" DROP CONSTRAINT "FK_e791474e098f276eda27704b479"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" DROP CONSTRAINT "FK_574feb4161c5216c2c7ee0faaf8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" DROP CONSTRAINT "FK_d293a7e96c5bf427072514f21a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" DROP CONSTRAINT "FK_d7f555ef162fe878e4ed62a3e23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" DROP CONSTRAINT "FK_c08a7c1ef8d511b335a991aac47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatusTimeline" DROP CONSTRAINT "FK_80213eb3f228f1e3d423f5127e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecret" DROP CONSTRAINT "FK_e4262f178662aaacdb54d4c4f4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecret" DROP CONSTRAINT "FK_a886cd3bbdfd84d01167f92cb65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorSecret" DROP CONSTRAINT "FK_7c3629c5ae14e97bede3bc548e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" DROP CONSTRAINT "FK_a182ba062c0a216395d0dbdbdee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" DROP CONSTRAINT "FK_4399ab64a5c00d55e5ce254deeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" DROP CONSTRAINT "FK_a540272f483ef1de68f7e647486"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" DROP CONSTRAINT "FK_2d50a0e0e624369e7f90a62e8dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorProbe" DROP CONSTRAINT "FK_d887935f224b896ce64872c37c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" DROP CONSTRAINT "FK_e1ae2c698e6bde0a98c50162235"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" DROP CONSTRAINT "FK_e2cf60b88171dfe5fdd0e4fe6c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" DROP CONSTRAINT "FK_a65ce9b11b2d7bde123aa7633fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" DROP CONSTRAINT "FK_324f1d50d0427bbd0e3308c4592"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerUser" DROP CONSTRAINT "FK_12a3497e1404fcdbc4e8963a58e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" DROP CONSTRAINT "FK_7ebfe3ddcf597fb73ee8eac2ff4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" DROP CONSTRAINT "FK_58610249ec4cf593e36210dcb84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" DROP CONSTRAINT "FK_1d5265d1f3ca2f8b8e461e4998c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" DROP CONSTRAINT "FK_63e5bbac01d1f68c7b08f126cd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorOwnerTeam" DROP CONSTRAINT "FK_6a6213072d8637e6e625bc78929"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" DROP CONSTRAINT "FK_1a54eaa2d0187d10de84107a09b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" DROP CONSTRAINT "FK_cf595b683e26e560526404663fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" DROP CONSTRAINT "FK_50b373c428cfd4566cc5caf98e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" DROP CONSTRAINT "FK_cf3dcaa746835ae36615a39d862"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupResource" DROP CONSTRAINT "FK_825791d5edb2403d7937f16ed91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" DROP CONSTRAINT "FK_e9bced91dce29928ebeec834905"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" DROP CONSTRAINT "FK_9267db147738caed0ccfdc3af22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" DROP CONSTRAINT "FK_6a4095ee3d04454071816a5bad8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" DROP CONSTRAINT "FK_4b25f4a18bec8cb177e8d65c5f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerUser" DROP CONSTRAINT "FK_d5cfbebf8b07405652f5382e157"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" DROP CONSTRAINT "FK_fdbe93e29e60763a306358cab55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" DROP CONSTRAINT "FK_7ce36c144e83082213587e19c23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" DROP CONSTRAINT "FK_618bcd9015c257b0727df36fd11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" DROP CONSTRAINT "FK_8f19947114087883cea771e1cb4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroupOwnerTeam" DROP CONSTRAINT "FK_0d7052620f268d0fa17f948a851"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroup" DROP CONSTRAINT "FK_edd658b85b2ef7ac9b2f0687d8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroup" DROP CONSTRAINT "FK_abaf236c1877143fe160991cc45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorGroup" DROP CONSTRAINT "FK_13905ff40843b11145f21e33ff5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorCustomField" DROP CONSTRAINT "FK_817e69522c8d2f1e2fd3f857e91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorCustomField" DROP CONSTRAINT "FK_93a4da4182f93ba24ab958c1b73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorCustomField" DROP CONSTRAINT "FK_1c6b61e904d8e3fec1ae719b9ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" DROP CONSTRAINT "FK_026e918a31de467eeb8e30ae8d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" DROP CONSTRAINT "FK_a53f8aab99766a87c73c52b9037"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" DROP CONSTRAINT "FK_876dd05e0dfc64219ef5df241c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" DROP CONSTRAINT "FK_36b9b0204f4b17063483cb7308e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerUser" DROP CONSTRAINT "FK_da9dd65b4401b954a0ea2b5c8d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" DROP CONSTRAINT "FK_af037dc245d77c282061fea1b1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" DROP CONSTRAINT "FK_3e8a4bd1594da3438d8fb8a6687"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" DROP CONSTRAINT "FK_a895b946fccb109dedd55b85f6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" DROP CONSTRAINT "FK_e8090c6569c3a5dbd7ef7485c99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplateOwnerTeam" DROP CONSTRAINT "FK_cf172eb6797a64ee3750e3f3e21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" DROP CONSTRAINT "FK_6d7627ab9d5172c66fc50192163"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" DROP CONSTRAINT "FK_ceff6a4dfdccecc4aa40dbfe91a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" DROP CONSTRAINT "FK_0e6a4e065ffb22f95ecfc259e9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" DROP CONSTRAINT "FK_b03e46665e4c075ed1398fcc409"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentTemplate" DROP CONSTRAINT "FK_b82dafef226b0fae1ad6cb18570"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" DROP CONSTRAINT "FK_ff0fca6570d47798771763533a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" DROP CONSTRAINT "FK_6b6b9dbf9ca5448c9297a58ad04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" DROP CONSTRAINT "FK_16d198b59f3416a8ddc630a90d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" DROP CONSTRAINT "FK_fe2dff414a1f67260e3c5189811"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentStateTimeline" DROP CONSTRAINT "FK_764daa366a4e195768a49e0ee39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentPublicNote" DROP CONSTRAINT "FK_cf04d778a5502be606f63e01603"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentPublicNote" DROP CONSTRAINT "FK_691a99e582fcddcc892d8573afc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentPublicNote" DROP CONSTRAINT "FK_a6964d3aab71608daab9f20e304"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentPublicNote" DROP CONSTRAINT "FK_a9a77e5f286b5724f4e2280d0a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" DROP CONSTRAINT "FK_c473db8745d0ebeb147a72986cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" DROP CONSTRAINT "FK_52591665c92658ef82944d63d26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" DROP CONSTRAINT "FK_6aa9a6b46f8e044d722da8f5a7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" DROP CONSTRAINT "FK_6311087eeb14ab51e6a1e6133f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerUser" DROP CONSTRAINT "FK_0ee7ae6757442fba470b213015c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" DROP CONSTRAINT "FK_60242ecfcecaa5cb1c5241bed4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" DROP CONSTRAINT "FK_278f483fc81c21b1bd1311ee289"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" DROP CONSTRAINT "FK_408324d3635a826538a792422f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" DROP CONSTRAINT "FK_389aadeb39a0806e80d4001016e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentOwnerTeam" DROP CONSTRAINT "FK_95f76375ccac835f815d7e926a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Team" DROP CONSTRAINT "FK_0d4912bf03a7a645ce95142155b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Team" DROP CONSTRAINT "FK_4be4aa023ba1c6d6443b81b3b91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Team" DROP CONSTRAINT "FK_baac847c494f692f03fd686e9c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentNoteTemplate" DROP CONSTRAINT "FK_3c00f2b005264318a274cd38a94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentNoteTemplate" DROP CONSTRAINT "FK_515b6970fdd528d4c9f85a5e9a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentNoteTemplate" DROP CONSTRAINT "FK_21d5bc0d24b3e5032dd391ec8da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentInternalNote" DROP CONSTRAINT "FK_8f23b820cbbed6d96cfedd162a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentInternalNote" DROP CONSTRAINT "FK_c798e09321f06d8a180916d7a5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentInternalNote" DROP CONSTRAINT "FK_b92e75645fd252e4c2f866047de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentInternalNote" DROP CONSTRAINT "FK_ac48058b3e5f9e8361d2b8328c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentCustomField" DROP CONSTRAINT "FK_bc64c76e766b1b880845afbcbf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentCustomField" DROP CONSTRAINT "FK_5c1c7369e696f580186a4ff12de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentCustomField" DROP CONSTRAINT "FK_59e7f6a43dbc5ee54e1a1aaaaf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" DROP CONSTRAINT "FK_7e537806a80e869917ca1d7e2e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" DROP CONSTRAINT "FK_ed0ec4960a85240f51e6779a00a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" DROP CONSTRAINT "FK_3f28fe3b32abed354a49b26c9cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" DROP CONSTRAINT "FK_6592d4f7f3b260efc23fc9b4bc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" DROP CONSTRAINT "FK_067855888a3d71803d3a5aeaecf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" DROP CONSTRAINT "FK_9b101f023b5db6491203d5c9951"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Incident" DROP CONSTRAINT "FK_eccbc31fa1f58bd051b6f7e108b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Probe" DROP CONSTRAINT "FK_272ece82a96099041b93c9141e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Probe" DROP CONSTRAINT "FK_1963e116be9832b23490cca933f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Probe" DROP CONSTRAINT "FK_b357696dc9462ad3f9e84c6dc52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Probe" DROP CONSTRAINT "FK_6bd931aae4920e296ea08864cd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicy" DROP CONSTRAINT "FK_0424b49cfcd68cdd1721df53acd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicy" DROP CONSTRAINT "FK_c0c63ac58f97fd254bb5c2813dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OnCallDutyPolicy" DROP CONSTRAINT "FK_31508550a088ba2cc843a6c90c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" DROP CONSTRAINT "FK_d3461ab640467c8c2100ea55c79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" DROP CONSTRAINT "FK_73bdf22259019b90836aac86b28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" DROP CONSTRAINT "FK_a84bbba0dbad47918136d4dfb43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Monitor" DROP CONSTRAINT "FK_996acfb590bda327843f78b7ad3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatus" DROP CONSTRAINT "FK_55a0e488581a0d02bcdd67a4348"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatus" DROP CONSTRAINT "FK_bdda7fecdf44ed43ef2004e7be5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MonitorStatus" DROP CONSTRAINT "FK_db1783158a23bd20dbebaae56ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentState" DROP CONSTRAINT "FK_88a0ecd4b1714ac0e2eef9ac27d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentState" DROP CONSTRAINT "FK_eb33bd015e0e57ee96b60f8d773"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentState" DROP CONSTRAINT "FK_3d279e530067f599f3186e3821d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentSeverity" DROP CONSTRAINT "FK_d0d87151a7872a44c3d2457bfdc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentSeverity" DROP CONSTRAINT "FK_2677e0a9dbf97ba0f4a7849eac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "IncidentSeverity" DROP CONSTRAINT "FK_00d2f503174bf201abc6e77afde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GreenlockChallenge" DROP CONSTRAINT "FK_7517f5a285255f031b0f6d9663c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GreenlockCertificate" DROP CONSTRAINT "FK_895b9b802ed002a3804136bacf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailVerificationToken" DROP CONSTRAINT "FK_9e86ebfdbef16789e9571f22074"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailVerificationToken" DROP CONSTRAINT "FK_0b65c7ffb685f6ed78aac195b1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailLog" DROP CONSTRAINT "FK_6d0739da601917d316494fcae3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailLog" DROP CONSTRAINT "FK_046364c162885b6ac65d5dd367c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmailLog" DROP CONSTRAINT "FK_7b72c5131b3dd1f3edf201a561c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSMTPConfig" DROP CONSTRAINT "FK_d5458705e98b89c08c0d960422e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSMTPConfig" DROP CONSTRAINT "FK_3b7ed2d3bd1a2ee9638cccef5b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectSMTPConfig" DROP CONSTRAINT "FK_a540dab929fa6582b93f258ffe5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Domain" DROP CONSTRAINT "FK_9ace4c275b42c057b7581543ce3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Domain" DROP CONSTRAINT "FK_12e6ebc5c806263d562045e9282"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Domain" DROP CONSTRAINT "FK_f1ce90d3f9693be29b72fabe93b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DataMigrations" DROP CONSTRAINT "FK_183a8261590c30a27a1b51f4bdb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DataMigrations" DROP CONSTRAINT "FK_1619179d46a4411e1bb4af5d342"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CallLog" DROP CONSTRAINT "FK_3e510124d923fe3b994936a7cb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CallLog" DROP CONSTRAINT "FK_5648767682195afaeb09098a213"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingPaymentMethod" DROP CONSTRAINT "FK_93a1554cb316127896f66acddd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingPaymentMethod" DROP CONSTRAINT "FK_55c3c9a9fc28000262b811cebc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingPaymentMethod" DROP CONSTRAINT "FK_db4bb9add01b7d8286869fd9a0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingInvoice" DROP CONSTRAINT "FK_0a0a1a9865d157e46b1ecf14873"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingInvoice" DROP CONSTRAINT "FK_15b8130f5378f2079ed5b2fe7d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BillingInvoice" DROP CONSTRAINT "FK_0ab13e9a92ce4801c37c2a0a77f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermission" DROP CONSTRAINT "FK_ac42ef4597147c260e89a0f3d3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermission" DROP CONSTRAINT "FK_dc8eb846ffbceafbc9c60bbfaa5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermission" DROP CONSTRAINT "FK_fb09dd7fefa9d5d44b1907be5fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKeyPermission" DROP CONSTRAINT "FK_0cf347c575f15d3836615f53258"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Label" DROP CONSTRAINT "FK_f46caf81c5fd7664ba8da9c99ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Label" DROP CONSTRAINT "FK_84520cbda97d2a9cb9da7ccb18c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Label" DROP CONSTRAINT "FK_f10d59c2ba66e085722e0053cb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKey" DROP CONSTRAINT "FK_bcbc7d80fb0cfe2cbb5ae7db791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKey" DROP CONSTRAINT "FK_891c55549057af9a0c90c925ebb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ApiKey" DROP CONSTRAINT "FK_bb1019f0078a21b4854f5cb3ed4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" DROP CONSTRAINT "FK_b5ee87614c184778810283c2991"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" DROP CONSTRAINT "FK_4ee6a519d48b26fe2a78fdc1c9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" DROP CONSTRAINT "FK_43989dee7f7af742f6d8ec2664a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" DROP CONSTRAINT "FK_639312a8ef82cbd5cee77c5b1ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ResellerPlan" DROP CONSTRAINT "FK_e756416e4b0983e158f71c47c1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ResellerPlan" DROP CONSTRAINT "FK_34cdc5e0500513f321f0da35a64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ResellerPlan" DROP CONSTRAINT "FK_fc269bd109ac405a458b2acc678"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Reseller" DROP CONSTRAINT "FK_952b3ed48545aaf18033150dc66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Reseller" DROP CONSTRAINT "FK_fe790bb94630d701a8ad93287ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AcmeChallenge" DROP CONSTRAINT "FK_71371b224feb48f1d60e847cf1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AcmeCertificate" DROP CONSTRAINT "FK_130a8fd12e7505eebfce670b198"`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" DROP CONSTRAINT "FK_644c3c0393979f57f71892ff0d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" DROP CONSTRAINT "FK_1f25f5fc0032f7014482d9c195e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4e72fad380eca9abfa3b989554"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3747a5f42be5c977e574abcd71"`,
    );
    await queryRunner.query(`DROP TABLE "WorkflowLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7711266422ebad1188c4879d66"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_94d495f938d819dab20480c5f8"`,
    );
    await queryRunner.query(`DROP TABLE "ServiceLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4523aa1dd9163aaf37698d137e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7281dda2d397d6d75c2f5285bb"`,
    );
    await queryRunner.query(`DROP TABLE "TeamPermissionLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f4af9c94a4b3ba11b4739a25ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_618293911d2e52dc3c6a6873b4"`,
    );
    await queryRunner.query(
      `DROP TABLE "StatusPageSubscriberStatusPageResource"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d7895bb35944a68cccf8286521"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f10f946bb8a5da2ef395557805"`,
    );
    await queryRunner.query(`DROP TABLE "AnnouncementStatusPage"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f3c993200714127eb2d0851cc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c88790ffdbb71aa66a5795be22"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_266f1f927ed89d829a2349d2e2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fcab6c2c59de7fa9e1a4ed52d3"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceStatusPage"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d1a5797fdd98c1fa2f99670aab"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f74e5e95ad88301cbc6e97da6"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceMonitor"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e9f66cc920a6dfd8b20be8497c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d5aa67b52755d47e81bb19feb"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageDownMonitorStatus"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6842f6301436d26a3115406279"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d409a46e63e25fbd4fcc9d5242"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d6d43b15c7dca2734a768379f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_43c6fb265bd3b69e26f1d98b66"`,
    );
    await queryRunner.query(`DROP TABLE "ProjectSsoTeam"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c27ee1fc2df7788145ed9e3333"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_facb426dc0647d760bba573c2d"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyScheduleLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8ad10d0cd8fd68ac64ae3967dc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fed65a7701822d21a66810bfe2"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorSecretMonitor"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a91be5ccf47cbd470c3f9ee560"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2fed2a41449af9a9cf821b759d"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorGroupLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fcf64673a74380a67159376b85"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d527ebc73a91eefcae4beaaf82"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentTemplateLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2b76b57ea6659f97a4bcd1156c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_99245f38769689fe8a172dcb81"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentTemplateOnCallDutyPolicy"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_33fb90ba0116b7db4efd4ec7a4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_390a45e855282ae55ad56d1e1f"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentTemplateMonitor"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17f4085273d14d4d6145cf6585"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1084d1ddbabbcfcab7cd9d547a"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f89b23e3cafd1c6a0bfd42c297"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d127b6da0e4fab9f905b4d332"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentOnCallDutyPolicy"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e2000a938f2e12c6653e68780"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55e3162c1259b1b092f0ac63ee"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentMonitor"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c0248fe6856bbe029fc492ec7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d4a3f7dc4e33b896b0984e7316"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1866fb21ea1acd3d5c37e28ca1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3af64cebb5a7cc7f1ad0aa70c1"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4db7f66405df73287c639ece90"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0946f6b41113cd842ee69f69fb"`,
    );
    await queryRunner.query(`DROP TABLE "ApiKeyPermissionLabel"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c093a47a2ecfa1d5f2d4aeb04a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb47f6d0cabd55fde5b199ae20"`,
    );
    await queryRunner.query(`DROP TABLE "WorkflowVariable"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55293b16d84f048f44c771595b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6c3dc31b09a96d81982a472e22"`,
    );
    await queryRunner.query(`DROP TABLE "WorkflowLog"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a87518833c744b2df4324b61a6"`,
    );
    await queryRunner.query(`DROP TABLE "Workflow"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_815c728d905c44bc440ec91308"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_12ef8407b6359205df8339f849"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d5c3df01bbb2a9ce168b36b523"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_222212e7157f8816357a4f0253"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_26e16ed3e46c6a6589a88d3abb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6491952f9d8066aa5cfff92cd8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58a44736718a5ec4fe41526289"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef993920a9967b61fb3fb9bf16"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_06a427cdcbae1ddcb1301b860f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc79ea74fba7b99835bd475081"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_79580470f34858375cae5d353a"`,
    );
    await queryRunner.query(`DROP TABLE "UserOnCallLogTimeline"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7498ad42c4f77f7fab2a6bc2e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_550f9f6177451d4902467991a1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f047dd6a708175bae0ee6f8c4b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4cd37d481ef366d975c6a7cd9b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ea993eab5c402623b61203e325"`,
    );
    await queryRunner.query(`DROP TABLE "UserOnCallLog"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e2565b0aa7d7e015fb6685afed"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f110fc752889f922d6a3c57a5"`,
    );
    await queryRunner.query(`DROP TABLE "UserNotificationSetting"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bf703b216d7f59424302dc5d70"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1a5912cdf877c89121a3090cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b407063ee43233b0cc8e9106cb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32ca4397660dafe0cab7d03e5b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ec8e7a39fcd38d0ea2d40b8afa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32efb91af1b432a25ceb55bc0d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_69d439e9f60f05ae16732c4999"`,
    );
    await queryRunner.query(`DROP TABLE "UserNotificationRule"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3cb16b5c2d69dbdc812247788f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6439689a29a2192708e3f3603d"`,
    );
    await queryRunner.query(`DROP TABLE "UserSMS"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f713c701d85c69f706e4e82b8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6beed22b36201aea1d70ba0d7"`,
    );
    await queryRunner.query(`DROP TABLE "UserEmail"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4d90bd0e309ad43c4541bb428e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db4e522c086be556e5101c4e91"`,
    );
    await queryRunner.query(`DROP TABLE "UserCall"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91333210492e5d2f334231468a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5670be95a9496b9380b7c0d793"`,
    );
    await queryRunner.query(`DROP TABLE "TelemetryUsageBilling"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6c89ae3af06376fe3411cf8295"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3a3321fd538aa014aa5e4f3522"`,
    );
    await queryRunner.query(`DROP TABLE "TelemetryService"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5064c0bdc8ff238952f9a2acf4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_78293e9cc1746e5f29ccccfdfc"`,
    );
    await queryRunner.query(`DROP TABLE "TeamPermission"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd952f76f5a5297ce69a9a588e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3cc297d538f01065f9925cfb11"`,
    );
    await queryRunner.query(`DROP TABLE "TeamMember"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_217b295d5882faa6cf3418ed81"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6adf943966e01699e86117d2e3"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageSubscriber"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc05de7939af3ada1567fc7106"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1d63fa142dd4175ef256f21d2a"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageSSO"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9b61276c47d6091295dec9e535"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a55bb812676bff276cef1f14c8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b1c4fe08e1d90ae4d26d934653"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ade3f7acf902dcb313d230ca1f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8fba35fb87a0ad6037eb8fc804"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageResource"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0589c51161d13b752fed41a319"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ce45fe77324ede75166d0f57d"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPagePrivateUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_feea72d826c4bf508a95c7c757"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_69b1659abafe656563259784d0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c59f811e0660c5522e45e85b6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c28e05c08656f8aa756734c37c"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageOwnerUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_14768105dd06f0e3e75ec5b051"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a98e42d8df3ba84bd0f79da55"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f60296efefe379693bfd55a776"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9fac66064d88c514d2e5503237"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageOwnerTeam"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54edc7ff7a74a0310a512c5389"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a65f8fabf888d227d64570f52b"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageHistoryChartBarColorRule"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_99c017b6ced8da63abdfbb506e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_70d70692cbe9d9be188723df4f"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageHeaderLink"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5dbcfd7d38e5ea7a78a6a78a33"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a96c34f030a6e39218352a947"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageGroup"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1a80c698b2205074f53376d631"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5f8f65447c9b881860bf742dc9"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageFooterLink"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_842a66fcb103388fcedffef75f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7fab5bc54a8f36eac8f31c8256"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_40cca185c8cf933c04a0534676"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageDomain"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f5ae90bc48a0ddeb50cd009aa"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageCustomField"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c5cbb3fcaf6be56918520501c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5e9c5a7393ac9aa477d625de67"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPageAnnouncement"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_68d0fe13df157c0a93d1ff6fa1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_12854d2b71004825924a476dfc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a30bbda7f5480e498ebc609663"`,
    );
    await queryRunner.query(`DROP TABLE "SmsLog"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_339f8fe3bc6fb4440541cc61a4"`,
    );
    await queryRunner.query(`DROP TABLE "ShortLink"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_590161c4f8e0b63e7ed3fd2163"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_978cd5638c6e44186cbd1099d9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58aa5722dde40c062793ede637"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7c0f750d3a964180d1e1efa16e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_411146017bcfe98bbe028b8d15"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4faf556988f5b6a755ef2e85ae"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceStateTimeline"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b7ec5df94e08afda7569ea1ff"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_937aabd4adbfce78663406a248"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_73c6737ab4a7718c45932bffad"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenancePublicNote"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d71879db35e7c4104b56bef09"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_967c33f7bce5de522c1d1a80e7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_be6a25806925f93b8949e61929"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_518742c7037d9a38a6594dc18a"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceOwnerUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cbe4eac5f23c115ddd4a695747"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1251fb7d4a4bf8586f2bd1528e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1206beb611e0779ce2248ecbae"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e3053b1725658b4a120b4e3185"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceOwnerTeam"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49d4245d0066dc1e14a63a4234"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b4cb4c1312eb72459907e1bbe9"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceNoteTemplate"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_39a27db645744ef9177d4ab7c9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a53ef45aebd4a6a6e7dde7f896"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d79c49a0a613a6b432fd400e69"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceInternalNote"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3621c488327e1c00518aa4e881"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceCustomField"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8306d145e77473ee7ac859a0d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fab9cc7e6ffcf02872fccfab97"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_883038abda021ce79fa838d027"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e0d4bcb3e28628a47b8b55ead8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_20f04dff3b9d1f3d62985dd9de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4059dd569d6a482062352bf266"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenance"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b5138c4c7dc1c36ef592af784f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cfcd002648dcf692a2e126ab05"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97509c6e7f41b59c5447cec669"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7213cf79fce2db23927de0aac0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b8a8b32e0d7e06ed8a9a3171ab"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4e347d3f99b67dacd149beaf61"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_61944d851b4a7213d79ef28174"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4cf5977515ca677e569942fb09"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5f7df6dd7b1a85b933bd953b47"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34a4c35e0d7afe6f023825a68c"`,
    );
    await queryRunner.query(`DROP TABLE "StatusPage"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_57a31fb2a5e4caa223d2506a4e"`,
    );
    await queryRunner.query(`DROP TABLE "ScheduledMaintenanceState"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a7b405e2a9ae144be016bcf973"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7aecf4b1ae3e45647cb911f4c1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6dcdf97c0834dd44b4f2c93e66"`,
    );
    await queryRunner.query(`DROP TABLE "PromoCode"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_be9e6751765501ea1db126fcb2"`,
    );
    await queryRunner.query(`DROP TABLE "ProjectSSO"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_20334b9571a6cd1a871e70d8e7"`,
    );
    await queryRunner.query(`DROP TABLE "ProjectCallSMSConfig"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_41f4ecc29351e1a406e83b30a9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9b36bba6d9898331920805a29c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_08afccd6cbbd1a7015d4fe25e3"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyScheduleLayerUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6fa6574a45cf1352c5a3b96251"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3b892ef36671f1ea1c8457a96d"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyScheduleLayer"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ad4222a4c48b8a64e3a58b351"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_872c2f6a9739bab1b57b6d51ea"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_90119ec7f77fa2efd82261e044"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c5a798ca667fedda71d4ed5465"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_591b7ed73c964e105bfecc6fd6"`,
    );
    await queryRunner.query(
      `DROP TABLE "OnCallDutyPolicyExecutionLogTimeline"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a217798f1dbf12d31b498a1020"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6ad07641fe00f29edc65716aca"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d4a0ffc5e9e698bb2612ba0e55"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_296e2be818e3fba28e43b457fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fbb50489ef5eb354f46d479e2a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4bb332263960531a4c9e2d425"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_00e9676d39eeb807de70443051"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyExecutionLog"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bff6f4ae726b5c5cbae10e7d74"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9ca3fbb66842324aa987d4c972"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b15552e664640f67346193598a"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyEscalationRuleUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0e7d4060e2fabe0957b9fedb42"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f5121f361345d858ce740a55a2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8aff8439fbfb07e7388aa9011"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyEscalationRuleTeam"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_089081f83ef22cdba5a0903ce5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_651a4ab9e3cbb20f6b62a87a6b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_efa24aa8feb92d4e15a707c20e"`,
    );
    await queryRunner.query(
      `DROP TABLE "OnCallDutyPolicyEscalationRuleSchedule"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f2f09fcba2e6eabe61d16aa242"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15bea18a6b3f9730ce6fad2804"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0e1b7c3c3e8305a10716cdb8d6"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicySchedule"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4020168f8d1ee248b8d4bd6293"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e3e66222024c1119865f3eae0f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b90c1cda36981c41e3965a9380"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d45a545669dc46da25cc60d1df"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyEscalationRule"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e791474e098f276eda27704b47"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicyCustomField"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2606f4914507b3471f40864348"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_26f6632b71574ff4dbe87c352d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_01ac1d1ef9e72aeb6dac6575dd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ea6641468483b2ace63144031"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_574feb4161c5216c2c7ee0faaf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c08a7c1ef8d511b335a991aac4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_80213eb3f228f1e3d423f5127e"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorStatusTimeline"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7c3629c5ae14e97bede3bc548e"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorSecret"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a540272f483ef1de68f7e64748"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d50a0e0e624369e7f90a62e8d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d887935f224b896ce64872c37c"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorProbe"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ab449be4e08009bfc2e68f5c78"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a65ce9b11b2d7bde123aa7633f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_324f1d50d0427bbd0e3308c459"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_12a3497e1404fcdbc4e8963a58"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorOwnerUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_acb20c616e3781a3a5506f89ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1d5265d1f3ca2f8b8e461e4998"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_63e5bbac01d1f68c7b08f126cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a6213072d8637e6e625bc7892"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorOwnerTeam"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_50b373c428cfd4566cc5caf98e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf3dcaa746835ae36615a39d86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_825791d5edb2403d7937f16ed9"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorGroupResource"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7c88d50a62d9ba48e9578c9128"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a4095ee3d04454071816a5bad"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b25f4a18bec8cb177e8d65c5f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d5cfbebf8b07405652f5382e15"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorGroupOwnerUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0736d9a7117c25ee216507fa47"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_618bcd9015c257b0727df36fd1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8f19947114087883cea771e1cb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0d7052620f268d0fa17f948a85"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorGroupOwnerTeam"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_04092730e7f93ee58b544f484c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_136524b17f6dbf70f1e720e8f6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_13905ff40843b11145f21e33ff"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorGroup"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c6b61e904d8e3fec1ae719b9e"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorCustomField"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38583ea60d2df4a525098065f3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_876dd05e0dfc64219ef5df241c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_36b9b0204f4b17063483cb7308"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da9dd65b4401b954a0ea2b5c8d"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentTemplateOwnerUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2cb2fc022da183b99cf06f0043"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a895b946fccb109dedd55b85f6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e8090c6569c3a5dbd7ef7485c9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf172eb6797a64ee3750e3f3e2"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentTemplateOwnerTeam"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6d7627ab9d5172c66fc5019216"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ceff6a4dfdccecc4aa40dbfe91"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9fe9e55006c2a1f26727e479ab"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0683d65aa3e3483127671d120f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b82dafef226b0fae1ad6cb1857"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentTemplate"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc5784aa146b249a22afe48b7e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_71c94e9f34772d46fd50e18b64"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7db6b1a8fbbc9eb44c2e7f5047"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5a1a64bc4c38107b25a4bdcd17"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff0fca6570d47798771763533a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fe2dff414a1f67260e3c518981"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_764daa366a4e195768a49e0ee3"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentStateTimeline"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8bbc15605fce799ab2abf6532b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a6964d3aab71608daab9f20e30"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a9a77e5f286b5724f4e2280d0a"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentPublicNote"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8347c45d2b96d4f809bbefeb80"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6aa9a6b46f8e044d722da8f5a7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6311087eeb14ab51e6a1e6133f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ee7ae6757442fba470b213015"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentOwnerUser"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a913a00c56edac2d2e3364fb8b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_408324d3635a826538a792422f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_389aadeb39a0806e80d4001016"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_95f76375ccac835f815d7e926a"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentOwnerTeam"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fcdfc85e8e6b0a1f8128ce572a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_319e120005dff229ac97e9e21d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_baac847c494f692f03fd686e9c"`,
    );
    await queryRunner.query(`DROP TABLE "Team"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7904e01f4867510e9cb3ba09cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_21d5bc0d24b3e5032dd391ec8d"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentNoteTemplate"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_582d48a4d9cce7dd74ea1dd282"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b92e75645fd252e4c2f866047d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ac48058b3e5f9e8361d2b8328c"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentInternalNote"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59e7f6a43dbc5ee54e1a1aaaaf"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentCustomField"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e537806a80e869917ca1d7e2e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6ddd5e3433dcdc6832b2a93845"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ee2acd83fe08dfe3b46a533b7f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5218e92f700d91afe6a8db79cb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c3ad64a7aaf39c1f7885527e24"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ed0ec4960a85240f51e6779a00"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3f28fe3b32abed354a49b26c9c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6592d4f7f3b260efc23fc9b4bc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb410c8eb2e2eadfa5880936fe"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5f53415da5b48954185a6c32b7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eccbc31fa1f58bd051b6f7e108"`,
    );
    await queryRunner.query(`DROP TABLE "Incident"`);
    await queryRunner.query(`DROP TABLE "Probe"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_68884a658e2c47f67c9b2dd9af"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_570a79facd5fe1c01ccdca55ae"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_31508550a088ba2cc843a6c90c"`,
    );
    await queryRunner.query(`DROP TABLE "OnCallDutyPolicy"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2fb8ee83943588b9c5f3358570"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_899a35fe28dd2661f9c999c130"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28d1e0cdf3fcf1ac30249f5d3a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9c8f4b9103fa6b62ff5a121f36"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ea5170227069c85269b3a6db93"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bfee6c29045d1c236d9395f65"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1e0f03c5e067eeb505b2b87aa8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b4c392c3163a2a32da5b401c91"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db5cc02633b36957c9be4d70c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d3461ab640467c8c2100ea55c7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_42ecc6e0ac9984cd24d5f9ddd8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_36d301a9e41af9b6e62b0c0a02"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_996acfb590bda327843f78b7ad"`,
    );
    await queryRunner.query(`DROP TABLE "Monitor"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db1783158a23bd20dbebaae56e"`,
    );
    await queryRunner.query(`DROP TABLE "MonitorStatus"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d279e530067f599f3186e3821"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentState"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_00d2f503174bf201abc6e77afd"`,
    );
    await queryRunner.query(`DROP TABLE "IncidentSeverity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8358adfc13448a58e30a799f6e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_36dde33ab3f3fefb63cb164c7d"`,
    );
    await queryRunner.query(`DROP TABLE "GreenlockChallenge"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d47fcf292f2ceae490da8404d8"`,
    );
    await queryRunner.query(`DROP TABLE "GreenlockCertificate"`);
    await queryRunner.query(`DROP TABLE "GlobalConfig"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0817e87f2e8de1019a09b1eb60"`,
    );
    await queryRunner.query(`DROP TABLE "EmailVerificationToken"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_046364c162885b6ac65d5dd367"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4d606cbaafbdbbf5130c97058"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c92ae54071acce65fa134d855"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7b72c5131b3dd1f3edf201a561"`,
    );
    await queryRunner.query(`DROP TABLE "EmailLog"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a540dab929fa6582b93f258ffe"`,
    );
    await queryRunner.query(`DROP TABLE "ProjectSMTPConfig"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1ce90d3f9693be29b72fabe93"`,
    );
    await queryRunner.query(`DROP TABLE "Domain"`);
    await queryRunner.query(`DROP TABLE "DataMigrations"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_af110ffcec14a2770dada25c92"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_14a8701025e30ab54de66990dc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5648767682195afaeb09098a21"`,
    );
    await queryRunner.query(`DROP TABLE "CallLog"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db4bb9add01b7d8286869fd9a0"`,
    );
    await queryRunner.query(`DROP TABLE "BillingPaymentMethod"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ab13e9a92ce4801c37c2a0a77"`,
    );
    await queryRunner.query(`DROP TABLE "BillingInvoice"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb09dd7fefa9d5d44b1907be5f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0cf347c575f15d3836615f5325"`,
    );
    await queryRunner.query(`DROP TABLE "ApiKeyPermission"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f10d59c2ba66e085722e0053cb"`,
    );
    await queryRunner.query(`DROP TABLE "Label"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17bec9c02846cdf64b5d6bb71f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0e26b8c243b0ed1395bd52aaaf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb1019f0078a21b4854f5cb3ed"`,
    );
    await queryRunner.query(`DROP TABLE "ApiKey"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b5ee87614c184778810283c299"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4ee6a519d48b26fe2a78fdc1c9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38f5c1d2bf0743a868288fc8e6"`,
    );
    await queryRunner.query(`DROP TABLE "Project"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fc269bd109ac405a458b2acc67"`,
    );
    await queryRunner.query(`DROP TABLE "ResellerPlan"`);
    await queryRunner.query(`DROP TABLE "Reseller"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_936afe487b8f9da2f6aae1d11d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fe7dd70f059b5b9bd0452d3ebf"`,
    );
    await queryRunner.query(`DROP TABLE "AcmeChallenge"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8545260bc2f2b2cdb2e7184362"`,
    );
    await queryRunner.query(`DROP TABLE "AcmeCertificate"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_70f42c60b74c0e931f0d599f03"`,
    );
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TABLE "File"`);
  }
}
