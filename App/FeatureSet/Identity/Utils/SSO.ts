import URL from "Common/Types/API/URL";
import OneUptimeDate from "Common/Types/Date";
import Email from "Common/Types/Email";
import BadRequestException from "Common/Types/Exception/BadRequestException";
import { JSONArray, JSONObject } from "Common/Types/JSON";
import Text from "Common/Types/Text";
import logger from "Common/Server/Utils/Logger";
import xmlCrypto, { FileKeyInfo } from "xml-crypto";
import xmldom from "xmldom";
import zlib from "zlib";
import Name from "Common/Types/Name";

export default class SSOUtil {
  public static createSAMLRequestUrl(data: {
    acsUrl: URL;
    signOnUrl: URL;
    issuerUrl: URL;
  }): URL {
    const { acsUrl, signOnUrl } = data;

    const samlRequest: string = `<samlp:AuthnRequest xmlns="urn:oasis:names:tc:SAML:2.0:metadata" ID="${Text.generateRandomText(
      10,
    ).toUpperCase()}" Version="2.0" IssueInstant="${OneUptimeDate.getCurrentDate().toISOString()}" IsPassive="false" AssertionConsumerServiceURL="${acsUrl.toString()}" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ForceAuthn="false"><Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">${data.issuerUrl.toString()}</Issuer></samlp:AuthnRequest>`;

    const deflated: Buffer = zlib.deflateRawSync(samlRequest);

    const base64Encoded: string = deflated.toString("base64");

    return URL.fromString(signOnUrl.toString()).addQueryParam(
      "SAMLRequest",
      base64Encoded,
      true,
    );
  }

  public static isPayloadValid(payload: JSONObject): void {
    if (
      !payload["saml2p:Response"] &&
      !payload["samlp:Response"] &&
      !payload["samlp:Response"]
    ) {
      throw new BadRequestException("SAML Response not found.");
    }

    payload =
      (payload["saml2p:Response"] as JSONObject) ||
      (payload["samlp:Response"] as JSONObject) ||
      (payload["samlp:Response"] as JSONObject) ||
      (payload["Response"] as JSONObject);

    const issuers: JSONArray =
      (payload["saml2:Issuer"] as JSONArray) ||
      (payload["saml:Issuer"] as JSONArray) ||
      (payload["Issuer"] as JSONArray);

    if (issuers.length === 0) {
      throw new BadRequestException("Issuers not found");
    }

    const issuer: JSONObject | string | undefined = issuers[0];

    if (typeof issuer === "string") {
      return issuer;
    }
    if (!issuer) {
      throw new BadRequestException("Issuer not found");
    }

    const issuerUrl: string = issuer["_"] as string;

    if (!issuerUrl) {
      throw new BadRequestException("Issuer URL not found in SAML response");
    }

    const samlAssertion: JSONArray =
      (payload["saml2:Assertion"] as JSONArray) ||
      (payload["saml:Assertion"] as JSONArray) ||
      (payload["Assertion"] as JSONArray);

    if (!samlAssertion || samlAssertion.length === 0) {
      throw new BadRequestException("SAML Assertion not found");
    }

    const samlSubject: JSONArray =
      ((samlAssertion[0] as JSONObject)["saml2:Subject"] as JSONArray) ||
      ((samlAssertion[0] as JSONObject)["saml:Subject"] as JSONArray) ||
      ((samlAssertion[0] as JSONObject)["Subject"] as JSONArray);

    if (!samlSubject || samlSubject.length === 0) {
      throw new BadRequestException("SAML Subject not found");
    }

    const samlNameId: JSONArray =
      ((samlSubject[0] as JSONObject)["saml2:NameID"] as JSONArray) ||
      ((samlSubject[0] as JSONObject)["saml:NameID"] as JSONArray) ||
      ((samlSubject[0] as JSONObject)["NameID"] as JSONArray);

    if (!samlNameId || samlNameId.length === 0) {
      throw new BadRequestException("SAML NAME ID not found");
    }

    const emailString: string = (samlNameId[0] as JSONObject)["_"] as string;

    if (!emailString) {
      if (!samlNameId || samlNameId.length === 0) {
        throw new BadRequestException("SAML Email not found");
      }
    }
  }

  public static isSignatureValid(
    samlPayload: string,
    certificate: string,
  ): boolean {
    try {
      const dom: Document = new xmldom.DOMParser().parseFromString(samlPayload);
      const signature: Element | undefined = dom.getElementsByTagNameNS(
        "http://www.w3.org/2000/09/xmldsig#",
        "Signature",
      )[0];
      const sig: xmlCrypto.SignedXml = new xmlCrypto.SignedXml();

      sig.keyInfoProvider = {
        getKeyInfo: function (_key: any) {
          return `<X509Data><X509Certificate>${certificate}</X509Certificate></X509Data>`;
        },
        getKey: function () {
          return certificate;
        } as any,
      } as FileKeyInfo;

      sig.loadSignature(signature!.toString());
      const res: boolean = sig.checkSignature(samlPayload);

      return res;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  public static getUserFullName(payload: JSONObject): Name | null {
    if (!payload["saml2p:Response"] && !payload["samlp:Response"]) {
      return null;
    }

    payload =
      (payload["saml2p:Response"] as JSONObject) ||
      (payload["samlp:Response"] as JSONObject) ||
      (payload["Response"] as JSONObject);

    const samlAssertion: JSONArray =
      (payload["saml2:Assertion"] as JSONArray) ||
      (payload["saml:Assertion"] as JSONArray) ||
      (payload["Assertion"] as JSONArray);

    if (!samlAssertion || samlAssertion.length === 0) {
      return null;
    }

    const samlAttributeStatement: JSONArray =
      ((samlAssertion[0] as JSONObject)[
        "saml2:AttributeStatement"
      ] as JSONArray) ||
      ((samlAssertion[0] as JSONObject)[
        "saml:AttributeStatement"
      ] as JSONArray) ||
      ((samlAssertion[0] as JSONObject)["AttributeStatement"] as JSONArray);

    if (!samlAttributeStatement || samlAttributeStatement.length === 0) {
      return null;
    }

    const samlAttribute: JSONArray =
      ((samlAttributeStatement[0] as JSONObject)[
        "saml2:Attribute"
      ] as JSONArray) ||
      ((samlAttributeStatement[0] as JSONObject)[
        "saml:Attribute"
      ] as JSONArray) ||
      ((samlAttributeStatement[0] as JSONObject)["Attribute"] as JSONArray);

    if (!samlAttribute || samlAttribute.length === 0) {
      return null;
    }

    // get displayName attribute.
    //   {
    //     "$": {
    //         "Name": "http://schemas.microsoft.com/identity/claims/displayname"
    //     },
    //     "AttributeValue": [
    //         "Nawaz Dhandala"
    //     ]
    // },

    for (let i: number = 0; i < samlAttribute.length; i++) {
      const attribute: JSONObject = samlAttribute[i] as JSONObject;
      if (
        attribute["$"] &&
        (attribute["$"] as JSONObject)["Name"]?.toString()
      ) {
        const name: string | undefined = (attribute["$"] as JSONObject)[
          "Name"
        ]?.toString();
        if (
          name &&
          name === "http://schemas.microsoft.com/identity/claims/displayname" &&
          attribute["AttributeValue"] &&
          Array.isArray(attribute["AttributeValue"]) &&
          attribute["AttributeValue"].length > 0
        ) {
          const fullName: Name = new Name(
            attribute["AttributeValue"][0]!.toString() as string,
          );
          return fullName;
        }
      }
    }

    return null;
  }

  public static getEmail(payload: JSONObject): Email {
    if (!payload["saml2p:Response"] && !payload["samlp:Response"]) {
      throw new BadRequestException("SAML Response not found.");
    }

    payload =
      (payload["saml2p:Response"] as JSONObject) ||
      (payload["samlp:Response"] as JSONObject) ||
      (payload["Response"] as JSONObject);

    const samlAssertion: JSONArray =
      (payload["saml2:Assertion"] as JSONArray) ||
      (payload["saml:Assertion"] as JSONArray) ||
      (payload["Assertion"] as JSONArray);

    if (!samlAssertion || samlAssertion.length === 0) {
      throw new BadRequestException("SAML Assertion not found");
    }

    const samlSubject: JSONArray =
      ((samlAssertion[0] as JSONObject)["saml2:Subject"] as JSONArray) ||
      ((samlAssertion[0] as JSONObject)["saml:Subject"] as JSONArray) ||
      ((samlAssertion[0] as JSONObject)["Subject"] as JSONArray);

    if (!samlSubject || samlSubject.length === 0) {
      throw new BadRequestException("SAML Subject not found");
    }

    const samlNameId: JSONArray =
      ((samlSubject[0] as JSONObject)["saml2:NameID"] as JSONArray) ||
      ((samlSubject[0] as JSONObject)["saml:NameID"] as JSONArray) ||
      ((samlSubject[0] as JSONObject)["NameID"] as JSONArray);

    if (!samlNameId || samlNameId.length === 0) {
      throw new BadRequestException("SAML NAME ID not found");
    }

    const emailString: string = (samlNameId[0] as JSONObject)["_"] as string;

    return new Email(emailString.trim());
  }

  public static getIssuer(payload: JSONObject): string {
    if (!payload["saml2p:Response"] && !payload["samlp:Response"]) {
      throw new BadRequestException("SAML Response not found.");
    }

    payload =
      (payload["saml2p:Response"] as JSONObject) ||
      (payload["samlp:Response"] as JSONObject) ||
      (payload["Response"] as JSONObject);

    const issuers: JSONArray =
      (payload["saml2:Issuer"] as JSONArray) ||
      (payload["saml:Issuer"] as JSONArray) ||
      (payload["Issuer"] as JSONArray);

    if (issuers.length === 0) {
      throw new BadRequestException("Issuers not found");
    }

    const issuer: JSONObject | string | undefined = issuers[0];

    if (typeof issuer === "string") {
      return issuer;
    }

    if (!issuer) {
      throw new BadRequestException("Issuer not found");
    }

    const issuerUrl: string = issuer["_"] as string;

    if (!issuerUrl) {
      throw new BadRequestException("Issuer URL not found in SAML response");
    }

    return issuerUrl.trim();
  }
}
