const isImportPathRelative = require('../helpers/isImportRelative');
const path = require('path');
const micromatch = require('micromatch');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    // eslint-disable-next-line eslint-plugin/prefer-message-ids
    meta: {
        // eslint-disable-next-line eslint-plugin/require-meta-type
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "for fsd public imports",
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
                    },
                    ignoreImportPatterns: {
                        type: 'array',
                    }
                }
            }
        ],
    },

    create(context) {
        const { alias = '', ignoreImportPatterns = [] } = context.options[0] || {};

        return {
            ImportDeclaration(node) {
                const importValue = node.source.value;
                const importTo = alias ? importValue.replace(`${alias}/`, '') : importValue;

                if (isImportPathRelative(importTo)) {
                    return;
                }

                const isIgnore = ignoreImportPatterns.some((pattern) => (
                    micromatch.isMatch(importTo, pattern)
                ))

                if (isIgnore) {
                    return;
                }

                const checkingLayers = {
                    'entities': 'entities',
                    'features': 'features',
                    'widgets': 'widgets',
                    'pages': 'pages',
                    'shared': 'shared',
                }

                const layersOrder = {
                    'pages': ['widgets', 'features', 'entities', 'shared'],
                    'widgets': ['features', 'entities', 'shared'],
                    'features': ['entities', 'shared'],
                    'entities': ['entities', 'shared'],
                    'shared': ['shared'],
                }

                const importLayer = importTo.split('/')[0];

                if (!checkingLayers[importLayer]) {
                    return;
                }

                const currentFilePath = context.getFilename();
                const fileRelativePath = currentFilePath.split('src')[1];
                const fileLayer = fileRelativePath.split(path.sep)[1];

                if (layersOrder[fileLayer] && !layersOrder[fileLayer].includes(importLayer)) {
                    context.report({
                        node,
                        // eslint-disable-next-line eslint-plugin/prefer-message-ids
                        message: `Import should be from layers ${layersOrder[fileLayer].join(', ')}`,
                    })
                }

            }
        };
    },
};
