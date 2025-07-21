import { SearchOperations } from '../src/tools/search-operations';
import { createTestFile, createTestDirectory, TEST_DIR } from './setup';
import * as path from 'path';

describe('SearchOperations', () => {
  let searchOps: SearchOperations;

  beforeEach(() => {
    searchOps = new SearchOperations();
  });

  describe('search_text', () => {
    it('should find text in files', async () => {
      const testDir = await createTestDirectory('search-test');
      await createTestFile('search-test/file1.txt', 'Hello World\nThis is a test');
      await createTestFile('search-test/file2.txt', 'Another file\nHello Universe');
      
      const result = await searchOps.handleTool('search_text', {
        pattern: 'Hello',
        directory: testDir
      });
      
      expect(result.content[0].text).toContain('Found 2 matches');
      expect(result.content[0].text).toContain('Hello World');
      expect(result.content[0].text).toContain('Hello Universe');
    });

    it('should respect case sensitivity', async () => {
      const testDir = await createTestDirectory('case-test');
      await createTestFile('case-test/file.txt', 'Hello hello HELLO');
      
      const result = await searchOps.handleTool('search_text', {
        pattern: 'hello',
        directory: testDir,
        caseSensitive: true
      });
      
      expect(result.content[0].text).toContain('Found 1 matches');
    });

    it('should find whole words only', async () => {
      const testDir = await createTestDirectory('word-test');
      await createTestFile('word-test/file.txt', 'test testing tested');
      
      const result = await searchOps.handleTool('search_text', {
        pattern: 'test',
        directory: testDir,
        wholeWord: true
      });
      
      expect(result.content[0].text).toContain('Found 1 matches');
    });
  });

  describe('search_files', () => {
    it('should find files by pattern', async () => {
      const testDir = await createTestDirectory('file-search-test');
      await createTestFile('file-search-test/test.txt', 'content');
      await createTestFile('file-search-test/test.js', 'content');
      await createTestFile('file-search-test/other.py', 'content');
      
      const result = await searchOps.handleTool('search_files', {
        pattern: '*.txt',
        directory: testDir
      });
      
      expect(result.content[0].text).toContain('test.txt');
      expect(result.content[0].text).not.toContain('test.js');
    });

    it('should find files recursively', async () => {
      const testDir = await createTestDirectory('recursive-test');
      await createTestDirectory('recursive-test/subdir');
      await createTestFile('recursive-test/file.txt', 'content');
      await createTestFile('recursive-test/subdir/nested.txt', 'content');
      
      const result = await searchOps.handleTool('search_files', {
        pattern: '*.txt',
        directory: testDir,
        recursive: true
      });
      
      expect(result.content[0].text).toContain('file.txt');
      expect(result.content[0].text).toContain('nested.txt');
    });
  });

  describe('find_and_replace', () => {
    it('should preview replacements in dry run mode', async () => {
      const testDir = await createTestDirectory('replace-test');
      await createTestFile('replace-test/file.txt', 'Hello World\nHello Universe');
      
      const result = await searchOps.handleTool('find_and_replace', {
        findPattern: 'Hello',
        replaceWith: 'Hi',
        directory: testDir,
        dryRun: true
      });
      
      expect(result.content[0].text).toContain('Would replace');
      expect(result.content[0].text).toContain('2 occurrences');
    });

    it('should actually replace when not in dry run mode', async () => {
      const testDir = await createTestDirectory('actual-replace-test');
      const filePath = await createTestFile('actual-replace-test/file.txt', 'Hello World');
      
      const result = await searchOps.handleTool('find_and_replace', {
        findPattern: 'Hello',
        replaceWith: 'Hi',
        directory: testDir,
        dryRun: false
      });
      
      expect(result.content[0].text).toContain('Replaced');
      
      // Verify the file was actually changed
      const fs = await import('fs/promises');
      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toBe('Hi World');
    });
  });

  describe('search_duplicates', () => {
    it('should find duplicate files by content', async () => {
      const testDir = await createTestDirectory('duplicate-test');
      const content = 'Same content';
      await createTestFile('duplicate-test/file1.txt', content);
      await createTestFile('duplicate-test/file2.txt', content);
      await createTestFile('duplicate-test/file3.txt', 'Different content');
      
      const result = await searchOps.handleTool('search_duplicates', {
        directory: testDir,
        method: 'content'
      });
      
      expect(result.content[0].text).toContain('Found 1 duplicate groups');
      expect(result.content[0].text).toContain('file1.txt');
      expect(result.content[0].text).toContain('file2.txt');
    });

    it('should find duplicate files by name', async () => {
      const testDir = await createTestDirectory('name-duplicate-test');
      await createTestDirectory('name-duplicate-test/dir1');
      await createTestDirectory('name-duplicate-test/dir2');
      await createTestFile('name-duplicate-test/dir1/same.txt', 'content1');
      await createTestFile('name-duplicate-test/dir2/same.txt', 'content2');
      
      const result = await searchOps.handleTool('search_duplicates', {
        directory: testDir,
        method: 'name'
      });
      
      expect(result.content[0].text).toContain('Found 1 duplicate groups');
      expect(result.content[0].text).toContain('same.txt');
    });
  });
});