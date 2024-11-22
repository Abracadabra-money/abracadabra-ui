// errorHandler.js - Централізована логіка обробки помилок
import { errorRegistry } from "./errorRegistry";
import { AxiosError } from "axios";
import { BaseError } from "viem";


// 1. Custom error handler
// 2. Axios (HTTP) error handler
// 3. Metamask, Rabby (EIP-1193, JSON-RPC 2.0) error handler
// 4. 

// https://blog.logrocket.com/understanding-resolving-metamask-error-codes/
// https://rabby.io/docs/integrating-rabby-wallet/
// https://www.jsonrpc.org/specification
// https://developer.mozilla.org/ru/docs/Web/HTTP/Status
// https://viem.sh/docs/error-handling.html

class ErrorHandler {
  static handleError(error: Error) {
    console.log("handleError:")
    // Визначення типу помилки
    const errorType = this.identifyErrorType(error);
    const errorData = errorRegistry[errorType] || errorRegistry.GENERIC_ERROR;

    // Генеруємо повідомлення для користувача
    const message = this.getErrorMessage(errorData.template, error.shortMessage ? error.shortMessage : error.message);

    // Логування або інші дії
    console.log(`Error:`, {errorType, errorData, message});
  }

  // Основна функція, що ідентифікує тип помилки
  static identifyErrorType(error: Error) {
    const checks = [
      this.identifyCustomThrownError,
      this.identifyViemError,
    ];

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

  static identifyViemError(error) {
    if (error.version?.includes("viem")) return "VIEM_ERROR";
    return null;
  }

  static getErrorMessage(template, messageFromError) {
    let finalMessage = template;
    if (template.includes("{message}")) {
      finalMessage = finalMessage.replace(
        "{message}",
        messageFromError || "Details not provided."
      );
    }

    return finalMessage;
  }
}

export default ErrorHandler;
