import "dotenv/config";
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);

export async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Please log in first." });
  }
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.CLIENT_URL,
    });
    req.user = payload; // email and name come from the token
    next();
  } catch (error) {
    res.status(401).send({ message: "Your session is invalid or expired." });
  }
}