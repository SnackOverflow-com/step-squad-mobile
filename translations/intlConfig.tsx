import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { IntlProvider } from "react-intl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { messages, defaultLocale, SupportedLocale } from "./index";

// Context and hooks for managing the current locale
const LocaleContext = createContext<{
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}>({
  locale: defaultLocale,
  setLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

export const IntlProviderWrapper = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);

  // Load saved locale on startup
  useEffect(() => {
    (async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("userLocale");
        if (savedLocale && savedLocale in messages) {
          setLocale(savedLocale as SupportedLocale);
        }
      } catch (error) {
        console.error("Failed to load locale", error);
      }
    })();
  }, []);

  // Save locale when it changes
  const handleSetLocale = async (newLocale: SupportedLocale) => {
    try {
      await AsyncStorage.setItem("userLocale", newLocale);
      setLocale(newLocale);
    } catch (error) {
      console.error("Failed to save locale", error);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale={defaultLocale}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};
