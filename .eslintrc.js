module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  plugins: [
    'react',
  ],
  "rules": {
    "react/prefer-stateless-function": "off",
    "react/jsx-filename-extension": "off",
    "react/jsx-props-no-spreading": "off",
    "react/prop-types": "off",
    "react/state-in-constructor": "off",
    "no-tabs": "off",
    "no-mixed-spaces-and-tabs": "off",
    "react/no-access-state-in-setstate": "off",
    "react/jsx-indent": "off",
    "react/jsx-indent-props": "off",
    "no-shadow": "off",
    "react/jsx-wrap-multilines": "off",
    "react/no-did-update-set-state": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "no-nested-ternary": "off",
    "operator-linebreak": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "max-classes-per-file": "off",
    "react/no-array-index-key": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "max-len": "off",
    "import/prefer-default-export": "off",
    "no-unused-expressions": "off"
  }
};
