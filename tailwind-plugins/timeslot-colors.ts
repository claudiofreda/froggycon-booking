import plugin from "tailwindcss/plugin";
import { PluginAPI } from "tailwindcss/types/config";

export default plugin(({ addUtilities, theme, e }: PluginAPI) => {
  const colors = theme("colors") as Record<string, unknown>;
  const newUtilities: Record<string, Record<string, string>> = {};

  const getFgColor = (shade: string): "white" | "black" =>
    parseInt(shade, 10) >= 500 ? "white" : "black";

  Object.entries(colors).forEach(([family, shades]) => {
    if (typeof shades === "object" && shades !== null) {
      Object.entries(shades).forEach(([shade]) => {
        const fg = getFgColor(shade);
        const className = `.timeslot-${e(`${family}-${shade}`)}`;
        newUtilities[className] = {
          "--timeslot-bg": `theme("colors.${family}.${shade}")`,
          "--timeslot-fg": `theme("colors.${fg}")`,
        };
      });
    }
  });

  addUtilities(newUtilities);
});
