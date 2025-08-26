import DataMigrationBase from "./DataMigrationBase";
import Hostname from "Common/Types/API/Hostname";
import ObjectID from "Common/Types/ObjectID";
import Port from "Common/Types/Port";
import GlobalConfigService from "Common/Server/Services/GlobalConfigService";
import { EmailServerType } from "Common/Models/DatabaseModels/GlobalConfig";

export default class UpdateGlobalConfigFromEnv extends DataMigrationBase {
  public constructor() {
    super("UpdateGlobalConfigFromEnv");
  }

  public override async migrate(): Promise<void> {
    // get all the users with email isVerified true.

    let emailServerType: EmailServerType = EmailServerType.CustomSMTP;

    if (process.env["SENDGRID_API_KEY"]) {
      emailServerType = EmailServerType.Sendgrid;
    }

    await GlobalConfigService.updateOneById({
      id: ObjectID.getZeroObjectID(),
      data: {
        // Update Twilio

        twilioAccountSID: process.env["TWILIO_ACCOUNT_SID"] || "",
        twilioAuthToken: process.env["TWILIO_AUTH_TOKEN"] || "",
        twilioPrimaryPhoneNumber: process.env["TWILIO_PHONE_NUMBER"] || "",

        // Update SMTP
        smtpUsername: process.env["SMTP_USERNAME"] || "",
        smtpPassword: process.env["SMTP_PASSWORD"] || "",
        smtpHost: Hostname.fromString(process.env["SMTP_HOST"] || ""),
        smtpPort: new Port(process.env["SMTP_PORT"] || "25"),
        isSMTPSecure: process.env["SMTP_IS_SECURE"] === "true",
        smtpFromEmail:
          process.env["SMTP_FROM_EMAIL"] || process.env["SMTP_EMAIL"] || "",
        smtpFromName: process.env["SMTP_FROM_NAME"] || "",

        emailServerType: emailServerType,

        // diable signup
        disableSignup: process.env["DISABLE_SIGNUP"] === "true",

        sendgridApiKey: process.env["SENDGRID_API_KEY"] || "",
      },
      props: {
        isRoot: true,
      },
    });
  }

  public override async rollback(): Promise<void> {
    return;
  }
}
