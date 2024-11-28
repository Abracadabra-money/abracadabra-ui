import { errorRegistry } from "./errorRegistry";
import store from "@/store";

class ErrorHandler {
  static handleError(error: Error) {
    const errorType = this.identifyErrorType(error);

    //@ts-ignore
    const errorData = errorRegistry[errorType] || errorRegistry.GENERIC_ERROR;

    const message = this.getErrorMessage(
      errorData.template,
      //@ts-ignore
      error.shortMessage ? error.shortMessage : error.message
    );

    // Show error notification
    this.setErrorNotifictiom(message);

    console.log(`Error:`, { errorType, errorData, message });
  }

  static identifyErrorType(error: Error) {
    const checks = [this.identifyCustomThrownError, this.identifyViemError];

    for (const check of checks) {
      const errorType = check(error);
      if (errorType) return errorType;
    }

    return "GENERIC_ERROR";
  }

  static identifyCustomThrownError(error: Error) {
    if (error.message?.includes("CUSTOM")) return error.message;
    return null;
  }

  static identifyViemError(error: any) {
    if (error.version?.includes("viem")) return "VIEM_ERROR";
    return null;
  }

  static identifyAxiosError(error: any) {
    if (error.isAxios) return "AXIOS_ERROR";
    return null;
  }

  static getErrorMessage(template: string, messageFromError: string) {
    let finalMessage = template;
    if (template.includes("{message}")) {
      finalMessage = finalMessage.replace(
        "{message}",
        messageFromError || "Details not provided."
      );
    }

    return finalMessage;
  }

  static setErrorNotifictiom(message: string) {
    store.commit("notifications/deleteAll");

    store.dispatch("notifications/new", {
      msg: message,
      type: "error",
    });
  }
}

export default ErrorHandler;
