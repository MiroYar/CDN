

const data = [
    {
        name: 'Melina Albrecht',
        signature: 'Melina',
        prof: 'Founder, TingTong',
        text: 'Deployment ownership non-disclosure agreement vesting period crowdfunding success influencer partnership equity series A financing network effects user experience crowdsource. Burn rate stock bootstrapping direct mailing release client traction creative facebook monetization crowdfunding rockstar.',
        img: './img/clients/img01.jpg'
    },
    {
        name: 'Seylor Moon',
        signature: 'Seylor',
        prof: 'Moon',
        text: 'Deployment ownership non-disclosure agreement vesting period crowdfunding success influencer partnership equity series A financing network effects user experience crowdsource. Burn rate stock bootstrapping direct mailing release client traction creative facebook monetization crowdfunding rockstar.',
        img: './img/clients/img02.jpg'
    },
    {
        name: 'Papa Jonse',
        signature: 'Papa',
        prof: 'Wolcker',
        text: 'Deployment ownership non-disclosure agreement vesting period crowdfunding success influencer partnership equity series A financing network effects user experience crowdsource. Burn rate stock bootstrapping direct mailing release client traction creative facebook monetization crowdfunding rockstar.',
        img: './img/clients/img03.jpg'
    },
    {
        name: 'Super Man',
        signature: 'Super',
        prof: 'Heroy',
        text: 'Deployment ownership non-disclosure agreement vesting period crowdfunding success influencer partnership equity series A financing network effects user experience crowdsource. Burn rate stock bootstrapping direct mailing release client traction creative facebook monetization crowdfunding rockstar.',
        img: './img/clients/img04.jpg'
    },
    {
        name: 'Dunckan McClaud',
        signature: 'Dunckan',
        prof: 'Shreder',
        text: 'Deployment ownership non-disclosure agreement vesting period crowdfunding success influencer partnership equity series A financing network effects user experience crowdsource. Burn rate stock bootstrapping direct mailing release client traction creative facebook monetization crowdfunding rockstar.',
        img: './img/clients/img01.jpg'
    },
    {
        name: 'Call Bind',
        signature: 'Call',
        prof: 'JS Method',
        text: 'Deployment.',
        img: './img/clients/img02.jpg'
    }
]

new InfoPanel('.feedbackpanel', data, {
    updatedElem: {
        img: ['img'],
        text: ['name', 'signature', 'prof', 'text']
    },
    animMod: { comment: 'constriction', img: 'filter' },
    checkedMod: ['red', 'green', 'blue', 'orange']
}).init();
