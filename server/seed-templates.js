require('dotenv').config();
const { sequelize, Template, TemplateList, TemplateCard } = require('./models');

const TEMPLATES = [
  {
    name: 'Job Application Tracker',
    description: 'Track job opportunities from discovery to offer. Manage applications, interviews, and follow-ups in one place.',
    lists: [
      {
        title: 'Wishlist',
        cards: [
          { title: 'Frontend Developer – Stripe', description: 'Interesting fintech company. Focus on React + TypeScript.' },
          { title: 'Junior Full Stack – Shopify', description: 'Node.js backend role with React frontend.' },
        ],
      },
      {
        title: 'Applied',
        cards: [
          { title: 'Software Engineer – Airbnb', description: 'Applied via referral. Waiting for recruiter response.' },
          { title: 'Frontend Dev – Spotify', description: 'Submitted application via careers page.' },
        ],
      },
      {
        title: 'Interview Scheduled',
        cards: [
          { title: 'React Developer – Notion', description: 'Technical interview on March 10. Prepare system design basics.' },
        ],
      },
      {
        title: 'Final Interview',
        cards: [
          { title: 'Full Stack Dev – Revolut', description: 'Final round with CTO. Review project portfolio.' },
        ],
      },
      {
        title: 'Offer Received',
        cards: [
          { title: 'Frontend Engineer – Remote Startup', description: 'Offer: €55k + stock options.' },
        ],
      },
      {
        title: 'Rejected',
        cards: [
          { title: 'Backend Dev – Meta', description: 'Rejected after technical interview.' },
        ],
      },
    ],
  },
  {
    name: 'Startup Launch Roadmap',
    description: 'Plan and track the phases of launching a startup from idea validation to public launch.',
    lists: [
      {
        title: 'Idea & Validation',
        cards: [
          { title: 'Define target audience' },
          { title: 'Conduct 10 user interviews' },
          { title: 'Validate pain points' },
          { title: 'Research competitors' },
        ],
      },
      {
        title: 'MVP Development',
        cards: [
          { title: 'Setup project repository' },
          { title: 'Implement authentication' },
          { title: 'Build core feature #1' },
          { title: 'Setup database schema' },
          { title: 'Deploy staging environment' },
        ],
      },
      {
        title: 'Branding & Marketing',
        cards: [
          { title: 'Design logo' },
          { title: 'Create landing page' },
          { title: 'Setup email waitlist' },
          { title: 'Create social media accounts' },
        ],
      },
      {
        title: 'Beta Testing',
        cards: [
          { title: 'Invite 20 beta users' },
          { title: 'Collect feedback' },
          { title: 'Fix critical bugs' },
          { title: 'Improve onboarding UX' },
        ],
      },
      {
        title: 'Public Launch',
        cards: [
          { title: 'Publish on Product Hunt' },
          { title: 'Send launch email campaign' },
          { title: 'Announce on LinkedIn' },
          { title: 'Monitor analytics' },
        ],
      },
    ],
  },
  {
    name: 'Study Planner',
    description: 'Organize subjects, assignments, and exam preparation effectively.',
    lists: [
      {
        title: 'Subjects',
        cards: [
          { title: 'Data Structures' },
          { title: 'Algorithms' },
          { title: 'Databases' },
          { title: 'Web Development' },
        ],
      },
      {
        title: 'To Study',
        cards: [
          { title: 'Review binary trees' },
          { title: 'Practice sorting algorithms' },
          { title: 'Normalize database schemas' },
          { title: 'Study REST API principles' },
        ],
      },
      {
        title: 'In Progress',
        cards: [
          { title: 'Complete 3 LeetCode problems' },
          { title: 'Build small Express API' },
        ],
      },
      {
        title: 'Completed',
        cards: [
          { title: 'Finish JavaScript fundamentals' },
          { title: 'Review CSS Flexbox' },
        ],
      },
      {
        title: 'Exams / Deadlines',
        cards: [
          { title: 'Database midterm – March 22' },
          { title: 'Algorithms quiz – March 28' },
        ],
      },
    ],
  },
  {
    name: 'Content Creator Workflow',
    description: 'Manage content creation from idea generation to publishing and promotion.',
    lists: [
      {
        title: 'Ideas',
        cards: [
          { title: 'YouTube: "How I Built My Task Manager"' },
          { title: 'Instagram Reel: React Tips' },
          { title: 'Blog: Node.js Best Practices' },
        ],
      },
      {
        title: 'Script / Draft',
        cards: [
          { title: 'Write blog draft about authentication' },
          { title: 'Outline YouTube video structure' },
        ],
      },
      {
        title: 'Recording / Designing',
        cards: [
          { title: 'Record video intro' },
          { title: 'Design thumbnail' },
          { title: 'Create Instagram carousel' },
        ],
      },
      {
        title: 'Editing',
        cards: [
          { title: 'Edit YouTube video' },
          { title: 'Add subtitles' },
          { title: 'Optimize audio' },
        ],
      },
      {
        title: 'Scheduled / Published',
        cards: [
          { title: 'Publish blog post' },
          { title: 'Schedule Instagram reel' },
        ],
      },
    ],
  },
  {
    name: 'Personal Finance Tracker',
    description: 'Track income, expenses, savings goals, and investments in Danish Krone (DKK). Designed for professionals living in Denmark.',
    lists: [
      {
        title: 'Monthly Income',
        cards: [
          { title: 'Salary – 32,000 DKK', description: 'Monthly net salary from full-time employment.' },
          { title: 'Freelance Project – 8,500 DKK', description: 'Website development for local client.' },
          { title: 'SU / Side Income – 3,200 DKK', description: 'Student grant or part-time work income.' },
        ],
      },
      {
        title: 'Fixed Expenses',
        cards: [
          { title: 'Rent – 9,500 DKK', description: 'Apartment in Copenhagen.' },
          { title: 'Electricity & Heating – 900 DKK', description: 'Average monthly utility cost.' },
          { title: 'Internet – 299 DKK', description: 'Fiber broadband subscription.' },
          { title: 'Phone Plan – 199 DKK', description: '5G mobile plan.' },
          { title: 'Gym – 249 DKK', description: 'Fitness World membership.' },
          { title: 'Insurance – 650 DKK', description: 'Home + accident insurance.' },
        ],
      },
      {
        title: 'Variable Expenses',
        cards: [
          { title: 'Groceries – ~3,000 DKK', description: 'Monthly supermarket spending.' },
          { title: 'Eating Out – ~1,200 DKK', description: 'Restaurants and cafés.' },
          { title: 'Transportation – ~800 DKK', description: 'Rejsekort / fuel / bike maintenance.' },
          { title: 'Entertainment – ~1,000 DKK', description: 'Streaming, cinema, hobbies.' },
        ],
      },
      {
        title: 'Savings Goals',
        cards: [
          { title: 'Emergency Fund – 50,000 DKK', description: '3–6 months of living expenses.' },
          { title: 'New Laptop – 15,000 DKK', description: 'MacBook upgrade.' },
          { title: 'Vacation Fund – 12,000 DKK', description: 'Summer trip abroad.' },
          { title: 'Apartment Deposit – 40,000 DKK', description: 'Future housing upgrade.' },
        ],
      },
      {
        title: 'Investments',
        cards: [
          { title: 'ETF – S&P 500 (Nordnet)', description: 'Long-term monthly investment.' },
          { title: 'Danish Pension (ATP + Private)', description: 'Mandatory and voluntary retirement savings.' },
          { title: 'Aktiesparekonto', description: 'Tax-advantaged stock investment account.' },
          { title: 'Crypto Portfolio', description: 'Long-term high-risk allocation.' },
        ],
      },
    ],
  },
];

async function seed() {
  await sequelize.authenticate();
  console.log('DB connected.');

  for (const templateData of TEMPLATES) {
    // Upsert by name among system templates (userId: null)
    let template = await Template.findOne({ where: { name: templateData.name, userId: null } });
    if (template) {
      console.log(`Template "${template.name}" already exists (id=${template.id}). Re-seeding lists...`);
      const existingLists = await TemplateList.findAll({ where: { templateId: template.id } });
      for (const l of existingLists) await l.destroy();
    } else {
      template = await Template.create({
        name: templateData.name,
        description: templateData.description,
        isPublic: true,
        userId: null,
      });
      console.log(`Created template "${template.name}" (id=${template.id}).`);
    }

    for (let li = 0; li < templateData.lists.length; li++) {
      const listData = templateData.lists[li];
      const list = await TemplateList.create({ title: listData.title, position: li, templateId: template.id });

      for (let ci = 0; ci < listData.cards.length; ci++) {
        const { title, description } = listData.cards[ci];
        await TemplateCard.create({
          title,
          description: description || null,
          position: ci,
          templateListId: list.id,
        });
      }
    }

    console.log(`  Seeded "${template.name}" (${templateData.lists.length} lists)`);
  }

  console.log(`\nDone! Seeded ${TEMPLATES.length} system templates.`);
  await sequelize.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
