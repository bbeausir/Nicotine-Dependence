import { useLoopMapStorage } from './useLoopMapStorage';

export function useModule1Status() {
  const { loopMap, isLoading } = useLoopMapStorage();

  return {
    isCompleted: loopMap !== null,
    loopMap,
    isLoading,
  };
}
