import { decode, verify } from "jsonwebtoken";
import _ from "lodash";

export const isExpired = (token) => {
  let decoded = decode(token);
  if (!decoded) return false;
  if (Date.now() >= decoded.exp * 1000) return true;
  return false;
};

export const verifyJWT = (token) => {
  try {
    const verified = verify(token, process.env.JWT_ENCRYPTION_KEY);
    if (_.isEmpty(verified)) return false;
    return true;
  } catch (error) {
    return false;
  }
};

export const verifySecretKey = (key) => {
  if (key === process.env.NODE_SECRET_KEY) {
    return true;
  } else {
    return false;
  }
};
