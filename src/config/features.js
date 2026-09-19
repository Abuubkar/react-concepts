import RenderingVisualizer from '../features/renderingVisualizer/RenderingVisualizer';
import UseDeferredValueExample from '../features/useDeferredValue/UseDeferredValueExample';
import UseRefCountExample from '../features/useRefCount/UseRefCountExample';
import { UseActionStateVsUseReducerExample } from '../features/useActionStateVsUseReducer/UseActionStateVsUseReducerExample';
import ListKeysExample from '../features/listKeys/ListKeysExample';

export const featureList = [
  {
    id: 'renderingVisualizer',
    label: 'Rendering Architecture Visualizer',
    Component: RenderingVisualizer
  },
  { 
    id: 'deferred', 
    label: 'useDeferredValue example', 
    Component: UseDeferredValueExample 
  },
  { 
    id: 'useRefCount', 
    label: 'useRef count pitfall', 
    Component: UseRefCountExample 
  },
  { 
    id: 'useActionStateVsUseReducer', 
    label: 'useActionState vs useReducer', 
    Component: UseActionStateVsUseReducerExample 
  },
  { 
    id: 'listKeys', 
    label: 'List keys comparison (No key vs Index vs ID)', 
    Component: ListKeysExample 
  },
];

export const defaultFeatureId = featureList[0].id;

