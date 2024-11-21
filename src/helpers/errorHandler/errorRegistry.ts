// errorRegistry.js - Реєстр шаблонів помилок
export const errorRegistry = {
  // Загальні помилки
  GENERIC_ERROR: {
    template: "Щось пішло не так. Спробуйте пізніше.",
    code: 1000,
  },
  NETWORK_ERROR: {
    template: "Проблема з мережею. Перевірте підключення до Інтернету.",
    code: 1001,
  },
  AUTH_ERROR: {
    template: "Авторизація не вдалася. Будь ласка, увійдіть заново.",
    code: 1002,
  },
  CUSTOM_THROWN_ERROR: {
    template: "{message}", // Шаблон для помилок, створених через throw new Error
    code: 1003,
  },

  // Помилки MetaMask та Rabby
  USER_REJECTION: {
    template: "Користувач відхилив запит на транзакцію.",
    code: 2001,
  },
  WRONG_NETWORK: {
    template: "Будь ласка, підключіться до правильної мережі.",
    code: 2002,
  },
  INSUFFICIENT_FUNDS: {
    template: "Недостатньо коштів для виконання транзакції.",
    code: 2003,
  },
  WALLET_CONNECTION_ERROR: {
    template:
      "Не вдалося підключитися до гаманця. Перевірте підключення та спробуйте знову.",
    code: 2004,
  },

  // Помилки Viem
  CONTRACT_CALL_ERROR: {
    template:
      "Помилка виклику функції смарт-контракту. Перевірте параметри і спробуйте знову.",
    code: 3001,
  },
  TRANSACTION_TIMEOUT: {
    template:
      "Час очікування підтвердження транзакції закінчився. Будь ласка, спробуйте пізніше.",
    code: 3002,
  },
  TRANSACTION_FAILED: {
    template: "Транзакція не вдалася. Перевірте контракт і спробуйте знову.",
    code: 3003,
  },
  INVALID_ADDRESS: {
    template: "Неправильна адреса. Перевірте і спробуйте знову.",
    code: 3004,
  },

  // Помилки Axios
  AXIOS_NETWORK_ERROR: {
    template: "Помилка мережі при спробі з'єднання з сервером.",
    code: 4001,
  },
  AXIOS_TIMEOUT: {
    template: "Час запиту до сервера вичерпано.",
    code: 4002,
  },
  AXIOS_RESPONSE_ERROR: {
    template: "Сервер повернув помилкову відповідь: {statusText}.",
    code: 4003,
  },
  // Додавайте нові типи помилок тут
};
