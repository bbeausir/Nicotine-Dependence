import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Module1Draft {
  currentScreen: number;
  triggers: string[];
  benefit: string | null;
  outcome: string | null;
  savedAt: number;
}

const DRAFT_KEY = 'nicotine.module1.session.v1';

export async function loadModule1Draft(): Promise<Module1Draft | null> {
  try {
    const data = await AsyncStorage.getItem(DRAFT_KEY);
    if (!data) return null;
    return JSON.parse(data) as Module1Draft;
  } catch (error) {
    console.error('Failed to load module1 draft:', error);
    return null;
  }
}

export async function saveModule1Draft(draft: Module1Draft): Promise<void> {
  try {
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save module1 draft:', error);
  }
}

export async function clearModule1Draft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear module1 draft:', error);
  }
}
