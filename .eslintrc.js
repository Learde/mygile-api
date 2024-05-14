module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: "2021",
        sourceType: "module",
    },
    env: {
        es2021: true,
    },
    extends: ["eslint:recommended"],
    rules: {
        "no-shadow": 0,
        "no-console": 0,
        "no-debugger": 0,
        "node/no-missing-import": 0,
    },
};
