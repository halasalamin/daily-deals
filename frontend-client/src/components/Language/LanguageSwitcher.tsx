import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation(); 
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language).then(() => {
      localStorage.setItem("language", language);
      setSelectedLang(language);
    });
  };

  return (
    <div>
      {/* <label>{t("Language")}: </label> */}
      <select value={selectedLang} onChange={(e) => changeLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;