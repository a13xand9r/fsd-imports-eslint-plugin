/**
 * @fileoverview checks imports order from different layers
 * @author Aleksandr
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
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
ruleTester.run("layer-imports", rule, {
    valid: [
        {
            filename: "C:/Users/Alexandr/OneDrive/Документы/Git/react-blog/src/entities/Article/ui/ArticleCard/ArticleCard.tsx",
            code: "import { Card, CardProps } from '@/shared/ui/Card';",
            options: [
                {
                    alias: '@',
                }
            ]
        },
        {
            filename: "C:/Users/Alexandr/OneDrive/Документы/Git/react-blog/src/entities/Article/ui/ArticleCard/ArticleCard.tsx",
            code: "import { Card, CardProps } from '@/entities/ui/Card';",
            options: [
                {
                    alias: '@',
                }
            ]
        },
        {
            filename: "C:/Users/Alexandr/OneDrive/Документы/Git/react-blog/src/entities/Article/ui/ArticleCard/ArticleCard.tsx",
            code: "import { StateSchema } from '@/app/store/StoreProvider';",
            options: [
                {
                    alias: '@',
                    ignoreImportPatterns: ['**/StoreProvider']
                }
            ]
        },
      ],

  invalid: [
    {
        filename: "C:/Users/Alexandr/OneDrive/Документы/Git/react-blog/src/entities/Article/ui/ArticleCard/ArticleCard.tsx",
        code: "import { Card, CardProps } from '@/features/ui/Card';",
        options: [
            {
                alias: '@',
            }
        ],
        errors: [{ message: "Import should be from layers entities, shared" }],
    },
  ],
});
