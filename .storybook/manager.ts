import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "light",

    brandTitle: "Pivot Access UI",
    brandUrl: "https://www.pivotaccess.com",
    brandImage: "https://www.pivotaccess.com/img/logo.png",
  }),
});
