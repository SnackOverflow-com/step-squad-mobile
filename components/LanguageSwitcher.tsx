import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useLocale } from "@/translations/intlConfig";
import { SupportedLocale } from "@/translations";
import { BaseText } from "@/components/ui";

const languages = [
  { code: "en", name: "English" },
  { code: "hr", name: "Hrvatski" },
];

/**
 * TEMPORARY LANGUAGE SWITCHER FOR TESTING PURPOSES
 */
const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language.code}
          style={[
            styles.button,
            locale === language.code && styles.activeButton,
          ]}
          onPress={() => setLocale(language.code as SupportedLocale)}
        >
          <BaseText
            size="xs"
            style={[styles.text, locale === language.code && styles.activeText]}
          >
            {language.name}
          </BaseText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginVertical: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  text: {
    color: "#333333",
  },
  activeText: {
    color: "#FFFFFF",
  },
});

export default LanguageSwitcher;
