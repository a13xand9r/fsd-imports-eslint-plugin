const isImportPathRelative = require('../helpers/isImportRelative');

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
                    }
                }
            }
        ],
    },

    create(context) {
        const alias = context.options[0]?.alias || '';
        return {
            ImportDeclaration(node) {
                const importValue = node.source.value;
                const importTo = alias ? importValue.replace(`${alias}/`, '') : importValue;

                if (isImportPathRelative(importTo)) {
                    return;
                }

                const checkingLayers = {
                    'entities': 'entities',
                    'features': 'features',
                    'widgets': 'widgets',
                    'pages': 'pages',
                    'app': 'app',
                }

                const importSegments = importTo.split('/');
                const isImportNotFromPublicApi = importSegments.length > 2;

                if (!checkingLayers[importSegments[0]]) {
                    return;
                }

                if (isImportNotFromPublicApi) {
                    context.report({
                        node,
                        // eslint-disable-next-line eslint-plugin/prefer-message-ids
                        message: 'Import should be from public api',
                    })
                }

            }
        };
    },
};
