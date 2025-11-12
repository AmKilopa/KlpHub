modules/
├── kanban/
│   ├── components/
│   │   └── [All Kanban components: KanbanBoard, KanbanColumn, KanbanTask, KanbanActions, modals]
│   ├── pages/
│   │   └── KanbanPage.tsx
│   ├── hooks/
│   │   ├── useKanban.ts
│   │   └── useSearch.ts
│   ├── styles/
│   │   └── [All Kanban CSS: KanbanBoard.css, KanbanColumn.css, KanbanTask.css, KanbanActions.css, ConfirmModal.css, EmptyState.css, Modal.css]
│   ├── api/
│   │   └── kanbanApi.ts
│   └── types/
│       └── kanban.types.ts
├── [future modules]/

components/
└── common/
    └── [Button, Loader, Modal, Sidebar, TopBar, Toast]
pages/
├── DashboardPage.tsx
├── LoginPage.tsx
└── [other global pages]
styles/
├── global.css
└── variables.css
hooks/
└── useToast.ts
utils/
├── helpers.ts
└── ripple.ts
types/
└── index.ts
App.tsx
index.tsx
