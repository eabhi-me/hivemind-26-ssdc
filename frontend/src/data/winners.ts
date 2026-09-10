export interface WinnerInfo {
  category: string;
  name: string;
  college: string;
  batchYear?: string;
  submissionLink?: string;
}

export interface SpecialMention {
  name: string;
  category?: string;
  submissionLink?: string;
}

export interface EventWinners {
  eventId: string;
  eventTitle: string;
  isPublished: boolean;
  winners?: WinnerInfo[];
  specialMentions?: SpecialMention[];
  allSubmissions?: string[];
  notes?: string;
}

export const WINNERS_DATA: Record<string, EventWinners> = {
  'bad-ui': {
    eventId: 'bad-ui',
    eventTitle: 'Bad UI',
    isPublished: true,
    winners: [
      { category: '1st Place Champion', name: 'Kamal Kant Gautam', college: 'SLIET', batchYear: '1st Year', submissionLink: '/badui/index - Kamal Kant Gautam.html' },
      { category: 'Runner Up', name: 'Vignesh Gopal', college: 'SLIET', batchYear: '2nd Year', submissionLink: '/badui/verification-portal - VIGNESH GOPAL.html' },
      { category: 'Most Creative', name: 'Shivam Kumar', college: 'SLIET', batchYear: '2nd Year', submissionLink: '/badui/construction-simulator - Shivam Kumar.html' },
      { category: 'Top Freshman', name: 'Dalip Prajapat', college: 'SLIET', batchYear: '1st Year', submissionLink: '/badui/hive_mind_BAD_UI_ultimate_version (1) - Dalip Prajapat.html' }
    ],
    specialMentions: [
      { name: 'Aditya Kumar', category: 'Honourable Mention', submissionLink: '/badui/hivenet-chaos-login - Aditya Kumar.html' },
      { name: 'Aman Babal', category: 'Honourable Mention', submissionLink: '/badui/Bad UI - Aman Babal.html' },
      { name: 'Ansh Raj', category: 'Honourable Mention', submissionLink: '/badui/index (10) - Ansh.html' },
      { name: 'Ashish Kumar', category: 'Honourable Mention', submissionLink: '/badui/index - Ashish Kumar.html' },
      { name: 'Balpreet Kaur', category: 'Honourable Mention', submissionLink: '/badui/badui10 - Balpreet Kaur.html' },
      { name: 'Debapriyo Mukhopadhyay', category: 'Honourable Mention', submissionLink: '/badui/index - Debapriyo Mukhopadhyay.html' },
      { name: 'Emon Ghosh', category: 'Honourable Mention', submissionLink: '/badui/bad-ui-dino-login__18_ - Emon Ghosh.html' },
      { name: 'Mahesh Patel', category: 'Honourable Mention', submissionLink: '/badui/index - Mash Talks.html' },
      { name: 'Manvir Singh', category: 'Honourable Mention', submissionLink: '/badui/HIVE_VERIFY_V4_FULL_VISUAL_CHAOS - MANVIR SINGH.html' },
      { name: 'Sai Subham Nayak', category: 'Honourable Mention', submissionLink: '/badui/captcha - Subhu.html' },
      { name: 'Sanit Arya', category: 'Honourable Mention', submissionLink: '/badui/BadUI - Sanit Tech.html' },
      { name: 'Shobhan Bain', category: 'Honourable Mention', submissionLink: '/badui/annoying_login - Shobhan Bain.html' },
      { name: 'Shubham Kumar', category: 'Honourable Mention', submissionLink: '/badui/AOT_BAD_UI_Challenge_v2 - SHUBHAM KUMAR.html' },
      { name: 'Snehil Bhattacharya', category: 'Honourable Mention', submissionLink: '/badui/Please do go to the end , it would be worth it - Snehil Bhattacharjee.html' },
      { name: 'Tajveer Singh Randhawa', category: 'Honourable Mention', submissionLink: '/badui/Internet That Refuses to Let you Login - Taj Randhawa.html' },
      { name: 'Tamanna', category: 'Honourable Mention', submissionLink: '/badui/captcha (1) - Tamanna.html' }
    ],
    allSubmissions: ["/badui/annoying-captcha - ANKUR.html","/badui/Annoying-ui - Aryan Saini.html","/badui/annoying_captcha - Hamraj Alam.html","/badui/annoying_login - Jai_shree Jai_shree.html","/badui/annoying_login - Shobhan Bain.html","/badui/anti_ux_login - Ashish.html","/badui/AOT_BAD_UI_Challenge_v2 - SHUBHAM KUMAR.html","/badui/Bad UI - Aman Babal.html","/badui/bad ui - Sahil Jaiswal.html","/badui/Bad UI-1 - Vlad Shrey.html","/badui/bad-ui - DIVYANSH GUPTA.html","/badui/bad-ui-dino-login__18_ - Emon Ghosh.html","/badui/badui - Harshit Kumar.html","/badui/badui - Raunak Maurya.html","/badui/BadUI - Sanit Tech.html","/badui/badui10 - Balpreet Kaur.html","/badui/Bad_UI - Aryan Kumar.html","/badui/BAD_UI - Raja Kumar.html","/badui/bad_ui_captcha - Gurshaan Singh.html","/badui/bad_ui_challenge - Mankirat Kaur.html","/badui/BAD_UI_Login_Page - Avinash Aryan.html","/badui/bad_ui_popup_ads_v2 - Antriksh Raj.html","/badui/basui - Anmol Sharma.html","/badui/bdui  - Dhiman Goswami.html","/badui/captcha (1) - Tamanna.html","/badui/Captcha - ISHNOORDEEP KAUR.html","/badui/captcha - Ronak Meena.html","/badui/captcha - Subhu.html","/badui/colourmatch - NotBeingAverage 2026.html","/badui/construction-simulator - Shivam Kumar.html","/badui/Document from Shilpy ❤️ - Shilpy Kumari.html","/badui/Final - Hrishik Karmakar.html","/badui/final23 - Kishan Verma.html","/badui/frustrating ui  - Ashutosh Raj.html","/badui/gngsjk - Anurag Singh.html","/badui/h8 - Aman Verma.docx","/badui/h8 - Aman Verma.html","/badui/hivenet-chaos-login - Aditya Kumar.html","/badui/hive_mind_BAD_UI_ultimate_version (1) - Dalip Prajapat.html","/badui/HIVE_VERIFY_V4_FULL_VISUAL_CHAOS - MANVIR SINGH.html","/badui/index (10) - Ansh.html","/badui/index (2) - Kidoo.html","/badui/index - ABHISHEK JAGAROTHIYA.html","/badui/index - Aditya Kumar.html","/badui/index - Arnav Vats.html","/badui/index - Ashish Kumar.html","/badui/index - Debapriyo Mukhopadhyay.html","/badui/index - Gautam Saini.html","/badui/index - Kamal Kant Gautam.html","/badui/index - Mash Talks.html","/badui/index - Priya Patel.docx","/badui/index - Priya Patel.html","/badui/index - smiling face.html","/badui/index3 - RAJ PRAKASH.html","/badui/Internet That Refuses to Let you Login - Taj Randhawa.html","/badui/job-portal-2007 - Shyam Natani.html","/badui/Lets try it - Rahul Kumawat.html","/badui/opposite-login-attractive (1) - RAJA KUMAR.html","/badui/Please do go to the end , it would be worth it - Snehil Bhattacharjee.html","/badui/popupBAD_UI - Astuti Singh.html","/badui/ragevault - Aman Kumar(1).docx","/badui/ragevault - Aman Kumar.docx","/badui/ragevault - Aman Kumar.html","/badui/sanskar_ui - Sanskar Raj.html","/badui/srui - Raunak Srivastava.html","/badui/The_Glitch_Capsule - Raunak Ranjan.html","/badui/true_bot (3) - NIRMAL KUMAR.html","/badui/verification-portal - VIGNESH GOPAL.html","/badui/Vishal(2641046) - Vishal Dangi.html","/badui/worst-login - Ayush Shukla.html","/badui/worst-login-page - Surajbhan.html","/badui/worstUieveR - Priyanshu Raj.html","/badui/worst_login (1) - Kk Pk.html","/badui/worst_login_page_v2 - Ayush singh.html"].filter(file => file.endsWith('.html')),
    notes: 'Incredible submissions! The Most Creative award goes to Shivam Kumar, and Top Freshman is Dalip Prajapat.',
  },
  'reverse-ai': {
    eventId: 'reverse-ai',
    eventTitle: 'Prompt Inversion',
    isPublished: false,
    winners: [
      { category: '1st Place Champion', name: 'To Be Announced', college: 'SLIET', batchYear: '2026' }
    ]
  },
  'pseudo-breach': {
    eventId: 'pseudo-breach',
    eventTitle: 'Pseudo-Breach',
    isPublished: false,
  },
  'mind-over-majority': {
    eventId: 'mind-over-majority',
    eventTitle: 'Mind Over Majority',
    isPublished: false,
  },
  'algo-arena': {
    eventId: 'algo-arena',
    eventTitle: 'Algo-Arena',
    isPublished: false,
  }
};
