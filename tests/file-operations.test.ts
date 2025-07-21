import { FileOperations } from '../src/tools/file-operations';
import { createTestFile, createTestDirectory, TEST_DIR } from './setup';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('FileOperations', () => {
  let fileOps: FileOperations;

  beforeEach(() => {
    fileOps = new FileOperations();
  });

  describe('read_file', () => {
    it('should read file content successfully', async () => {
      const content = 'Hello, World!';
      const filePath = await createTestFile('test.txt', content);
      
      const result = await fileOps.handleTool('read_file', { path: filePath });
      
      expect(result.content[0].text).toContain(content);
      expect(result.content[0].text).toContain('test.txt');
    });

    it('should handle non-existent file', async () => {
      await expect(
        fileOps.handleTool('read_file', { path: 'non-existent.txt' })
      ).rejects.toThrow();
    });
  });

  describe('write_file', () => {
    it('should write file content successfully', async () => {
      const content = 'Test content';
      const filePath = path.join(TEST_DIR, 'write-test.txt');
      
      const result = await fileOps.handleTool('write_file', { 
        path: filePath, 
        content 
      });
      
      expect(result.content[0].text).toContain('Successfully wrote');
      
      const writtenContent = await fs.readFile(filePath, 'utf8');
      expect(writtenContent).toBe(content);
    });
  });

  describe('create_file', () => {
    it('should create new file', async () => {
      const filePath = path.join(TEST_DIR, 'new-file.txt');
      const content = 'New file content';
      
      const result = await fileOps.handleTool('create_file', { 
        path: filePath, 
        content 
      });
      
      expect(result.content[0].text).toContain('Successfully wrote');
      
      const fileContent = await fs.readFile(filePath, 'utf8');
      expect(fileContent).toBe(content);
    });

    it('should not overwrite existing file when overwrite is false', async () => {
      const filePath = await createTestFile('existing.txt', 'original');
      
      await expect(
        fileOps.handleTool('create_file', { 
          path: filePath, 
          content: 'new content',
          overwrite: false 
        })
      ).rejects.toThrow('already exists');
    });
  });

  describe('edit_file', () => {
    it('should edit file using replace method', async () => {
      const originalContent = 'Hello World\nThis is a test\nGoodbye World';
      const filePath = await createTestFile('edit-test.txt', originalContent);
      
      const result = await fileOps.handleTool('edit_file', {
        path: filePath,
        method: 'replace',
        target: 'World',
        replacement: 'Universe'
      });
      
      expect(result.content[0].text).toContain('Successfully edited');
      
      const editedContent = await fs.readFile(filePath, 'utf8');
      expect(editedContent).toContain('Hello Universe');
      expect(editedContent).toContain('Goodbye Universe');
    });

    it('should edit file using line-numbers method', async () => {
      const originalContent = 'Line 1\nLine 2\nLine 3\nLine 4';
      const filePath = await createTestFile('line-edit-test.txt', originalContent);
      
      const result = await fileOps.handleTool('edit_file', {
        path: filePath,
        method: 'line-numbers',
        startLine: 2,
        endLine: 3,
        replacement: 'New Line 2\nNew Line 3'
      });
      
      expect(result.content[0].text).toContain('Successfully edited');
      
      const editedContent = await fs.readFile(filePath, 'utf8');
      expect(editedContent).toBe('Line 1\nNew Line 2\nNew Line 3\nLine 4');
    });

    it('should edit file using character-match method', async () => {
      const originalContent = 'Hello World';
      const filePath = await createTestFile('char-edit-test.txt', originalContent);
      
      const result = await fileOps.handleTool('edit_file', {
        path: filePath,
        method: 'character-match',
        startChar: 6,
        endChar: 11,
        replacement: 'Universe'
      });
      
      expect(result.content[0].text).toContain('Successfully edited');
      
      const editedContent = await fs.readFile(filePath, 'utf8');
      expect(editedContent).toBe('Hello Universe');
    });
  });

  describe('list_directory', () => {
    it('should list directory contents', async () => {
      const testDir = await createTestDirectory('list-test');
      await createTestFile('list-test/file1.txt', 'content1');
      await createTestFile('list-test/file2.txt', 'content2');
      
      // Add a small delay to ensure files are written
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await fileOps.handleTool('list_directory', { 
        path: testDir 
      });
      
      expect(result.content[0].text).toContain('file1.txt');
      expect(result.content[0].text).toContain('file2.txt');
    });
  });

  describe('copy_file', () => {
    it('should copy file successfully', async () => {
      const content = 'File to copy';
      const sourcePath = await createTestFile('source.txt', content);
      const destPath = path.join(TEST_DIR, 'destination.txt');
      
      const result = await fileOps.handleTool('copy_file', {
        source: sourcePath,
        destination: destPath
      });
      
      expect(result.content[0].text).toContain('Successfully copied');
      
      const copiedContent = await fs.readFile(destPath, 'utf8');
      expect(copiedContent).toBe(content);
    });
  });

  describe('delete_file', () => {
    it('should delete file successfully', async () => {
      const filePath = await createTestFile('to-delete.txt', 'content');
      
      const result = await fileOps.handleTool('delete_file', { path: filePath });
      
      expect(result.content[0].text).toContain('Successfully deleted');
      
      await expect(fs.access(filePath)).rejects.toThrow();
    });
  });
});