import { decode } from "jsonwebtoken";
import { responseHandler } from "../../helpers/responseHandler";
import { isExpired, verifyJWT, verifySecretKey } from "../../utils/jwt";

export const isAuthorized = (req, res, next) => {
  if (!req.headers.token)
    return res
      .status(401)
      .json(responseHandler("failed", "Unauthorized", null, 401));
  if (isExpired(req.headers.token))
    return res
      .status(401)
      .json(
        responseHandler(
          "failed",
          "Session timeout. Please login again.",
          null,
          401
        )
      );
  if (verifyJWT(req.headers.token)) {
    req.body.email = decode(req.headers.token).email;
    req.body.userId = decode(req.headers.token).id;
    next();
  } else {
    return res
      .status(401)
      .json(responseHandler("failed", "Unauthorized", null, 401));
  }
};

export const checkResetPasswordLink = (req, res, next) => {
  if (!req.headers.tk)
    return res
      .status(403)
      .json(responseHandler("failed", "token is missing", null, 403));
  if (isExpired(req.headers.tk))
    return res
      .status(403)
      .json(responseHandler("failed", "Link has been expired", null, 403));
  const tk = verifyJWT(req.headers.tk);
  if (tk) {
    req.body.email = decode(req.headers.tk).email;
    next();
  } else {
    return res
      .status(403)
      .json(responseHandler("failed", "Token is not correct", null, 403));
  }
};

export const isAuthorizedToChangePassword = (req, res, next) => {
  if (!req.headers.tk)
    return res
      .status(401)
      .json(responseHandler("failed", "Unauthorized", null, 401));
  if (isExpired(req.headers.tk))
    return res
      .status(401)
      .json(responseHandler("failed", "Session timeout", null, 401));
  if (verifyJWT(req.headers.tk)) {
    req.body.email = decode(req.headers.tk).email;
    req.body.userId = decode(req.headers.tk).id;
    next();
  } else {
    return res
      .status(401)
      .json(responseHandler("failed", "Unauthorized", null, 401));
  }
};

export const isAuthorizedServerRequest = (req, res, next) => {
  if (!req.headers.secret)
    return res
      .status(401)
      .json(responseHandler("failed", "Unauthorized", null, 401));

  if (verifySecretKey(req.headers.secret)) {
    next();
  } else {
    return res
      .status(401)
      .json(responseHandler("failed", "Unauthorized", null, 401));
  }
};

export const isAuthorizedFromQueryParam = (req, res, next) => {
  if (!req.query.token)
    return res
      .status(401)
      .json(responseHandler("failed", "Unauthorized", null, 401));
  if (isExpired(req.query.token))
    return res
      .status(401)
      .json(
        responseHandler(
          "failed",
          "Session timeout. Please login again.",
          null,
          401
        )
      );
  if (verifyJWT(req.query.token)) {
    req.body.email = decode(req.query.token).email;
    req.body.userId = decode(req.query.token).id;
    next();
  } else {
    return res
      .status(401)
      .json(responseHandler("failed", "Unauthorized", null, 401));
  }
};
