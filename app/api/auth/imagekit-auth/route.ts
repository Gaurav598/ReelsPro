import { getUploadAuthParams } from "@imagekit/next/server";

/**
 * GET /api/auth/imagekit-auth
 *
 * ImageKit pe file upload karne se pehle, client ko "permission" chahiye.
 * Yeh endpoint woh permission (signature, token, expire) generate karta hai.
 *
 * Flow: Client → yeh API call karo → credentials lo → ImageKit pe directly upload karo
 *
 * FIX: Pehle response nested tha { authenticationParameters: { ... } }
 * Ab flat hai { signature, expire, token } — taaki FileUpload component seedha padh sake.
 */
export async function GET() {
  try {
    // getUploadAuthParams() generates a signature using your private key
    // This signature proves to ImageKit that the upload is authorized
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    });

    // Return flat structure — FileUpload component reads these directly
    return Response.json({
      token,
      expire,
      signature,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return Response.json(
      { error: "Authentication for ImageKit failed" },
      { status: 500 }
    );
  }
}
