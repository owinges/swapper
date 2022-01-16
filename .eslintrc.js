module.exports = {
    extends: [
        'react-app',
        'react-app/jest',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'variableLike',
                format: ['camelCase', 'PascalCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'memberLike',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'require',
            },
            {
                selector: 'variable',
                modifiers: ['const'],
                format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
        ],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: ['block-like', 'if', 'multiline-expression'], next: '*' },
            { blankLine: 'always', prev: '*', next: ['block-like', 'function', 'if', 'multiline-expression'] },
            { blankLine: 'always', prev: ['const', 'let'], next: 'expression' },
        ],
    },
};
