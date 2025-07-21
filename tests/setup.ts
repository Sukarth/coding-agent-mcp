import * as fs from 'fs/promises';
import * as path from 'path';

// Test setup and utilities
export const TEST_DIR = path.join(__dirname, 'temp');

beforeAll(async () => {
  // Create test directory
  try {
    await fs.mkdir(TEST_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
});

afterAll(async () => {
  // Clean up test directory
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist
  }
});

export async function createTestFile(filename: string, content: string): Promise<string> {
  const filePath = path.join(TEST_DIR, filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
}

export async function createTestDirectory(dirname: string): Promise<string> {
  const dirPath = path.join(TEST_DIR, dirname);
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
}