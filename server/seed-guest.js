require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Board, List, Card, Label, CardLabel } = require('./models');

const GUEST_EMAIL = 'guest@frello.demo';
const GUEST_PASSWORD = 'guest1234';
const GUEST_NAME = 'Guest User';

const BOARDS = [
  {
    title: 'Product Roadmap',
    description: 'High-level feature planning and prioritization across quarters.',
    labels: [
      { name: 'Feature', color: '#4CAF50' },
      { name: 'Bug', color: '#F44336' },
      { name: 'Research', color: '#9C27B0' },
      { name: 'Design', color: '#2196F3' },
    ],
    lists: [
      {
        title: 'Backlog',
        cards: [
          { title: 'Dark mode support', description: 'Add a system-aware dark/light mode toggle using CSS variables.', priority: 'medium' },
          { title: 'Mobile app (iOS & Android)', description: 'Evaluate React Native vs native Swift/Kotlin for the mobile client.', priority: 'low' },
          { title: 'Two-factor authentication', description: 'Implement TOTP-based 2FA for user accounts.', priority: 'high' },
          { title: 'Board sharing & collaboration', description: 'Allow users to invite team members to a board with role-based permissions.', priority: 'high' },
          { title: 'CSV export', description: 'Export cards and board data to CSV for reporting.', priority: 'low' },
        ],
      },
      {
        title: 'In Progress',
        cards: [
          { title: 'Drag-and-drop card reordering', description: 'Implement smooth DnD across lists using @dnd-kit.', priority: 'high', isCompleted: false },
          { title: 'Label filtering', description: 'Filter cards by one or more labels on the board view.', priority: 'medium' },
          { title: 'Due date reminders', description: 'Email and in-app notifications for upcoming due dates.', priority: 'medium' },
        ],
      },
      {
        title: 'In Review',
        cards: [
          { title: 'Markdown in card descriptions', description: 'Render markdown in card descriptions using a lightweight parser.', priority: 'medium' },
          { title: 'Card cover images', description: 'Allow users to set a cover colour or image on a card.', priority: 'low' },
        ],
      },
      {
        title: 'Done',
        cards: [
          { title: 'JWT authentication', description: 'Secure API with JWT tokens, 2-hour expiry.', priority: 'high', isCompleted: true },
          { title: 'PostgreSQL + Sequelize ORM', description: 'Set up production-ready DB with migrations.', priority: 'high', isCompleted: true },
          { title: 'REST API — boards, lists, cards', description: 'Full CRUD for all core entities.', priority: 'high', isCompleted: true },
          { title: 'Responsive layout', description: 'Mobile-first responsive design across dashboard and board views.', priority: 'medium', isCompleted: true },
        ],
      },
    ],
  },
  {
    title: 'Sprint 12 — June 2026',
    description: 'Two-week sprint focusing on performance and UX polish.',
    labels: [
      { name: 'Frontend', color: '#03A9F4' },
      { name: 'Backend', color: '#FF9800' },
      { name: 'Bug', color: '#F44336' },
      { name: 'Polish', color: '#8BC34A' },
    ],
    lists: [
      {
        title: 'To Do',
        cards: [
          { title: 'Fix card position drift on DnD', description: 'Cards occasionally snap to wrong position after a cross-list drag. Reproduce: move card from list 1 to list 3 rapidly.', priority: 'urgent' },
          { title: 'Skeleton loading screens', description: 'Replace spinners with content-aware skeleton loaders on the board view.', priority: 'medium' },
          { title: 'Optimistic UI for card moves', description: 'Update UI immediately on drag-drop, roll back on server error.', priority: 'high' },
          { title: 'Add pagination to board list', description: 'Dashboard slows down when a user has > 20 boards.', priority: 'medium' },
        ],
      },
      {
        title: 'In Progress',
        cards: [
          { title: 'Reduce bundle size', description: 'Tree-shake unused components. Target: < 200 kB gzipped.', priority: 'medium' },
          { title: 'API response time audit', description: 'Profile slow endpoints with pg-query-stats, add missing indexes.', priority: 'high' },
        ],
      },
      {
        title: 'QA / Testing',
        cards: [
          { title: 'Cross-browser test suite', description: 'Run Playwright tests on Chrome, Firefox, Safari.', priority: 'medium' },
          { title: 'Accessibility audit', description: 'WCAG 2.1 AA audit using axe-core. Fix critical violations.', priority: 'high' },
        ],
      },
      {
        title: 'Done',
        cards: [
          { title: 'Fix SSL cert renewal cron', description: 'Let\'s Encrypt renewal was silently failing. Added monitoring alert.', priority: 'urgent', isCompleted: true },
          { title: 'Update node to v22 LTS', description: 'Bumped runtime in Dockerfile and CI matrix.', priority: 'low', isCompleted: true },
          { title: 'Fix npm audit vulnerabilities', description: 'Resolved 3 high-severity CVEs in frontend deps.', priority: 'high', isCompleted: true },
        ],
      },
    ],
  },
  {
    title: 'Job Search Tracker',
    description: 'Personal board to track applications, interviews, and offers.',
    labels: [
      { name: 'Applied', color: '#607D8B' },
      { name: 'Interview', color: '#FF9800' },
      { name: 'Offer', color: '#4CAF50' },
      { name: 'Rejected', color: '#F44336' },
    ],
    lists: [
      {
        title: 'Wishlist',
        cards: [
          { title: 'Stripe — Software Engineer', description: 'Full-stack role on the Dashboard team. Requires 3+ yrs React experience.', priority: 'high' },
          { title: 'Vercel — DX Engineer', description: 'Developer experience role. Open source background preferred.', priority: 'high' },
          { title: 'Linear — Product Engineer', description: 'Small team, high impact. Design sensibility required.', priority: 'medium' },
        ],
      },
      {
        title: 'Applied',
        cards: [
          { title: 'Notion — Frontend Engineer', description: 'Applied via referral. Role focuses on editor performance.', priority: 'high' },
          { title: 'Figma — Software Engineer II', description: 'Applied through careers page. Awaiting initial screen.', priority: 'medium' },
        ],
      },
      {
        title: 'Interviewing',
        cards: [
          { title: 'Shopify — Senior Dev (take-home done)', description: 'Take-home submitted. Waiting for technical interview scheduling.', priority: 'urgent' },
          { title: 'Supabase — Full-stack Engineer', description: 'First round done. Panel interview scheduled for next week.', priority: 'high' },
        ],
      },
      {
        title: 'Offers / Closed',
        cards: [
          { title: 'StartupXYZ — declined', description: 'Offer was below target comp. Good process, kept in touch.', priority: 'low', isCompleted: true },
        ],
      },
    ],
  },
];

async function seed() {
  await sequelize.authenticate();
  console.log('DB connected.');

  // Upsert guest user
  let user = await User.findOne({ where: { email: GUEST_EMAIL } });
  if (user) {
    console.log(`Guest user already exists (id=${user.id}). Re-seeding boards...`);
    // Clean up existing boards for a fresh seed
    const existing = await Board.findAll({ where: { userId: user.id } });
    for (const b of existing) await b.destroy();
  } else {
    const hashed = await bcrypt.hash(GUEST_PASSWORD, 10);
    user = await User.create({ name: GUEST_NAME, email: GUEST_EMAIL, password: hashed });
    console.log(`Created guest user (id=${user.id}).`);
  }

  for (let bi = 0; bi < BOARDS.length; bi++) {
    const boardData = BOARDS[bi];
    const board = await Board.create({
      title: boardData.title,
      description: boardData.description,
      userId: user.id,
      position: bi,
    });

    // Create labels
    const labelMap = {};
    for (const l of boardData.labels) {
      const label = await Label.create({ ...l, boardId: board.id });
      labelMap[l.name] = label.id;
    }

    // Create lists + cards
    for (let li = 0; li < boardData.lists.length; li++) {
      const listData = boardData.lists[li];
      const list = await List.create({ title: listData.title, boardId: board.id, position: li });

      for (let ci = 0; ci < listData.cards.length; ci++) {
        const { title, description, priority, isCompleted = false } = listData.cards[ci];
        await Card.create({
          title,
          description: description || null,
          priority: priority || 'medium',
          isCompleted,
          position: ci,
          listId: list.id,
          userId: user.id,
        });
      }
    }

    console.log(`  Created board: "${board.title}" (${boardData.lists.length} lists)`);
  }

  console.log('\nDone! Guest credentials:');
  console.log(`  Email:    ${GUEST_EMAIL}`);
  console.log(`  Password: ${GUEST_PASSWORD}`);

  await sequelize.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
