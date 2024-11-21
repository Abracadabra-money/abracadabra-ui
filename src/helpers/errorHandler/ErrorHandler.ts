// errorHandler.js - Централізована логіка обробки помилок
import { errorRegistry } from "./errorRegistry";
import { AxiosError } from "axios";


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
  static handleError(error: Error | AxiosError) {
    // Визначення типу помилки
    const errorType = this.identifyErrorType(error);
    const errorData = errorRegistry[errorType] || errorRegistry.GENERIC_ERROR;

    // Генеруємо повідомлення для користувача
    const message = this.getErrorMessage(errorData.template, error.message);

    // Показуємо сповіщення
    this.showNotification(message);

    // Логування або інші дії
    console.error(`Error code: ${errorData.code}`, error);
  }

  // Основна функція, що ідентифікує тип помилки
  static identifyErrorType(error) {
    const checks = [
      this.identifyMetaMaskError,
      this.identifyViemError,
      this.identifyAxiosError,
      this.identifyCustomThrownError,
    ];

    for (const check of checks) {
      const errorType = check(error);
      if (errorType) return errorType;
    }

    return "GENERIC_ERROR";
  }

  // Функції для перевірки окремих типів помилок

  static identifyEIP1193WalletError(error) {
    if (typeof window.ethereum === "undefined") return "WALLET_NOT_INSTALLED";
  
    // EIP-1193 специфічні помилки
    if (error.code === 4001) return "USER_REJECTION"; // Відхилення транзакції
    if (error.code === -32602) return "INVALID_PARAMS"; // Некоректні параметри
    if (error.code === -32603) return "INTERNAL_ERROR"; // Внутрішня помилка гаманця
    if (error.code === -32000) return "RESOURCE_UNAVAILABLE"; // Ресурс недоступний (зокрема, низький баланс)
  
    return null;
  }

  static identifyMetaMaskError(error) {
    if (error.code === 4001) return "USER_REJECTION";
    if (error.message && /wrong network|incorrect network/i.test(error.message))
      return "WRONG_NETWORK";
    if (error.message && /insufficient funds/i.test(error.message))
      return "INSUFFICIENT_FUNDS";
    if (
      error.message &&
      /failed to connect|connection error/i.test(error.message)
    )
      return "WALLET_CONNECTION_ERROR";
    return null;
  }

  static identifyViemError(error) {
    if (!error.message) return null;
    if (
      /contract call failed|invalid argument|timeout|transaction failed|invalid address/i.test(
        error.message
      )
    ) {
      if (/timeout/i.test(error.message)) return "TRANSACTION_TIMEOUT";
      if (/transaction failed/i.test(error.message))
        return "TRANSACTION_FAILED";
      if (/invalid address/i.test(error.message)) return "INVALID_ADDRESS";
      return "CONTRACT_CALL_ERROR";
    }
    return null;
  }

  static identifyAxiosError(error) {
    if (!error.isAxiosError) return null;
    if (error.code === "ECONNABORTED") return "AXIOS_TIMEOUT";
    if (!error.response) return "AXIOS_NETWORK_ERROR";
    if (error.response) return "AXIOS_RESPONSE_ERROR";
    return null;
  }

  static identifyCustomThrownError(error) {
    if (error instanceof Error) return "CUSTOM_THROWN_ERROR";
    return null;
  }

  static getErrorMessage(template, messageFromError) {
    let finalMessage = template;
    if (template.includes("{message}")) {
      finalMessage = finalMessage.replace(
        "{message}",
        messageFromError || "Деталі невідомі"
      );
    }
    if (template.includes("{statusText}") && messageFromError) {
      finalMessage = finalMessage.replace("{statusText}", messageFromError);
    }
    return finalMessage;
  }

  static showNotification(message) {
    // Використовуйте свою бібліотеку для нотіфікацій
    // Наприклад, Vue Toastification, Toastr, або будь-яку іншу
    // Приклад з використанням console.log:
    console.log("Notify user:", message);
  }

  static addErrorType(key, template, code) {
    errorRegistry[key] = { template, code };
  }
}

export default ErrorHandler;
