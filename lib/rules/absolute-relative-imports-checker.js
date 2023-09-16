/**
 * @fileoverview checks imports for fsd relative or absolute imports
 * @author Aleksandr Novikov
 */
"use strict";

const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    // eslint-disable-next-line eslint-plugin/prefer-message-ids
    meta: {
        // eslint-disable-next-line eslint-plugin/require-meta-type
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "checks imports for fsd relative or absolute imports",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string'
                    }
                }
            }
        ], // Add a schema if the rule has options
    },

    create(context) {
        const alias = context.options[0]?.alias || '';
        return {
            ImportDeclaration(node) {
                context.getFilename();

                const importValue = node.source.value;
                const importTo = alias ? importValue.replace(`${alias}/`, '') : importValue;

                if (isAbsoluteImportShouldBeRelative(importTo, context.getFilename())) {
                    context.report({
                        node,
                        // eslint-disable-next-line eslint-plugin/prefer-message-ids
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
