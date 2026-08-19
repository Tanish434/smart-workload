# ⚡ SmartWorkload PRO — Intelligent Team Capacity & Workload Balancing Dashboard

A state-of-the-art, frontend-reactive capacity balancing, project coordination, and priority scheduling portal built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

![SmartWorkload Overview](https://raw.githubusercontent.com/Tanish434/smart-workload/main/public/favicon.ico)

---

## 🌟 Key Features & Capabilities

### 1. 📊 Real-Time Workload & Capacity Math Engine
- **Live Workload Computation**: Team capacity percentages and allocated hours are derived in real-time from active task assignments without static mock values.
- **Dynamic Overload & Risk Detection**: Automatically flags teammates exceeding 100% capacity and highlights near-capacity warnings ($\ge 85\%$).
- **Fluid Visualizations**: Zero horizontal overflow capacity distribution bars with member avatars, active roles, and allocation breakdowns.

### 2. ⚡ Dynamic Priority Escalation (OS-Style Priority Aging with Feedback)
- **Multi-Factor Aging Algorithm**: Inspired by operating system priority scheduling to prevent task starvation and missed milestones:
  - **Looming Deadlines**: Low and Medium priority tasks dynamically escalate to **High** ($\le 3$ days) or **Critical** ($\le 1$ day / Overdue).
  - **Workload Feedback Loop**: Adds urgency points when an assigned teammate is currently overloaded ($>100\%$).
  - **Starvation Penalty**: Automatically boosts unassigned tasks nearing target dates.
- **Visual Aging Indicators**: Escalated priority badges (`⚡ CRITICAL`, `⚡ HIGH`) across task cards, detail banners, and dashboard widgets.

### 3. 💬 Admin Team Communications & Direct Email Dispatch
- **Direct Messaging Portal (`/chat`)**: Multi-channel communications hub for team admins:
  - Teammate channels with profile avatars, availability status, active project badges, and unread counters.
  - Quick managerial prompts (Timeline ETA request, Bandwidth inquiry, Sprint kudos).
  - Realistic simulated teammate response loop with in-app notification toasts.
- **Official Email Dispatcher**: Integrated email composer with:
  - Pre-filled team member work emails and project associations.
  - 1-click templates for Looming Deadlines, Workload Rebalances, and Milestone Commendations.
  - Native `mailto:` client launch and formatted text clipboard copy.

### 4. 🗂️ Multi-Project Cockpit & Organizational Tracking (`/projects`)
- **Project Workspaces**: Track completion rates, total estimated hours, assigned team rosters, and project leads.
- **Cross-Project Member Shifting**: Shift team members between projects with automated capacity validation and notification logging.
- **Project Deletion & Task Unlinking**: Safely retire projects while preserving unlinked tasks in the organizational backlog.

### 5. 👥 Team Roster & Chained Redistribution (`/team`)
- **Member Management**: Create, edit, and remove team members with custom profile avatars, hourly capacity, roles, and skills.
- **Smart Member Removal Strategies**:
  - *Unassign*: Return tasks to the unassigned backlog.
  - *Auto-Reassign*: AI engine reallocates tasks to the highest-scoring available qualified candidate.
  - *Specific Member Transfer*: Direct 1-click bulk handoff.
- **Cascading Unavailability Flow**: Marking a busy member unavailable triggers an guided rebalance queue for all active tasks.

### 6. 📋 Intelligent Task Board & Candidate Scoring (`/tasks`)
- **Smart Candidate Fit Engine**: Evaluates and ranks candidates in real-time:
  - Skill match (+40 pts)
  - Remaining bandwidth (+30 pts)
  - Availability status (+20 pts)
- **Comprehensive Filtering**: Filter by status, base priority, effective aging priority, assigned teammate, project, and required skills.

### 7. 🎨 Premium UI & Dark Mode System
- **Radial Expansion Theme Switch**: Smooth circular view transition animation when toggling dark and light modes.
- **Custom Themed Scrollbars**: Ultra-sleek, theme-aware scrollbar design for WebKit and Firefox.
- **Balanced 3-Column Dashboard**: Uniform compact cards for Overloaded Members, Upcoming Deadlines, and Auto Priority Escalation.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, React Server & Client Components) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) (Reactive in-memory store with memoized selectors) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + Custom CSS Design Tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Design Aesthetics** | Glassmorphism, Micro-animations, Radial View Transitions |

---

## 📁 Project Structure

```
smart-workload/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── alerts/page.tsx          # System alerts & rebalance suggestions
│   │   │   ├── chat/page.tsx            # Admin team communications & email
│   │   │   ├── dashboard/page.tsx       # Core KPI overview & widgets
│   │   │   ├── projects/                # Project listings & project details
│   │   │   ├── tasks/                   # Task board, creator & reassign flows
│   │   │   └── team/                    # Team roster & member profiles
│   │   ├── globals.css                  # Custom scrollbars, tokens & view transitions
│   │   └── layout.tsx                   # Theme provider & root shell
│   ├── components/
│   │   ├── chat/                        # ChatContainer, EmailModal
│   │   ├── dashboard/                   # KpiStrip, OverloadedWidget, DeadlineWidget, PrioritySchedulerWidget
│   │   ├── layout/                      # Sidebar, Topbar, MobileNav
│   │   ├── projects/                    # ProjectCard, ProjectModal
│   │   ├── tasks/                       # TaskCard, TaskFilterBar, SuggestedMembersPanel
│   │   ├── team/                        # MemberCard, WorkloadBar, AddMemberModal
│   │   └── ui/                          # Avatar, Badge, Button, Card, Modal, ProgressBar, Toast
│   ├── data/
│   │   └── seed.ts                      # Initialized members, tasks, projects, messages
│   ├── lib/
│   │   ├── alertsEngine.ts              # Automated capacity alert generator
│   │   ├── deadlineRisk.ts              # Urgency & deadline risk scorer
│   │   ├── priorityScheduler.ts         # OS-style dynamic priority aging engine
│   │   ├── suggestEngine.ts             # Candidate recommendation algorithm
│   │   └── workload.ts                  # Workload capacity calculations
│   ├── store/
│   │   └── useWorkloadStore.ts          # Central Zustand state and selectors
│   └── types/                           # Member, Task, Project, Chat, Notification types
├── public/                              # Favicon and static assets
├── tailwind.config.ts                   # Tailwind theme extensions
├── tsconfig.json                        # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/Tanish434/smart-workload.git

# Navigate into project directory
cd smart-workload

# Install dependencies
npm install
```

### Running Locally

```bash
# Start local development server on port 3000
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Building for Production

```bash
# Build optimized production package
npm run build

# Start production server
npm start
```

---

## 📄 License
MIT License. Built for advanced team workload optimization and capacity orchestration.
