import PingMonitor from "./Monitors/MonitorTypes/PingMonitor";
import PortMonitor from "./Monitors/MonitorTypes/PortMonitor";
import WebsiteMonitor from "./Monitors/MonitorTypes/WebsiteMonitor";
import Hostname from "Common/Types/API/Hostname";
import URL from "Common/Types/API/URL";
import Port from "Common/Types/Port";
import { IsBillingEnabled } from "Common/Server/EnvironmentConfig";

export default class OnlineCheck {
  // burn domain names into the code to see if this probe is online.
  public static async canProbeMonitorWebsiteMonitors(): Promise<boolean> {
    if (!IsBillingEnabled) {
      // if the billing is not enabled which means its non on SaaS but self-hosted.
      // in this case return true as we don't need to check for online status.
      return true;
    }

    const websiteNames: Array<string> = [
      "https://google.com",
      "https://facebook.com",
      "https://microsoft.com",
      "https://youtube.com",
      "https://apple.com",
    ];

    for (const websiteName of websiteNames) {
      if (
        (
          await WebsiteMonitor.ping(URL.fromString(websiteName), {
            isOnlineCheckRequest: true,
          })
        )?.isOnline
      ) {
        return true;
      }
    }

    return false;
  }

  public static async canProbeMonitorPingMonitors(): Promise<boolean> {
    if (!IsBillingEnabled) {
      // if the billing is not enabled which means its non on SaaS but self-hosted.
      // in this case return true as we don't need to check for online status.
      return true;
    }

    const domains: Array<string> = [
      "google.com",
      "facebook.com",
      "microsoft.com",
      "youtube.com",
      "apple.com",
    ];

    for (const domain of domains) {
      if (
        (
          await PingMonitor.ping(new Hostname(domain), {
            isOnlineCheckRequest: true,
          })
        )?.isOnline
      ) {
        return true;
      }
    }

    return false;
  }

  public static async canProbeMonitorPortMonitors(): Promise<boolean> {
    if (!IsBillingEnabled) {
      // if the billing is not enabled which means its non on SaaS but self-hosted.
      // in this case return true as we don't need to check for online status.
      return true;
    }

    const domains: Array<string> = [
      "google.com",
      "facebook.com",
      "microsoft.com",
      "youtube.com",
      "apple.com",
    ];

    for (const domain of domains) {
      if (
        (
          await PortMonitor.ping(new Hostname(domain), new Port(80), {
            isOnlineCheckRequest: true,
          })
        )?.isOnline
      ) {
        return true;
      }
    }

    return false;
  }
}
