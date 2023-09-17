/**
 * @fileoverview checks imports for fsd relative or absolute imports
 * @author Aleksandr Novikov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/absolute-relative-imports-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    }
});
ruleTester.run("absolute-relative-imports-checker", rule, {
  valid: [
    {
        filename: "C:/Users/Alexandr/OneDrive/Документы/Git/react-blog/src/entities/Article/ui/ArticleCard/ArticleCard.tsx",
        code: "import { Article, ArticleTextBlockType } from '../model/types/article';",
    },
  ],

    invalid: [
        {
            filename: "C:/Users/Alexandr/OneDrive/Документы/Git/react-blog/src/entities/Article/ui/ArticleCard/ArticleCard.tsx",
            code: "import { Article, ArticleTextBlockType } from 'entities/Article/model/types/article';",
            errors: [{ message: "Import from the same slice should be relative" }],
        },
        {
            filename: "C:/Users/Alexandr/OneDrive/Документы/Git/react-blog/src/entities/Article/ui/ArticleCard/ArticleCard.tsx",
            code: "import { Article, ArticleTextBlockType } from '@/entities/Article';",
            errors: [{ message: "Import from the same slice should be relative" }],
            options: [
                {
                    alias: '@',
                }
            ]
        },
    ],
});
