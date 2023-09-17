const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    }
});
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
        code: "import { Article, ArticleTextBlockType } from '@/entities/Article';",
        options: [
            {
                alias: '@',
            }
        ]
    },
  ],

  invalid: [
    {
        code: "import { Article, ArticleTextBlockType } from '@/entities/Article/model/types/article';",
        errors: [{ message: "Import should be from public api" }],
        options: [
            {
                alias: '@',
            }
        ]
    },
  ],
});
