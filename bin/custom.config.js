module.exports = {
    extends: 'lighthouse:default',
    settings: {
      'onlyCategories': [
        'performance',
        'accessibility',
        'best-practices',
        'seo',
        'pwa'
      ],
      'threshold-scores':{
        'performance':60,
        'accessibility':50,
        'best-practices':50,
        'seo':60,
        'pwa':50
      }
    },
    chromeOptions:{
      headless:true,
      sandboxing:false,
      showLogStatus:false
    },
    urls:[
      'https://www.twitter.com',
      'https://www.facebook.com',
      'https://www.qed42.com/blog'
    ]
  }