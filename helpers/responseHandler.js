export const responseHandler = (type, message, body, code=null) => {
    const SUCCESS_RESPONSE = {
      success: true,
      message: message || "",
      data: body,
      code: code || 200
    };
    const FAILURE_RESOONSE = {
      success: false,
      message: message || "Something went wrong!",
      code,
    };
    switch (type) {
      case "success":
        return SUCCESS_RESPONSE;
      case "failed":
        return FAILURE_RESOONSE;
      default:
        return "";
    }
  };