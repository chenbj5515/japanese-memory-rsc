export default {
  common: {
    language: 'Language',
    login: 'Login',
    signup: 'Sign Up',
    guide: 'Guide',
    pricing: 'Pricing',
    contact: 'Contact',
    footer: {
      copyright: 'Bunn © 2025',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      businessDisclosure: 'Specified Commercial Transaction Act'
    }
  },
  home: {
    title: 'Learn Japanese with AI',
    subtitle: 'Master Japanese through personalized AI conversations',
    startLearning: 'Start Learning',
    features: 'Features',
    personalJourney: 'Your Personal Japanese Learning Journey',
    stopScattering: 'Stop learning Japanese in a scattered way. Learn sentence by sentence with shadow reading, review, and one-click context recovery. Learn Japanese elegantly with Bunn.',
    bunnWillHeloYou: ' ',
    getStartedFree: 'Get Started Free',
    cards: {
      memoCard: {
        title: 'Memory Cards',
        description: 'Translation, pronunciation, shadow reading and dictation - all in one card.'
      },
      wordCard: {
        title: 'Word Cards',
        description: 'Remember which sentence a word appeared in, just click to check if you forget.'
      },
      exam: {
        title: 'Exam Mode',
        description: 'Test your knowledge mastery to ensure you truly understand what you\'ve learned.'
      },
      dailyReport: {
        title: 'Daily Report',
        description: '5 minutes before bed to review forgotten content and maintain learning progress.'
      }
    }
  },
  guide: {
    title: 'Bunn Design Philosophy',
    subtitle: 'Sentences, Review and Context',
    preface: {
      title: 'Preface',
      challenge: 'Language learning has always been a significant challenge. While mastering one or multiple languages can open up many career opportunities and life experiences, most people find it truly difficult to master a language.',
      aiEra: 'With the advent of AI, language learning efficiency has greatly improved. Various tools are much better compared to the pre-AI era, but I\'ve noticed that current tools might only excel at one aspect without addressing the entire learning process, lacking core principles and design.',
      bestProcess: 'So, what is theoretically the best learning process? No one can really answer this question because there will always be better processes. However, in my view, there are several strong logical principles that must hold true:',
      principles: [
        'Learn by sentences rather than individual words',
        'Review should be the core action',
        'Context recreation, recalling the scene where sentences appeared',
        'Streamlined process without distracting non-core features'
      ],
      creation: 'I couldn\'t find any software in the market that adheres to these basic principles, so I created Bunn. Bunn\'s design is centered around these points, aiming to create an elegant and complete language learning system.'
    },
    core: {
      title: 'Making Sentences the Core',
      description: 'It\'s now widely accepted that learning language through sentences is far more efficient than learning through individual words.',
      gap: 'Unfortunately, there\'s a lack of language learning tools truly built around sentences. While there are many excellent language learning applications, none provide a complete, elegant, and efficient learning process.',
      origin: 'That\'s why I created Bunn, which means "sentence" in Japanese. Bunn\'s core approach is reviewing sentences with context.',
      features: 'After entering a sentence, you immediately get accurate translations and kana annotations, practice shadow reading, and do dictation. You can also highlight unfamiliar words to add them to your vocabulary list, establishing connections between words and their usage contexts.',
      inputMethods: 'Generally, you have three ways to input sentences:',
      methods: {
        subtitles: 'Get subtitle phrases from YouTube/Netflix videos',
        copy: 'Directly copy Japanese sentences from websites',
        picture: 'In the future, Bunn will support image recognition, allowing you to upload images containing Japanese text, with Bunn identifying all Japanese sentences for you to select which ones to upload.'
      },
      future: 'In the future, we\'ll also support image input, allowing you to upload images containing Japanese text. Bunn will identify all Japanese sentences and let you choose which ones to review.',
      demo: {
        intro: 'Here\'s how a sentence memory card looks:',
        shadow: 'Shadow Reading - Repeat after the audio to improve pronunciation',
        dictation: 'Dictation - Test if you can roughly remember the sentence'
      }
    },
    review: {
      title: 'Review Like Browsing a Collection',
      description: 'Another core logic of Bunn is review. We all know repetition is necessary for memory, but often we\'re reluctant to review what we\'ve learned.',
      reason: 'A key reason for this reluctance is that it\'s not engaging enough - your recorded content lacks interactivity and context, or the platform distracts you with other new content.',
      solution: 'These issues don\'t exist in Bunn. Bunn won\'t push any distracting content - everything is what you\'ve input yourself, like anime you\'ve watched, technical articles you\'ve read, or interesting news you\'ve seen. This ensures you\'re interested in or at least genuinely care about the content you\'re reviewing.',
      interaction: 'Plus, you can interact with each sentence - view context, practice shadow reading, and do dictation. These interactive actions make reviewing as engaging as browsing through your personal collection.'
    },
    context: {
      title: "Context Recreation",
      intro: "Think about how we mastered our native language. Many of us often mentally simulate scenarios - what we would say to others and how they might respond. The language used in these scenarios is what we absolutely remember.",
      importance: "While it's hard to remember language elements in isolation, it's easy to remember contexts. Once we grasp the connection between context and expressions, we're more likely to remember those expressions. Sentences provide context for words, and sentences themselves exist within larger contexts.",
      feature: "Bunn offers a browser extension to help you record sentence contexts and provides one-click context recovery for scene recreation, helping you create your personalized memory experience."
    },
    getStarted: {
      title: 'How to Get Japanese Sentences with Context',
      intro: 'While you\'re free to choose your sentence sources, I strongly recommend trying this workflow:',
      steps: {
        extension: {
          title: '1. Download the Extension',
          description: 'Install <link>our Chrome extension</link> from the Chrome Web Store'
        },
        videos: {
          title: '2. Find Videos You Like',
          description: 'Choose videos from YouTube or Netflix. For YouTube videos, select ones with built-in subtitles (avoid YouTube\'s subtitle feature as its sentence breaks are usually poor and don\'t align with our sentence-centered approach).'
        },
        copy: {
          title: '3. Copy Subtitles',
          description: 'Press cmd+shift+c and wait for the subtitles to be copied to your clipboard.'
        },
        paste: {
          title: '4. Paste to Bunn',
          description: 'Return to the <link>Bunn app</link> and paste into the input box at the bottom.'
        }
      },
      review: 'When reviewing, you can click the <button>button</button> in the top right of each card to instantly return to the original context and pronunciation. This feature helps you better understand how the sentence is used in its original context and ensures you practice accurate pronunciation.',
      clickMe: 'Click me!',
      recommendation: {
        intro: 'I personally recommend <channel>Mary\'s YouTube channel</channel> for these reasons:',
        reasons: [
          'Perfect sentence breaks with built-in subtitles',
          'Seamless shadow reading experience when used with our extension and app',
          'Modern, practical Japanese that you can use in daily life',
          'Content interesting enough to make learning enjoyable'
        ]
      },
      netflix: 'Of course, if you prefer anime, you can find Japanese anime with Japanese subtitles on Netflix. Netflix\'s subtitle feature provides natural sentence breaks that work perfectly with Bunn\'s workflow.',
      websiteCopy: 'When copying text from websites, press the "c" key twice after selecting text to record both the website URL and scroll position in your clipboard. When pasted into the Bunn app, it will look like this:'
    },
    remember: {
      title: 'What If I Can\'t Remember What I\'ve Learned?',
      normal: 'First, forgetting is completely normal. Everyone forgets a large portion of what they learn - that\'s just how our brains work.',
      key: 'The key is to be selective: only input sentences you find interesting or important. If you truly find certain content interesting or important, you\'ll naturally be more willing to spend time on:',
      methods: [
        'Shadow reading',
        'Dictation practice',
        'Recalling sentences from keywords',
        'Taking tests',
        'Reviewing daily learning reports'
      ],
      conclusion: 'When you engage with learning materials in these multiple ways, you\'ll find you can remember a large portion of what you\'ve learned. The Bunn system is designed to support this multi-faceted approach to learning, making retention more effective than traditional methods.'
    },
    why: {
      title: 'Why Choose Bunn?',
      sections: {
        built: {
          title: 'Built by a Real Language Learner',
          description: 'Bunn was created by a developer who is learning Japanese and living in Japan. This means the app is designed based on real understanding of language learning challenges and needs.'
        },
        serious: {
          title: 'A Serious Learning System',
          description: 'Unlike many language apps that focus on gamification and entertainment, Bunn is a serious learning tool built on solid design principles and effective learning methods.'
        },
        workflow: {
          title: 'Clear and Efficient Workflow',
          description: 'We\'ve designed a unique, streamlined learning process that eliminates unnecessary complexity. Every feature serves a clear purpose in your language learning journey.'
        }
      },
      explore: 'Start exploring <link>Bunn</link> now!'
    }
  },
  pricing: {
    title: 'Pricing Plans',
    monthly: 'Monthly',
    yearly: 'Yearly',
    free: 'Free',
    pro: 'Pro',
    freePlan: {
      title: 'Free Plan',
      description: 'Basic features for casual users',
      price: '¥0 / month',
      features: {
        sentences: '20 sentences per day',
        words: '20 words per day', 
        subtitle: '10 OCR scans per day',
        webTranslation: '20 web translations per day'
      },
      currentPlan: 'Current Plan'
    },
    proPlan: {
      title: 'Pro Plan',
      description: 'Unlimited access and premium features',
      price: '¥35 / month',
      features: {
        sentences: 'Unlimited sentences',
        words: 'Unlimited words',
        subtitle: 'Unlimited OCR scans',
        webTranslation: 'Unlimited web translations'
      },
      upgrade: 'Upgrade Now'
    }
  },
  login: {
    welcome: 'Welcome Back',
    description: 'Sign in with GitHub or Google',
    loginWithGithub: 'Sign in with GitHub',
    loginWithGoogle: 'Sign in with Google',
    agreement: {
      prefix: 'By continuing, you agree to our',
      terms: 'Terms of Service',
      and: 'and',
      privacy: 'Privacy Policy',
      suffix: '.'
    }
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Bunn Terms of Service',
    lastUpdated: 'Last Updated',
    welcome: 'Welcome, and thank you for your interest in Bunn. These Terms of Service (including Bunn\'s Privacy Policy) constitute a legally binding contract between you and Bunn regarding your use of the Service.',
    sections: {
      read: {
        title: 'Please Read These Terms Carefully:',
        description: 'By using our service, you acknowledge that you have read and understood, and agree to be bound by these Terms of Service as a condition of using the service. If you do not agree to these terms, you have no right to use the service.'
      },
      info: {
        title: '1. Information Collection',
        description1: 'When you log in through Google or GitHub, we collect the following information: username, email address, user ID, and profile picture. This information is used solely for authentication purposes and sending product-related communications.',
        description2: 'We also store the sentences you upload and record your actions within the application. These are fundamental components of our service functionality and are used solely to provide the service.',
        description3: 'All information we collect is used only to provide the service and is not shared with third parties or used for model training purposes.',
        description4: 'For more details about how we handle your information, please refer to our Privacy Policy.',
        description5: 'You can request termination of your account by contacting our customer support team. After terminating your user account, we will immediately and permanently delete all personally identifiable information you provided to us (including your account information), though we may retain non-personally identifiable demographic information, data we collected during your use of the service, and your user content for as long as we deem appropriate.'
      },
      license: {
        title: '2. Service Usage License',
        description1: 'Unless otherwise stated, we or our licensors own the intellectual property rights in the service and service content. You may only use the service and service content for personal language learning, subject to the restrictions set out in these terms and other limitations.',
        description2: 'You may not copy, redistribute, sell, rent, sublicense, publicly display, publicly perform, provide, modify, transmit, or otherwise exploit the service content outside of the service, whether for commercial purposes or not. If we specifically allow use of service content outside the service, such use requires adherence to additional licensing.',
        description3: 'You must not use the service in any way that causes, or may cause, damage to our website or impairment of the availability or accessibility of the service; or in any way which is unlawful, fraudulent or harmful, or in connection with any unlawful, fraudulent or harmful purpose or activity.',
        description4: 'You must not use the service to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.',
        description5: 'You must not conduct any systematic or automated data collection activities on or in relation to the service without our express written consent.',
        description6: 'You must not use the service to transmit or send unsolicited commercial communications. "Bunn" and all other trademarks, service marks, graphics and logos used in connection with the service (collectively, "Marks") are trademarks or service marks of Bunn or their respective owners, some of which may be registered. Nothing in these terms grants you any right to copy or otherwise use these Marks.'
      },
      content: {
        title: '3. User Generated Content',
        description1: 'In these terms, "your user content" means material (including without limitation text, images, audio material, video material, and audio-visual material) that you submit to the service, for whatever purpose.',
        userContent: {
          title: 'User Content',
          description: 'All content you upload or provide to this service (including but not limited to text, images, audio, etc.) remains your property. This service will not use your content for commercial purposes or make it available to other users.'
        },
        licenseGrant: {
          title: 'License Grant',
          description: 'You grant us a non-exclusive, worldwide, royalty-free license solely for storing, processing, and providing the service. This license terminates when you delete your content or account.'
        },
        contentDeletion: {
          title: 'Content Deletion',
          description: 'You can delete your content at any time, or delete all data through account management. We will delete the relevant data within a reasonable timeframe, though there may be brief storage delays due to technical reasons such as backups.'
        },
        description2: 'Your user content must not be illegal or unlawful, must not infringe any third party\'s legal rights, and must not be capable of giving rise to legal action against you, us, or a third party (in each case under any applicable law).',
        description3: 'You must not submit any user content that is or has been the subject of any threatened or actual legal proceedings or other similar complaint.'
      },
      payment: {
        title: '4. Payment and Refunds',
        description1: 'You can cancel your subscription at any time. After cancellation, you can continue using the service until the end of the current month, but refunds are not allowed.',
        description2: 'All paid plans require a valid credit card. Free accounts do not require a credit card number.',
        description3: 'Upgrading from the free plan to any paid plan will result in immediate billing.',
        description4: 'Service fees are charged monthly or annually in advance. We do not provide refunds or credits for partial months of service, upgrades/downgrades, or unused months.',
        description5: 'All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties, excluding only United States (federal or state) taxes.',
        description6: 'Downgrading your service may cause the loss of features or capacity of your account. Bunn does not accept any liability for such loss.'
      },
      changes: {
        title: '5. Changes to Terms',
        description1: 'We may modify these terms from time to time. Modified terms will apply to your use of the service from the date the modified terms are posted on our website, or from such later date as may be specified in the modified terms.',
        description2: 'If we modify these terms, we will notify you (for example by email or when you next use the service). If you do not agree to the modified terms, you may request termination of your user account.'
      },
      agreement: {
        title: '6. Entire Agreement',
        description: 'These terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding your use of the service and supersede all prior agreements regarding your use of the service.'
      },
      thirdParty: {
        title: '7. Exclusion of Third Party Rights',
        description: 'These terms are for the benefit of you and us and are not intended to benefit any third party or be enforceable by any third party. The exercise of our and your rights in relation to these terms is not subject to the consent of any third party.'
      },
      contact: {
        title: '8. Contact Us',
        description: 'If you have any questions about these Terms of Service, please contact us'
      }
    }
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Bunn Privacy Policy',
    lastUpdated: 'Last Updated',
    welcome: 'Welcome, and thank you for your interest in Bunn. This Privacy Policy outlines how we collect, use, and protect your information when you use our services.',
    sections: {
      read: {
        title: 'Please Read These Privacy Terms Carefully:',
        description: 'By using our services, you agree to the collection and use of your information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.'
      },
      collect: {
        title: '1. Information We Collect',
        description: 'When you log in through Google or GitHub, we collect the following information:',
        items: [
          'Username',
          'Email address',
          'User ID',
          'Profile picture'
        ]
      },
      how: {
        title: '2. How We Collect Information',
        description: 'We collect this information when you authenticate through Google or GitHub to use our services. This information is provided directly to us from these platforms with your consent during the login process.'
      },
      use: {
        title: '3. How We Use Your Information',
        description: 'We use the collected information to:',
        items: [
          'Provide and maintain our login services',
          'Provide relevant product advertising',
          'Improve and personalize your service experience',
          'Communicate with you about our services'
        ]
      },
      share: {
        title: '4. Information Sharing',
        description: 'We do not share your personal information with third parties unless necessary for providing services or required by law.'
      },
      storage: {
        title: '5. Data Storage and Security',
        description: 'We take appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.'
      },
      rights: {
        title: '6. Your Rights',
        description: 'You have the following rights regarding your personal information:',
        items: [
          'Access your personal information',
          'Correct inaccurate information',
          'Request deletion of your information',
          'Object to processing of your information',
          'Data portability'
        ],
        contact: 'To exercise these rights, please contact us using the information provided below.'
      },
      cookies: {
        title: '7. Cookie Policy',
        description: 'Our website only uses cookies to store login information to ensure your session security. We do not use cookies for advertising tracking or analytics purposes. These cookies are necessary for providing a secure browsing experience on our website.'
      },
      changes: {
        title: '8. Changes to This Privacy Policy',
        description: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We recommend reviewing this Privacy Policy periodically for any changes.'
      },
      contact: {
        title: '9. Contact Us',
        description: 'If you have any questions about this Privacy Policy, please contact us'
      }
    }
  },
  LoginedHeader: {
    membershipPlan: "Membership Plan",
    expiryDate: "Expiry Date",
    subscriptionManagement: "Subscription Management",
    logout: "Logout",
    latest: "Latest",
    random: "Random",
    wordCards: "Word Cards",
    exam: "Exam",
    dailyReport: "Daily Report",
    memoCards: "Memory Cards"
  },
  memoCards: {
    noDataFound: 'Please enter Japanese text you\'re interested in',
    importSampleData: 'Import Sample Data',
    inputPlaceholder: "Enter the Japanese sentence you want to learn",
    limitMessage: "You've reached today's limit of 20 sentences. Upgrade to",
    demoTranslation1: "It's too boring to ask that.",
    demoTranslation2: "Are you saying I should distort facts based on personal feelings?",
    demoTranslation3: "The rumor about Fukuoka having many beautiful women is no longer just a legend - it's now considered a fact.",
    whereToGetSentence: 'Where can I get Japanese sentences?'
  },
  wordCards: {
    demoMeaning: "distort, misinterpret"
  },
  exam: {
    title: 'Exam',
    submit: 'Submit',
    translation_reading: 'Translation & Reading',
    translation_to_japanese: 'Japanese Translation',
    listening: 'Listening Questions',
    enter_hiragana: 'Please enter hiragana',
    enter_with_user_mother_tongue: 'Please enter in English',
    enter_japanese: 'Please enter in Japanese',
    question: 'Question',
    play_audio: 'Play Audio',
    fix_answer: 'Fix Answer',
    fix_confirm: {
      title: 'Confirm Fix',
      description: 'Are you sure you want to mark this answer as correct?',
      confirm: 'Confirm',
      cancel: 'Cancel'
    },
    start: 'Start New Test',
    history: 'Test History',
    cannotStart: 'Cannot Start Test',
    insufficientData: 'Insufficient data. Please enter enough Japanese sentences before starting a test.',
    score: "Score",
    duration: "Test Duration",
    minutes: "minutes",
    correct: "Correct!",
    reference_answer: "Reference answer: {answer}"
  },
  dailyReport: {
    history: {
      title: 'Learning Report History',
    },
    sentences: 'Sentences',
    words: 'Words',
    test: 'Test',
    noRecord: 'No learning records today. Want to review some recently learned sentences?',
    startReview: 'Start Review',
    forgotMeaning: 'You forgot the meaning of "{word}", do you remember it now?',
    forgotPronunciation: 'You forgot the pronunciation of "{word}", do you remember it now?',
    forgotExpression: 'You forgot how to express "{meaning}" in Japanese, do you remember it now?',
    unableToUnderstand: 'You couldn\'t understand this sentence, can you understand it now after listening again?',
    completion: {
      congratulations: 'Congratulations!',
      message: 'You\'ve cleared all the knowledge points you found yourself forgetting today.\nKeep up this pace!'
    }
  }
} as const; 