const isImportPathRelative = require('../helpers/isImportRelative');

const PUBLIC_API_ERROR = 'PUBLIC_API_ERROR';

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
        fixable: 'code', // Or `code` or `whitespace`
        messages: {
            [PUBLIC_API_ERROR]: 'Import should be from public api',
        },
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
        const { alias = '' } = context.options[0] || {};

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
                }

                const importSegments = importTo.split('/');
                const isImportNotFromPublicApi = importSegments.length > 2;

                const layer = importSegments[0];
                const slice = importSegments[1];

                if (!checkingLayers[importSegments[0]]) {
                    return;
                }

                if (isImportNotFromPublicApi) {
                    context.report({
                        node,
                        messageId: PUBLIC_API_ERROR,
                        fix: (fixer) => {
                            return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
                        }
                    })
                }

            }
        };
    },
};
