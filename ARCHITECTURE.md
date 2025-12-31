# Feature-Based Folder Structure

This project uses a **feature-based architecture** to organize code by business domain rather than technical role.

## Structure

```
src/
├── components/                 # Shared components used across features
│   ├── Map.tsx
│   ├── NavigationProgress.tsx
│   └── Sidebar.tsx
├── features/
│   ├── contacts/               # Contacts feature module
│   │   ├── actions/            # Server actions (create, update, delete)
│   │   │   ├── create-contact.ts
│   │   │   ├── delete-contact.ts
│   │   │   ├── update-contact.ts
│   │   │   └── update-favorite.ts
│   │   ├── components/         # UI components specific to contacts
│   │   │   ├── ContactSearch.tsx
│   │   │   └── FavouriteButton.tsx
│   │   ├── loaders/            # Data loaders
│   │   │   ├── contact.ts
│   │   │   └── contacts.ts
│   │   ├── routes/             # Route components
│   │   │   ├── contact.tsx
│   │   │   ├── edit.tsx
│   │   │   ├── list.tsx
│   │   │   └── new.tsx
│   │   ├── types/              # TypeScript types
│   │   │   └── contacts.ts
│   │   └── index.ts            # Barrel export for clean imports
│   └── main/                   # Main app feature
│       ├── page.tsx            # Main route component
│       └── index.ts            # Barrel export
├── mocks/                      # MSW mock handlers
│   ├── browser.ts
│   ├── contacts.ts
│   └── handlers.ts
├── assets/                     # Static assets
├── error-page.tsx              # Global error boundary
├── index.css                   # Global styles
├── main.tsx                    # App entry point
└── router.tsx                  # Route configuration
```

## Benefits

### 1. **Feature Encapsulation**

All code related to a feature lives together, making it easier to:

- Find related files
- Understand feature boundaries
- Move or remove features
- Work on features independently

### 2. **Scalability**

Adding new features is straightforward:

```
src/features/
├── contacts/
├── dashboard/      # New feature
├── settings/       # New feature
└── auth/          # New feature
```

### 3. **Clean Imports**

Using barrel exports (`index.ts`) allows clean imports:

```typescript
// ❌ Before (type-based structure)
import Root from './routes/root';
import { loader as rootLoader } from './loaders/root';
import { action as createAction } from './actions/create-contact';

// ✅ After (feature-based structure)
import {
  RootRoute,
  rootLoader,
  createContactAction,
} from './features/contacts';
```

### 4. **Better Code Ownership**

Teams can own entire features rather than slices across different folders.

## Adding a New Feature

1. Create a new feature folder:

   ```bash
   mkdir -p src/features/my-feature/{routes,components,actions,loaders,types}
   ```

2. Add your feature files

3. Create a barrel export (`index.ts`):

   ```typescript
   export { default as MyFeatureRoute } from './routes/my-feature';
   export { loader as myFeatureLoader } from './loaders/my-feature';
   ```

4. Import in your router:
   ```typescript
   import { MyFeatureRoute, myFeatureLoader } from './features/my-feature';
   ```

## Shared Code

For code shared across multiple features:

- **Shared components**: `src/components/`
- **Shared utilities**: `src/utils/`
- **Shared types**: `src/types/`
- **Shared hooks**: `src/hooks/`

## Migration Notes

This project was migrated from a type-based structure (routes/, actions/, loaders/, components/) to a feature-based structure. The contacts feature now contains all code related to contact management in one place.
