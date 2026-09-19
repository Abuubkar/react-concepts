# React Senior-Level Interview Prep Lab

This workspace is a sandbox for exploring complex React architectures, performance optimization patterns, and React 19 concepts relevant to senior-level engineering (6+ years experience).

## Currently Implemented Topics

*   **Concurrent Rendering & UI Responsiveness**: [`useDeferredValue`](src/features/useDeferredValue/UseDeferredValueExample.jsx) for non-blocking UI updates during heavy operations.
*   **State Machine vs Action Hooks**: Comparing legacy [`useReducer`](src/features/useActionStateVsUseReducer/UseActionStateVsUseReducerExample.jsx) with React 19's asynchronous [`useActionState`](src/features/useActionStateVsUseReducer/UseActionStateVsUseReducerExample.jsx).
*   **Virtual DOM Reconciliation & Diffing**: Inside [`ListKeysExample`](src/features/listKeys/ListKeysExample.jsx) demonstrating state mismatches during prepending/sorting without key vs with index vs with unique IDs.
*   **Render Lifecycle & Ref Hazards**: Highlighting pitfalls in [`UseRefCountExample`](src/features/useRefCount/UseRefCountExample.jsx) where refs are inappropriately read during the render phase.
*   **Encapsulating Browser API Side Effects**: Custom [`useQueryState`](src/hooks/useQueryState.js) hook to sync React state with search query parameters and handle standard back/forward navigation.
*   **Rendering Architecture & Fiber Lifecycle**: [`RenderingVisualizer`](src/features/renderingVisualizer/RenderingVisualizer.jsx) playground tracing React component tree rendering states, reference-based props/state/context diffs, context rendering isolation, and the 5-stage fiber update execution pipeline.

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
6.  **Web Workers: True Off-Main-Thread Computation**
    *   *Concept*: Moving CPU-bound work off the main thread so the UI never drops a frame. Vite's `new Worker(new URL('./x.worker.js', import.meta.url), { type: 'module' })` syntax, the `postMessage`/`onmessage` boundary, structured clone cost vs `Transferable` objects (`ArrayBuffer`), worker lifecycle and `terminate()` cleanup in `useEffect`, and request/response correlation via message IDs so stale results are discarded.
    *   *Why it matters*: Directly contrasts with [`useDeferredValue`](src/features/useDeferredValue/UseDeferredValueExample.jsx) — concurrent rendering only *interrupts* work between fiber units, it does not make a single long synchronous function yield. A 2s `JSON.parse` or image filter still blocks; only a worker fixes that. Knowing where that line sits is the senior-level answer.
    *   *Implementation*: A `useWorker` custom hook wrapping a worker with abort/cleanup semantics, driving a side-by-side demo: the same expensive job (e.g. prime sieve or large dataset sort/filter) run on the main thread vs in a worker, with a CSS spinner as the visible dropped-frame indicator.
7.  **Multi-threaded WebAssembly**
    *   *Concept*: Real parallelism inside a single WASM module via `SharedArrayBuffer` and the threads proposal — a worker pool sharing one linear memory, `Atomics.wait`/`Atomics.notify` for coordination, and `navigator.hardwareConcurrency` for pool sizing. The hard part is the deployment constraint: shared memory requires cross-origin isolation, so the page must send `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`, which in turn breaks any non-CORP third-party embed.
    *   *Why it matters*: The natural escalation from item 6. A single worker gets work off the main thread but still runs on one core; WASM threads use all of them, and the tradeoffs (isolation headers, memory model, no DOM access, copy cost at the JS↔WASM boundary) are exactly what gets probed once you claim performance depth. Also the honest answer to "when is JS not enough?".
    *   *Implementation*: Configure `server.headers` in [`vite.config.js`](vite.config.js) for COOP/COEP, then benchmark the same workload three ways — main thread JS, single worker, and a threaded WASM module — rendered as a live bar chart. Rust + `wasm-pack` with `wasm-bindgen-rayon` is the shortest path to a threaded build; an image convolution or Mandelbrot render makes the core-count scaling visible.
    *   *Prerequisite*: Do item 6 first — the worker lifecycle and `postMessage` boundary carry over directly.

