import { getRequestConfig } from "next-intl/server";
import config from "@/utils/config";

export default getRequestConfig(async () => {
  const { defaultLocale: locale } = config;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
