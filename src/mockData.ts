/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Project, Phase, Task, TaskComment, AuditLog } from './types';

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Admin',
    department: 'Engineering Leadership',
    roleDescription: 'Overall platform administrator & VP of Engineering.'
  },
  {
    id: 'usr-2',
    name: 'Alex Rivera',
    email: 'alex.r@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Core Product Team',
    roleDescription: 'Senior Project Manager & Task Coordinator.'
  },
  {
    id: 'usr-3',
    name: 'Emily Chen',
    email: 'emily.c@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Design & UI/UX',
    roleDescription: 'Lead Designer for TeamForge Systems.'
  },
  {
    id: 'usr-4',
    name: 'Marcus Vance',
    email: 'marcus.v@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Backend Infrastructure',
    roleDescription: 'Infrastructure Engineer & Database Admin.'
  },
  {
    id: 'usr-5',
    name: 'Linda Sterling',
    email: 'linda.s@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    systemRole: 'HR',
    department: 'People Operations',
    roleDescription: 'HR Coordinator & Team Operations Specialist.'
  },
  {
    id: 'usr-6',
    name: 'David Kim',
    email: 'david.k@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Quality Assurance',
    roleDescription: 'QA Engineer & Automation Tester.'
  }
];

// Employee database for adding new members (company pool of 50-500 employees simulated)
export const companyEmployeePool: User[] = [
  ...mockUsers,
  {
    id: 'usr-7',
    name: 'Nate Foster',
    email: 'nate.f@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Core Product Team'
  },
  {
    id: 'usr-8',
    name: 'Jessica Vance',
    email: 'jessica.v@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Design & UI/UX'
  },
  {
    id: 'usr-9',
    name: 'Oliver Hudson',
    email: 'oliver.h@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Backend Infrastructure'
  },
  {
    id: 'usr-10',
    name: 'Sophia Patel',
    email: 'sophia.p@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Marketing & SEO'
  },
  {
    id: 'usr-11',
    name: 'Liam Gallagher',
    email: 'liam.g@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Quality Assurance'
  },
  {
    id: 'usr-12',
    name: 'Maya Lin',
    email: 'maya.l@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Design & UI/UX'
  },
  {
    id: 'usr-13',
    name: 'Carlos Santana',
    email: 'carlos.s@teamforge.com',
    avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=150',
    systemRole: 'Employee',
    department: 'Sales & Success'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'prj-1',
    name: 'Apollo Design System',
    description: 'Unified React components, styling guides, and brand tokens for all future enterprise web portals.',
    status: 'In Progress',
    progress: 68,
    startDate: '2026-05-10',
    endDate: '2026-08-15',
    members: [
      { userId: 'usr-1', projectRole: 'Project Manager' },
      { userId: 'usr-3', projectRole: 'Task Maker' },
      { userId: 'usr-2', projectRole: 'Contributor' },
      { userId: 'usr-6', projectRole: 'Viewer' }
    ]
  },
  {
    id: 'prj-2',
    name: 'Jupiter Cloud Migration',
    description: 'Transitioning legacy physical server databases to modern scaled cloud architectures with automatic clustering.',
    status: 'In Progress',
    progress: 45,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    members: [
      { userId: 'usr-2', projectRole: 'Project Manager' },
      { userId: 'usr-4', projectRole: 'Task Maker' },
      { userId: 'usr-1', projectRole: 'Contributor' }
    ]
  },
  {
    id: 'prj-3',
    name: 'SaaS Billing Engine Integration',
    description: 'Multi-tiered subscription system integration with automatic taxation, discount logic, and webhook handling.',
    status: 'On Hold',
    progress: 15,
    startDate: '2026-06-15',
    endDate: '2026-11-01',
    members: [
      { userId: 'usr-1', projectRole: 'Project Manager' },
      { userId: 'usr-4', projectRole: 'Contributor' },
      { userId: 'usr-5', projectRole: 'Viewer' }
    ]
  }
];

export const mockPhases: Phase[] = [
  // Apollo Design System Phases
  {
    id: 'phs-1-1',
    projectId: 'prj-1',
    name: 'Phase 1: Token Architecture',
    startDate: '2026-05-10',
    endDate: '2026-06-10',
    status: 'Completed',
    progress: 100,
    milestoneName: 'Design Token Baseline Complete'
  },
  {
    id: 'phs-1-2',
    projectId: 'prj-1',
    name: 'Phase 2: Core Components Design',
    startDate: '2026-06-11',
    endDate: '2026-07-15',
    dependencyPhaseId: 'phs-1-1',
    status: 'In Progress',
    progress: 75,
    milestoneName: 'First Components Code Released'
  },
  {
    id: 'phs-1-3',
    projectId: 'prj-1',
    name: 'Phase 3: Integration & Testing',
    startDate: '2026-07-16',
    endDate: '2026-08-15',
    dependencyPhaseId: 'phs-1-2',
    status: 'Not Started',
    progress: 0,
    milestoneName: 'Full Testing Coverage Audit'
  },

  // Jupiter Cloud Migration Phases
  {
    id: 'phs-2-1',
    projectId: 'prj-2',
    name: 'Phase 1: DB Replication Audit',
    startDate: '2026-04-01',
    endDate: '2026-05-20',
    status: 'Completed',
    progress: 100,
    milestoneName: 'Replication Verified'
  },
  {
    id: 'phs-2-2',
    projectId: 'prj-2',
    name: 'Phase 2: Kubernetes Cluster Setup',
    startDate: '2026-05-21',
    endDate: '2026-07-31',
    dependencyPhaseId: 'phs-2-1',
    status: 'In Progress',
    progress: 50,
    milestoneName: 'Pods Elastic Scaling Implemented'
  },
  {
    id: 'phs-2-3',
    projectId: 'prj-2',
    name: 'Phase 3: Safe DNS Cutover',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    dependencyPhaseId: 'phs-2-2',
    status: 'Not Started',
    progress: 0,
    milestoneName: 'dns-cutover-live'
  },

  // SaaS Billing Engine Integration Phases
  {
    id: 'phs-3-1',
    projectId: 'prj-3',
    name: 'Phase 1: Stripe & Stripe Tax Setup',
    startDate: '2026-06-15',
    endDate: '2026-07-31',
    status: 'In Progress',
    progress: 30,
    milestoneName: 'Stripe Sandbox Complete'
  },
  {
    id: 'phs-3-2',
    projectId: 'prj-3',
    name: 'Phase 2: Tiered Subscriptions API',
    startDate: '2026-08-01',
    endDate: '2026-09-15',
    dependencyPhaseId: 'phs-3-1',
    status: 'Not Started',
    progress: 0,
    milestoneName: 'Backend Webhooks Verifiable'
  }
];

export const mockTasks: Task[] = [
  // Apollo Design System (prj-1)
  {
    id: 'tsk-1-1',
    projectId: 'prj-1',
    phaseId: 'phs-1-1',
    title: 'Define Color Palette and Typography Tokens',
    description: 'Establish standard hex variables, mapping them across tailwind configurations. Includes high contrast validations.',
    assigneeId: 'usr-3',
    status: 'Done',
    priority: 'High',
    dueDate: '2026-05-25',
    checklist: [
      { id: 'chk-1', text: 'Define Primary Neutral / Accent colors', done: true },
      { id: 'chk-2', text: 'Test AAA color contrast standard', done: true },
      { id: 'chk-3', text: 'Generate .css config files', done: true }
    ],
    attachments: [
      { id: 'att-1', name: 'Brand_Colors_V1.pdf', size: '1.2 MB' }
    ],
    createdAt: '2026-05-12T09:00:00Z',
    lastUpdated: '2026-05-24T16:30:00Z',
    lastUpdatedBy: 'Emily Chen'
  },
  {
    id: 'tsk-1-2',
    projectId: 'prj-1',
    phaseId: 'phs-1-2',
    title: 'Develop Customizable Button Component',
    description: 'Implement variants (Primary, Secondary, Ghost, Outline), sizing, loader states, and focus styles.',
    assigneeId: 'usr-3',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2026-06-30',
    checklist: [
      { id: 'chk-4', text: 'Support loading states', done: true },
      { id: 'chk-5', text: 'Write Storybook documentation', done: false },
      { id: 'chk-6', text: 'Verify mouse-less accessibility', done: false }
    ],
    attachments: [],
    createdAt: '2026-06-12T10:00:00Z',
    lastUpdated: '2026-06-27T08:15:00Z',
    lastUpdatedBy: 'Emily Chen'
  },
  {
    id: 'tsk-1-3',
    projectId: 'prj-1',
    phaseId: 'phs-1-2',
    title: 'Design and Build Dialog Modal Backdrop',
    description: 'Construct custom React portals with correct focus trap and screen-reader constraints.',
    assigneeId: 'usr-2',
    status: 'Todo',
    priority: 'High',
    dueDate: '2026-07-10',
    checklist: [
      { id: 'chk-7', text: 'Mount to custom portal container', done: false },
      { id: 'chk-8', text: 'Setup layout animation transitions', done: false }
    ],
    attachments: [],
    createdAt: '2026-06-15T11:00:00Z',
    lastUpdated: '2026-06-15T11:00:00Z',
    lastUpdatedBy: 'Sarah Jenkins'
  },
  {
    id: 'tsk-1-4',
    projectId: 'prj-1',
    phaseId: 'phs-1-2',
    title: 'Implement Interactive Navigation Sidebar',
    description: 'Collapsible desktop navigation bar matching beautiful modern SaaS patterns. Used as real structural layout base.',
    assigneeId: 'usr-3',
    status: 'In Review',
    priority: 'High',
    dueDate: '2026-06-28',
    checklist: [
      { id: 'chk-9', text: 'Design sidebar visual styling', done: true },
      { id: 'chk-10', text: 'Implement collapsible state logic', done: true },
      { id: 'chk-11', text: 'Verify screen-width breakpoints', done: true }
    ],
    attachments: [
      { id: 'att-2', name: 'sidebar_sketch.png', size: '450 KB' }
    ],
    createdAt: '2026-06-16T14:00:00Z',
    lastUpdated: '2026-06-27T09:45:00Z',
    lastUpdatedBy: 'Emily Chen'
  },

  // Jupiter Cloud Migration (prj-2)
  {
    id: 'tsk-2-1',
    projectId: 'prj-2',
    phaseId: 'phs-2-1',
    title: 'Run Legacy PostgreSQL Performance Benchmarks',
    description: 'Inspect transaction load bottlenecks, long-running queries, and indexes size prior to schema porting.',
    assigneeId: 'usr-4',
    status: 'Done',
    priority: 'High',
    dueDate: '2026-04-20',
    checklist: [
      { id: 'chk-12', text: 'Audit table lock frequencies', done: true },
      { id: 'chk-13', text: 'Export benchmark log results', done: true }
    ],
    attachments: [
      { id: 'att-3', name: 'db_benchmark_dump.txt', size: '1.8 MB' }
    ],
    createdAt: '2026-04-02T10:00:00Z',
    lastUpdated: '2026-04-19T17:00:00Z',
    lastUpdatedBy: 'Marcus Vance'
  },
  {
    id: 'tsk-2-2',
    projectId: 'prj-2',
    phaseId: 'phs-2-2',
    title: 'Configure Kubernetes LoadBalancer and Pod Autoscaler',
    description: 'Setup horizontal pod auto-scalers triggered on high RAM/CPU metrics. Integrate stable certificate renewals.',
    assigneeId: 'usr-4',
    status: 'In Progress',
    priority: 'Urgent',
    dueDate: '2026-07-15',
    checklist: [
      { id: 'chk-14', text: 'Define YAML scaling profiles', done: true },
      { id: 'chk-15', text: 'Conduct stress loading tests (10k req/sec)', done: false },
      { id: 'chk-16', text: 'Verify SSL certificate bindings', done: false }
    ],
    attachments: [],
    createdAt: '2026-05-22T08:30:00Z',
    lastUpdated: '2026-06-27T10:12:00Z',
    lastUpdatedBy: 'Marcus Vance'
  },
  {
    id: 'tsk-2-3',
    projectId: 'prj-2',
    phaseId: 'phs-2-2',
    title: 'Audit IAM Cloud Access Policies',
    description: 'Review active keys and limit project permissions according to minimal necessity models.',
    assigneeId: 'usr-2',
    status: 'Todo',
    priority: 'Low',
    dueDate: '2026-07-28',
    checklist: [
      { id: 'chk-17', text: 'Generate active credential report', done: false }
    ],
    attachments: [],
    createdAt: '2026-06-20T09:00:00Z',
    lastUpdated: '2026-06-20T09:00:00Z',
    lastUpdatedBy: 'Alex Rivera'
  }
];

export const mockComments: TaskComment[] = [
  {
    id: 'cmt-1',
    taskId: 'tsk-1-2',
    userId: 'usr-2',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    text: 'Hey Emily, could we make sure the Button component also has support for custom icons next to text?',
    createdAt: '2026-06-25T11:20:00Z'
  },
  {
    id: 'cmt-2',
    taskId: 'tsk-1-2',
    userId: 'usr-3',
    userName: 'Emily Chen',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    text: 'Absolutely Alex! I added an optional `icon` slot that accepts Lucide elements nicely. I am currently finalizing the responsive padding sizes.',
    createdAt: '2026-06-26T14:45:00Z'
  },
  {
    id: 'cmt-3',
    taskId: 'tsk-2-2',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    text: 'Marcus, we must ensure DNS fallback profiles are mapped if autoscaling fails under load. Let us review together.',
    createdAt: '2026-06-27T08:30:00Z'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    taskId: 'tsk-1-2',
    projectId: 'prj-1',
    userId: 'usr-3',
    userName: 'Emily Chen',
    action: 'Marked checkbox "Support loading states" as Completed',
    timestamp: '2026-06-27T08:15:00Z'
  },
  {
    id: 'log-2',
    taskId: 'tsk-2-2',
    projectId: 'prj-2',
    userId: 'usr-4',
    userName: 'Marcus Vance',
    action: 'Created task "Configure Kubernetes LoadBalancer and Pod Autoscaler"',
    timestamp: '2026-06-26T09:12:00Z'
  },
  {
    id: 'log-3',
    taskId: 'tsk-1-4',
    projectId: 'prj-1',
    userId: 'usr-3',
    userName: 'Emily Chen',
    action: 'Moved task "Implement Interactive Navigation Sidebar" to In Review',
    timestamp: '2026-06-27T09:45:00Z'
  }
];
