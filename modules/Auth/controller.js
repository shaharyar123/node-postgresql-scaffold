import _ from "lodash";
import { sign } from "jsonwebtoken";
import { responseHandler } from "../../helpers/responseHandler";
import Users from "../../models/Users";
import { decrypt_value, encrypt_value } from "../../utils/crypto";
import { validationResult } from "express-validator";

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(responseHandler("failed", errors.array(), errors.array(), 400));
  }

  const { email, password } = req.body;
  try {
    const user = await Users.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!_.isEmpty(user)) {
      if (decrypt_value(user.password) !== JSON.stringify(password)) {
        return res
          .status(400)
          .json(responseHandler("failed", "Wrong Credentials"));
      } else {
        const token = sign(
          { id: user.id, email: user.email },
          process.env.JWT_ENCRYPTION_KEY,
          { expiresIn: "12h" }
        );
        const data = {
          email: user.email,
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          jwt: token,
        };
        return res.json(
          responseHandler("success", "Logged in successfully", data, 200)
        );
      }
    }
    return res
      .status(404)
      .json(responseHandler("failed", "User does not exists", null, 404));
  } catch (ex) {
    console.log(ex);
    return res.status(500).json(responseHandler("failed", ex, null, 500));
  }
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(responseHandler("failed", errors.array(), errors.array(), 400));
  }
  let { email, password, first_name, last_name } = req.body;

  try {
    const isExists = await Users.findOne({
      where: { email },
    });
    if (!_.isEmpty(isExists)) {
      return res
        .status(403)
        .json(responseHandler("failed", "User already exists", null, 403));
    } else {
      const created = await Users.create({
        email: email.toLowerCase(),
        password: encrypt_value(password),
        first_name,
        last_name,
      });

      const data = {
        id: created.id,
        first_name: created.first_name,
        last_name: created.last_name,
        email: created.email,
      };
      return res.json(
        responseHandler(
          "success",
          "User has been created successfully",
          data,
          200
        )
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseHandler("failed", error, null, 500));
  }
};
