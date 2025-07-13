import antfu from "@antfu/eslint-config";

// 使用 antfu 配置
export default antfu({
  vue: {
    "vue/block-order": [
      "error",
      {
        // 块顺序
        order: ["script", "template", "style"],
      },
    ],
  },
  typescript: true,
  stylistic: {
    indent: 2, // 缩进
    semi: true, // 语句分号
    quotes: "single", // 单引号
  },
  rules: {
    "new-cap": ["off", { newIsCap: true, capIsNew: false }],
    "no-console": "off", // 忽略console
  },
  ignores: [
    "**/dist/**",
    "**/node_modules/**",
    "**/build/**",
    "**/lib/**",
    "**/es/**",
    "**/types/**",
    "**/public/**",
    "**/vite.config.ts",
    "**/eslint.config.js",
    "./*.cjs",
    "./*.js",
    "./package.json",
  ],
});
