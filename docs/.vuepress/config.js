module.exports = {
    locales: {
        '/': {
            lang: 'en-US',
            title: "GXChain Docs",
            description: "The Technical Docs of GXChain"
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'GXChain文档',
            description: 'GXChain技术文档'
        }
    },
    head: [
        ['link', {rel: 'icon', href: `/logo.png`}],
        ['link', {rel: 'manifest', href: '/manifest.json'}],
        ['meta', {name: 'theme-color', content: '#21a4e7'}],
        ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
        ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}],
        ['link', {rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png`}]
    ],
    serviceWorker: true,
    themeConfig: {
        repo: 'gxchain/docs',
        sidebarDepth: 5,
        editLinks: true,
        docsDir: 'docs',
        locales: {
            '/': {
                label: 'English',
                selectText: 'Languages',
                editLinkText: 'Edit this page on GitHub',
                lastUpdated: 'Last Updated',
                serviceWorker: {
                    updatePopup: {
                        message: "New content is available.",
                        buttonText: "Refresh"
                    }
                },
                nav: [
                    {
                        text: 'Guide',
                        link: '/guide/',
                    },
                    {
                        text: 'FAQs',
                        link: '/faq/',
                    },
                    {
                        text: 'Smart Contract',
                        items: [
                            {text: 'Quick Start', link: '/contract/quick_start'},
                            {text: 'Basic Types', link: '/contract/basic_types'},
                            {text: 'API References', link: '/contract/apis'},
                            {text: 'Examples', link: '/contract/examples'},
                        ]
                    },
                    {
                        text: 'Ecosystem',
                        items: [
                            {
                                text: 'DApps', items: [
                                    {text: 'Blockcity', link: 'https://blockcity.gxb.io/download'},
                                    {text: 'DES', link: '/zh/des/'},
                                    {text: 'BaaS Storage', link: '/zh/baas-api/'}
                                ]
                            },
                            {
                                text: 'Open Source',
                                items: [
                                    {text: 'Github', link: 'https://github.com/gxchain'},
                                    {text: 'Core(gxb-core)', link: 'https://github.com/gxchain/gxb-core'},
                                    {text: 'Smart Contract IDE(gxchain-alpha)', link: 'https://github.com/gxchain/gxchain-alpha'},
                                    {text: 'Light Wallet(gxchain-light)', link: 'https://github.com/gxchain/gxchain-light'},
                                    {text: 'Mobile Wallet(gxchain-wallet)', link: 'https://github.com/gxchain/gxchain-wallet'},
                                    {text: 'Explorer(gxchain-explorer)', link: 'https://github.com/gxchain/gxchain-explorer'},
                                ]
                            }
                        ]
                    }
                ],
                sidebar: {
                    '/guide/': genSidebarConfig ('guide', 'Guide'),
                    '/faq/': genSidebarConfig ('faq', 'FAQ'),
                    '/baas-api/': genSidebarConfig ('baas', 'BaaS Storage'),
                    '/des/': genSidebarConfig ('des', 'DES')
                }
            },
            '/zh/': {
                label: '简体中文',
                selectText: '选择语言',
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdated: '上次更新',
                serviceWorker: {
                    updatePopup: {
                        message: "发现新内容可用",
                        buttonText: "刷新"
                    }
                },
                nav: [
                    {
                        text: '指南',
                        link: '/zh/guide/',
                    },
                    {
                        text: '常见问题',
                        link: '/zh/faq/',
                    },
                    {
                        text: '智能合约',
                        link: '/zh/contract/'
                    },
                    {
                        text: '生态系统',
                        items: [
                            {
                                text: 'DApps', items: [
                                    {text: '布洛克城(Blockcity)', link: 'https://blockcity.gxb.io/download'},
                                    {text: '数据交换服务(DES)', link: '/zh/des/'},
                                    {text: '区块链存储(BaaS Storage)', link: '/zh/baas-api/'}
                                ]
                            },
                            {
                                text: '开源项目',
                                items: [
                                    {text: 'Github首页', link: 'https://github.com/gxchain'},
                                    {text: '主链核心(gxb-core)', link: 'https://github.com/gxchain/gxb-core'},
                                    {text: '智能合约IDE(gxchain-alpha)', link: 'https://github.com/gxchain/gxchain-alpha'},
                                    {text: '轻钱包(gxchain-light)', link: 'https://github.com/gxchain/gxchain-light'},
                                    {text: '手机钱包(gxchain-wallet)', link: 'https://github.com/gxchain/gxchain-wallet'},
                                    {text: '区块浏览器(gxchain-explorer)', link: 'https://github.com/gxchain/gxchain-explorer'},
                                ]
                            }
                        ]
                    }
                ],
                sidebar: {
                    '/zh/guide/': genSidebarConfig ('guide', '指南'),
                    '/zh/faq/': genSidebarConfig ('faq', '常见问题'),
                    '/zh/contract/': genSidebarConfig ('contract', '智能合约'),
                    '/zh/baas-api/': genSidebarConfig ('baas', 'BaaS存储'),
                    '/zh/des/': genSidebarConfig ('des', 'DES')
                }
            }
        }
    }
};

function genSidebarConfig (module, title) {
    if (module === 'guide') {
        return [
            {
                title,
                collapsable: false,
                children: [
                    '',
                    'clients',
                    'apis',
                    //'contract',
                    'testnet',
                    'private_chain',
                    'witness',
                    'asset'
                ]
            }
        ];
    }
    if (module === 'faq') {
        return [
            {
                title,
                collapsable: false,
                children: [
                    ''
                ]
            }
        ];
    }
    if (module === 'contract') {
        return [
            {
                title,
                collapsable: false,
                children: [
                    '',
                    'develop',
                    'deploy',
                    'debug',
                    'question'
                ]
            }
        ];
    }

    if(module === 'des'){
        return [
            {
                title,
                collapsable: false,
                children: [
                    '',
                    'architecture',
                    'interface'
                ]
            }
        ];
    }
    if (module === 'baas') {
        return [
            {
                title,
                collapsable: false,
                children: [
                    '',
                    'provider',
                    'store',
                    'data'
                ]
            }
        ];
    }
}
