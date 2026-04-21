import { Platform } from 'react-native';
import { useEffect } from 'react';

import { InsightLibrary } from '@/features/insights/InsightLibrary';

let useSQLiteContext: any;
let initializeDatabase: any;

if (Platform.OS !== 'web') {
  const sqliteModule = require('expo-sqlite');
  useSQLiteContext = sqliteModule.useSQLiteContext;
  const schemaModule = require('@/lib/database/schema');
  initializeDatabase = schemaModule.initializeDatabase;
}

export default function ResourcesTabScreen() {
  const db = Platform.OS !== 'web' ? useSQLiteContext() : null;

  useEffect(() => {
    if (db && initializeDatabase) {
      initializeDatabase(db).catch((error: any) => {
        console.error('Failed to initialize database:', error);
      });
    }
  }, [db]);

  return <InsightLibrary />;
}
