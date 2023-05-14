/**
 * @fileoverview checks imports for fsd relative or absolute imports
 * @author Aleksandr Novikov
 */
"use strict";

const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "checks imports for fsd relative or absolute imports",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create(context) {

        return {
            ImportDeclaration(node) {
                context.getFilename();

                if (isAbsoluteImportShouldBeRelative(node.source.value, context.getFilename())) {
                    context.report({
                        node,
                        message: 'Import from the same slice should be relative',
                    })
                }

            }
        };
    },
};

function isImportPathRelative(importValue) {
    return importValue.startsWith('./') || importValue.startsWith('../') || importValue === '.'
}

const layers = {
    'entities': 'entities',
    'features': 'features',
    'widgets': 'widgets',
    'pages': 'pages',
    'app': 'app',
}

function isAbsoluteImportShouldBeRelative(importValue, currentFilePath) {
    if (isImportPathRelative(importValue)) {
        return false;
    }

    const importSlice = importValue.split('/')[1]
    const importLayer = importValue.split('/')[0]

    if (!importLayer || !importSlice || !layers[importLayer]) {
        return false;
    }

    const fileRelativePath = currentFilePath.split('src')[1];
    const fileLayer = fileRelativePath.split(path.sep)[1];
    const fileSlice = fileRelativePath.split(path.sep)[2];

    if (layers[fileLayer] && fileLayer === importLayer && fileSlice === importSlice) {
        return true;
    }

    return false
}
