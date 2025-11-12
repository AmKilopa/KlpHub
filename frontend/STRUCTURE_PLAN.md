src/
├── modules/
│   ├── kanban/
│   │   ├── components/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── KanbanTask.tsx
│   │   │   ├── KanbanActions.tsx
│   │   │   └── modals/
│   │   │       ├── ConfirmModal.tsx
│   │   │       └── EmptyState.tsx
│   │   ├── pages/
│   │   │   └── KanbanPage.tsx
│   │   ├── hooks/
│   │   │   ├── useKanban.ts
│   │   │   └── useSearch.ts
│   │   ├── styles/
│   │   │   ├── KanbanBoard.css
│   │   │   ├── KanbanColumn.css
│   │   │   ├── KanbanTask.css
│   │   │   ├── KanbanActions.css
│   │   │   ├── ConfirmModal.css
│   │   │   ├── EmptyState.css
│   │   │   └── Modal.css
│   │   ├── api/
│   │   │   └── kanbanApi.ts
│   │   ├── types/
│   │   │   └── kanban.types.ts
│   └── [будущие модули]/
├── components/
│   └── common/
│       ├── Button.tsx
│       ├── Loader.tsx
│       ├── Modal.tsx
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       └── Toast.tsx
├── pages/
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── [другие глобальные страницы]
├── styles/
│   ├── global.css
│   ├── variables.css
├── hooks/
│   └── useToast.ts
├── utils/
│   ├── helpers.ts
│   └── ripple.ts
├── types/
│   ├── index.ts
├── App.tsx
├── index.tsx
