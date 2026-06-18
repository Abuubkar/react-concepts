# React Senior-Level Interview Prep Lab

This workspace is a sandbox for exploring complex React architectures, performance optimization patterns, and React 19 concepts relevant to senior-level engineering (6+ years experience).

## Currently Implemented Topics

*   **Concurrent Rendering & UI Responsiveness**: [`useDeferredValue`](file:///Users/abuubkar/Projects/react%20practice/practice/src/features/useDeferredValue/UseDeferredValueExample.jsx) for non-blocking UI updates during heavy operations.
*   **State Machine vs Action Hooks**: Comparing legacy [`useReducer`](file:///Users/abuubkar/Projects/react%20practice/practice/src/features/useActionStateVsUseReducer/UseActionStateVsUseReducerExample.jsx) with React 19's asynchronous [`useActionState`](file:///Users/abuubkar/Projects/react%20practice/practice/src/features/useActionStateVsUseReducer/UseActionStateVsUseReducerExample.jsx).
*   **Virtual DOM Reconciliation & Diffing**: Inside [`ListKeysExample`](file:///Users/abuubkar/Projects/react%20practice/practice/src/features/listKeys/ListKeysExample.jsx) demonstrating state mismatches during prepending/sorting without key vs with index vs with unique IDs.
*   **Render Lifecycle & Ref Hazards**: Highlighting pitfalls in [`UseRefCountExample`](file:///Users/abuubkar/Projects/react%20practice/practice/src/features/useRefCount/UseRefCountExample.jsx) where refs are inappropriately read during the render phase.
*   **Encapsulating Browser API Side Effects**: Custom [`useQueryState`](file:///Users/abuubkar/Projects/react%20practice/practice/src/hooks/useQueryState.js) hook to sync React state with search query parameters and handle standard back/forward navigation.

---

## Suggested Prep Examples to Add

To excel in 6+ years senior React interviews, consider implementing the following complex examples:

1.  **Rendering Performance & Context Re-render Mitigation**
    *   *Concept*: Minimizing Context re-renders using `useSyncExternalStore`, splitting contexts, or creating custom selector-based pub-sub stores (like a micro-Zustand).
    *   *Implementation*: A complex multi-widget page sharing global state with minimal individual widget renders.
2.  **Custom Data Loading with Suspense & Error Boundaries (React 19)**
    *   *Concept*: Working with the new React 19 `use` hook to consume Promises directly in render, paired with `<Suspense>` boundaries and action transitions.
    *   *Implementation*: Dynamic data loader that uses `use(Promise)` with cache invalidation and transition triggers.
3.  **Virtualization for Large Data Sets**
    *   *Concept*: Custom DOM virtualization (windowing) calculating dynamic node heights and scroll positions instead of rendering massive DOM subtrees.
    *   *Implementation*: A virtualized list displaying 50,000 logs with search filtering.
4.  **Custom Hooks for Browser/Web API Synced States**
    *   *Concept*: Managing concurrent synchronization and cleaning up of web socket streams, canvas animation loops, or geolocation updates while preventing state tearing and memory leaks.
    *   *Implementation*: Real-time network telemetry/chat dashboard using persistent `WebSocket` with offline fallback state.
5.  **React 19 Server Actions & Optimistic Updates**
    *   *Concept*: `useOptimistic` hook paired with async Action states, demonstrating how to handle rollbacks on network failure.
    *   *Implementation*: A simple feedback rating form that reacts instantly to clicks and reverts if the fake API rejects.

