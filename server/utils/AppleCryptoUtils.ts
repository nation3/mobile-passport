import fs from "fs";
import path from "path";
import crypto from "crypto";
import forge from "node-forge";

const APPLE_CA_CERTIFICATE = forge.pki.certificateFromPem(
  process.env.APPLE_CA_CERTIFICATE_PEM ||
    `-----BEGIN CERTIFICATE-----
    MIIEVTCCAz2gAwIBAgIUE9x3lVJx5T3GMujM/+Uh88zFztIwDQYJKoZIhvcNAQEL
    BQAwYjELMAkGA1UEBhMCVVMxEzARBgNVBAoTCkFwcGxlIEluYy4xJjAkBgNVBAsT
    HUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRYwFAYDVQQDEw1BcHBsZSBS
    b290IENBMB4XDTIwMTIxNjE5MzYwNFoXDTMwMTIxMDAwMDAwMFowdTFEMEIGA1UE
    Aww7QXBwbGUgV29ybGR3aWRlIERldmVsb3BlciBSZWxhdGlvbnMgQ2VydGlmaWNh
    dGlvbiBBdXRob3JpdHkxCzAJBgNVBAsMAkc0MRMwEQYDVQQKDApBcHBsZSBJbmMu
    MQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANAf
    eKp6JzKwRl/nF3bYoJ0OKY6tPTKlxGs3yeRBkWq3eXFdDDQEYHX3rkOPR8SGHgjo
    v9Y5Ui8eZ/xx8YJtPH4GUnadLLzVQ+mxtLxAOnhRXVGhJeG+bJGdayFZGEHVD41t
    QSo5SiHgkJ9OE0/QjJoyuNdqkh4laqQyziIZhQVg3AJK8lrrd3kCfcCXVGySjnYB
    5kaP5eYq+6KwrRitbTOFOCOL6oqW7Z+uZk+jDEAnbZXQYojZQykn/e2kv1MukBVl
    PNkuYmQzHWxq3Y4hqqRfFcYw7V/mjDaSlLfcOQIA+2SM1AyB8j/VNJeHdSbCb64D
    YyEMe9QbsWLFApy9/a8CAwEAAaOB7zCB7DASBgNVHRMBAf8ECDAGAQH/AgEAMB8G
    A1UdIwQYMBaAFCvQaUeUdgn+9GuNLkCm90dNfwheMEQGCCsGAQUFBwEBBDgwNjA0
    BggrBgEFBQcwAYYoaHR0cDovL29jc3AuYXBwbGUuY29tL29jc3AwMy1hcHBsZXJv
    b3RjYTAuBgNVHR8EJzAlMCOgIaAfhh1odHRwOi8vY3JsLmFwcGxlLmNvbS9yb290
    LmNybDAdBgNVHQ4EFgQUW9n6HeeaGgujmXYiUIY+kchbd6gwDgYDVR0PAQH/BAQD
    AgEGMBAGCiqGSIb3Y2QGAgEEAgUAMA0GCSqGSIb3DQEBCwUAA4IBAQA/Vj2e5bbD
    eeZFIGi9v3OLLBKeAuOugCKMBB7DUshwgKj7zqew1UJEggOCTwb8O0kU+9h0UoWv
    p50h5wESA5/NQFjQAde/MoMrU1goPO6cn1R2PWQnxn6NHThNLa6B5rmluJyJlPef
    x4elUWY0GzlxOSTjh2fvpbFoe4zuPfeutnvi0v/fYcZqdUmVIkSoBPyUuAsuORFJ
    EtHlgepZAE9bPFo22noicwkJac3AfOriJP6YRLj477JxPxpd1F1+M02cHSS+APCQ
    A1iZQT0xWmJArzmoUUOSqwSonMJNsUvSq3xKX+udO7xPiEAGE/+QF4oIRynoYpgp
    pU8RBWk6z/Kf
    -----END CERTIFICATE-----`
);

/**
 * Utility class based on https://developer.apple.com/documentation/walletpasses/building_a_pass
 */
export class AppleCryptoUtils {
  /**
   * The manifest is a JSON object that contains a dictionary of the SHA1 hashes for each of
   * the source files for the pass. The dictionary key is the pathname of the file relative
   * to the top level of the pass, and the value is the SHA1 hash.
   *
   * Example:
   *
   * {
   *   "icon.png" : "2a1625e1e1b3b38573d086b5ec158f72f11283a0",
   *   "icon@2x.png" : "7321a3b7f47d1971910db486330c172a720c3e4b",
   *   "icon@3x.png" : "7321a3b7f47d1971910db486330c172a720c3e4b",
   *   "pass.json" : "ef3f648e787a16ac49fff2c0daa8615e1fa15df9",
   *   "strip.png" : "25b737727194b5c7b26a86d57e859a054eada240",
   *   "en.lproj\/logo.png" : "cff02680b9041b7bf637960f9f2384738c935347",
   *   "en.lproj\/logo@2x.png" : "0e12af882204c3661fd937f6594c6b5ffc6b8a49",
   *   "en.lproj\/logo@3x.png" : "1f103c8a07fb979ea33adfbfd031e26305fd616b",
   *   "en.lproj\/pass.strings" : "aaf7d9598f6a792755be71f492a3523d507bc212",
   *   "zh-Hans.lproj\/logo.png" : "eca86d8a474ccd33978f6aaf98a564669d45c7ae",
   *   "zh-Hans.lproj\/logo@2x.png" : "b6556bc2fa795d11262f17cdff04f80350398f5f",
   *   "zh-Hans.lproj\/logo@3x.png" : "124f8381721b44b2b57bf33e30b8a9a2e0404bce",
   *   "zh-Hans.lproj\/pass.strings" : "b0b4499ba7369e4cc15bad45c251e7b9bbcad6a4",
   * }
   */
  static generateManifestObject(templateVersionDir: string): JSON {
    console.log("generateManifestObject");

    const manifest: any = {
      "icon.png": this.calculateSha1Hash(
        path.join(templateVersionDir, "icon.png")
      ),
      "icon@2x.png": this.calculateSha1Hash(
        path.join(templateVersionDir, "icon@2x.png")
      ),
      "logo.png": this.calculateSha1Hash(
        path.join(templateVersionDir, "logo.png")
      ),
      "logo@2x.png": this.calculateSha1Hash(
        path.join(templateVersionDir, "logo@2x.png")
      ),
      "logo@3x.png": this.calculateSha1Hash(
        path.join(templateVersionDir, "logo@3x.png")
      ),
      "pass.json": this.calculateSha1Hash(
        path.join(templateVersionDir, "pass.json")
      ),
      "strip.png": this.calculateSha1Hash(
        path.join(templateVersionDir, "strip.png")
      ),
      "strip@2x.png": this.calculateSha1Hash(
        path.join(templateVersionDir, "strip@2x.png")
      ),
      "strip@3x.png": this.calculateSha1Hash(
        path.join(templateVersionDir, "strip@3x.png")
      ),
    };

    return <JSON>manifest;
  }

  /**
   * Calculates the SHA-1 hash of a file's content.
   */
  static calculateSha1Hash(filePath: string): string {
    console.log("calculateSha1Hash");

    console.log(`filePath: "${filePath}"`);

    // Read the file content
    const fileBuffer: Buffer = fs.readFileSync(filePath);
    console.log("fileBuffer:", fileBuffer);

    // Create a SHA-1 hash
    const hash: crypto.Hash = crypto.createHash("sha1");
    console.log("hash:", hash);

    // Update the hash content with the Buffer data
    hash.update(fileBuffer);

    // Generate hash digest of all the data
    const hexDigest: string = hash.digest("hex");
    console.log("hexDigest:", hexDigest);

    return hexDigest;
  }

  /**
   * Create a PKCS#7 detached signature for the manifest that uses the private key of the
   * pass identifier signing certificate.
   *
   * @see https://www.npmjs.com/package/node-forge#user-content-pkcs7
   */
  static createSignature(manifestJsonStringified: string): Buffer {
    console.log("createSignature");

    console.log("manifestJsonStringified:", manifestJsonStringified);

    // Load the certificate in PEM format
    const certificatePem: string = `-----BEGIN CERTIFICATE-----${String(
      process.env.APPLE_CERTIFICATE_PEM
    )}-----END CERTIFICATE-----`;
    console.log("certificatePem:", certificatePem);

    // Convert a Forge certificate from PEM
    const certificate: forge.pki.Certificate =
      forge.pki.certificateFromPem(certificatePem);
    console.log("certificate:\n", certificate);

    console.log("APPLE_CA_CERTIFICATE:\n", APPLE_CA_CERTIFICATE);

    // Create detached PKCS#7 signed data
    const p7: forge.pkcs7.PkcsSignedData = forge.pkcs7.createSignedData();
    console.log("p7:\n", p7);
    p7.content = manifestJsonStringified;
    p7.addCertificate(certificate);
    p7.addCertificate(APPLE_CA_CERTIFICATE);
    p7.addSigner({
      key: `-----BEGIN RSA PRIVATE KEY-----${String(
        process.env.APPLE_CERTIFICATE_KEY
      )}-----END RSA PRIVATE KEY-----`,
      certificate: certificate,
      digestAlgorithm: forge.pki.oids.sha256, // Signature Algorithm: sha256WithRSAEncryption
      authenticatedAttributes: [
        {
          type: forge.pki.oids.contentType,
          value: forge.pki.oids.data,
        },
        {
          type: forge.pki.oids.messageDigest,
          // `value` will be auto-populated at signing time
        },
        {
          type: forge.pki.oids.signingTime,
          // `value` will be auto-populated at signing time
        },
      ],
    });
    p7.sign({ detached: true });

    // Convert to DER format
    const derBytes: forge.Bytes = forge.asn1.toDer(p7.toAsn1()).getBytes();

    // Convert to Buffer
    const derBuffer: Buffer = Buffer.from(derBytes, "binary");

    return derBuffer;
  }
}
