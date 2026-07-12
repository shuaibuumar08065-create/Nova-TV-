import { init, miniApp } from "@telegram-apps/sdk";

export function initTelegram() {
  try {
    init();

    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
    }

    if (miniApp.ready.isAvailable()) {
      miniApp.ready();
    }

    if (miniApp.expand.isAvailable()) {
      miniApp.expand();
    }

    return {
      isTelegram: true,
      initData: window.Telegram?.WebApp?.initData || "",
      initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe || {},
      user: window.Telegram?.WebApp?.initDataUnsafe?.user || null,
    };
  } catch (e) {
    console.log("Telegram not detected");
    return {
      isTelegram: false,
      initData: "",
      initDataUnsafe: {},
      user: null,
    };
  }
}
