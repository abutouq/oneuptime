import Hostname from "./API/Hostname";
import Route from "./API/Route";
import URL from "./API/URL";
import EqualTo from "./BaseDatabase/EqualTo";
import EqualToOrNull from "./BaseDatabase/EqualToOrNull";
import GreaterThan from "./BaseDatabase/GreaterThan";
import GreaterThanOrEqual from "./BaseDatabase/GreaterThanOrEqual";
import InBetween from "./BaseDatabase/InBetween";
import Includes from "./BaseDatabase/Includes";
import IsNull from "./BaseDatabase/IsNull";
import LessThan from "./BaseDatabase/LessThan";
import LessThanOrEqual from "./BaseDatabase/LessThanOrEqual";
import LessThanOrNull from "./BaseDatabase/LessThanOrNull";
import GreaterThanOrNull from "./BaseDatabase/GreaterThanOrNull";
import NotEqual from "./BaseDatabase/NotEqual";
import NotNull from "./BaseDatabase/NotNull";
import Search from "./BaseDatabase/Search";
import Color from "./Color";
import OneUptimeDate from "./Date";
import Dictionary from "./Dictionary";
import Domain from "./Domain";
import Email from "./Email";
import Recurring from "./Events/Recurring";
import HashedString from "./HashedString";
import IP from "./IP/IP";
import { ObjectType } from "./JSON";
import MonitorCriteria from "./Monitor/MonitorCriteria";
import MonitorCriteriaInstance from "./Monitor/MonitorCriteriaInstance";
import MonitorStep from "./Monitor/MonitorStep";
import MonitorSteps from "./Monitor/MonitorSteps";
import Name from "./Name";
import ObjectID from "./ObjectID";
import Phone from "./Phone";
import Port from "./Port";
import Version from "./Version";

const SerializableObjectDictionary: Dictionary<any> = {
  [ObjectType.Phone]: Phone,
  [ObjectType.DateTime]: OneUptimeDate,
  [ObjectType.ObjectID]: ObjectID,
  [ObjectType.Name]: Name,
  [ObjectType.EqualTo]: EqualTo,
  [ObjectType.EqualToOrNull]: EqualToOrNull,
  [ObjectType.MonitorSteps]: MonitorSteps,
  [ObjectType.MonitorStep]: MonitorStep,
  [ObjectType.MonitorCriteria]: MonitorCriteria,
  [ObjectType.MonitorCriteriaInstance]: MonitorCriteriaInstance,
  [ObjectType.NotEqual]: NotEqual,
  [ObjectType.Email]: Email,
  [ObjectType.Color]: Color,
  [ObjectType.Domain]: Domain,
  [ObjectType.Version]: Version,
  [ObjectType.Route]: Route,
  [ObjectType.URL]: URL,
  [ObjectType.IP]: IP,
  [ObjectType.Search]: Search,
  [ObjectType.GreaterThan]: GreaterThan,
  [ObjectType.GreaterThanOrEqual]: GreaterThanOrEqual,
  [ObjectType.LessThan]: LessThan,
  [ObjectType.LessThanOrEqual]: LessThanOrEqual,
  [ObjectType.LessThanOrNull]: LessThanOrNull,
  [ObjectType.GreaterThanOrNull]: GreaterThanOrNull,
  [ObjectType.Port]: Port,
  [ObjectType.Hostname]: Hostname,
  [ObjectType.HashedString]: HashedString,
  [ObjectType.InBetween]: InBetween,
  [ObjectType.Includes]: Includes,
  [ObjectType.NotNull]: NotNull,
  [ObjectType.IsNull]: IsNull,
  [ObjectType.Recurring]: Recurring,
};

export default SerializableObjectDictionary;
