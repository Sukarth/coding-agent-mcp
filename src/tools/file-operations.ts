import * as fs from 'fs/promises';
import * as path from 'path';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import * as diff from 'diff';

export interface FileEditOptions {
  method: 'replace' | 'diff' | 'line-numbers' | 'character-match';
  target?: string;
  replacement?: string;
  startLine?: number;
  endLine?: number;
  startChar?: number;
  endChar?: number;
  diffFormat?: 'unified' | 'xml';
}

/**
 * File Operations Tool Handler
 * Provides comprehensive file manipulation capabilities including advanced editing options
 */
export class FileOperations {
  private tools: Tool[] = [
    {
      name: 'read_file',
      description: 'Read the contents of a file',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the file to read' },
          encoding: { type: 'string', description: 'File encoding (default: utf8)', default: 'utf8' }
        },
        required: ['path']
      }
    },
    {
      name: 'write_file',
      description: 'Write content to a file (overwrites existing content)',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the file to write' },
          content: { type: 'string', description: 'Content to write to the file' },
          encoding: { type: 'string', description: 'File encoding (default: utf8)', default: 'utf8' },
          createDirs: { type: 'boolean', description: 'Create parent directories if they don\'t exist', default: true }
        },
        required: ['path', 'content']
      }
    },
    {
      name: 'create_file',
      description: 'Create a new file with optional content',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the new file' },
          content: { type: 'string', description: 'Initial content for the file', default: '' },
          overwrite: { type: 'boolean', description: 'Overwrite if file exists', default: false },
          createDirs: { type: 'boolean', description: 'Create parent directories if they don\'t exist', default: true }
        },
        required: ['path']
      }
    },
    {
      name: 'edit_file',
      description: 'Edit a file using various methods (replace, diff, line numbers, character matching)',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the file to edit' },
          method: { 
            type: 'string', 
            enum: ['replace', 'diff', 'line-numbers', 'character-match'],
            description: 'Editing method to use'
          },
          target: { type: 'string', description: 'Target text to find/replace (for replace and character-match methods)' },
          replacement: { type: 'string', description: 'Replacement text' },
          startLine: { type: 'number', description: 'Start line number (1-based, for line-numbers method)' },
          endLine: { type: 'number', description: 'End line number (1-based, for line-numbers method)' },
          startChar: { type: 'number', description: 'Start character position (0-based, for character-match method)' },
          endChar: { type: 'number', description: 'End character position (0-based, for character-match method)' },
          diffContent: { type: 'string', description: 'Diff content in unified format (for diff method)' },
          diffFormat: { type: 'string', enum: ['unified', 'xml'], description: 'Diff format (default: unified)', default: 'unified' }
        },
        required: ['path', 'method']
      }
    },
    {
      name: 'delete_file',
      description: 'Delete a file',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the file to delete' }
        },
        required: ['path']
      }
    },
    {
      name: 'copy_file',
      description: 'Copy a file to a new location',
      inputSchema: {
        type: 'object',
        properties: {
          source: { type: 'string', description: 'Source file path' },
          destination: { type: 'string', description: 'Destination file path' },
          overwrite: { type: 'boolean', description: 'Overwrite destination if it exists', default: false }
        },
        required: ['source', 'destination']
      }
    },
    {
      name: 'move_file',
      description: 'Move/rename a file',
      inputSchema: {
        type: 'object',
        properties: {
          source: { type: 'string', description: 'Source file path' },
          destination: { type: 'string', description: 'Destination file path' },
          overwrite: { type: 'boolean', description: 'Overwrite destination if it exists', default: false }
        },
        required: ['source', 'destination']
      }
    },
    {
      name: 'list_directory',
      description: 'List files and directories in a given path',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Directory path to list', default: '.' },
          recursive: { type: 'boolean', description: 'List recursively', default: false },
          includeHidden: { type: 'boolean', description: 'Include hidden files/directories', default: false },
          pattern: { type: 'string', description: 'Glob pattern to filter results' }
        }
      }
    },
    {
      name: 'create_directory',
      description: 'Create a directory',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Directory path to create' },
          recursive: { type: 'boolean', description: 'Create parent directories if they don\'t exist', default: true }
        },
        required: ['path']
      }
    },
    {
      name: 'delete_directory',
      description: 'Delete a directory',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Directory path to delete' },
          recursive: { type: 'boolean', description: 'Delete recursively', default: false }
        },
        required: ['path']
      }
    }
  ];

  getTools(): Tool[] {
    return this.tools;
  }

  hasTools(name: string): boolean {
    return this.tools.some(tool => tool.name === name);
  }

  async handleTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'read_file':
        return await this.readFile(args.path, args.encoding);
      case 'write_file':
        return await this.writeFile(args.path, args.content, args.encoding, args.createDirs);
      case 'create_file':
        return await this.createFile(args.path, args.content, args.overwrite, args.createDirs);
      case 'edit_file':
        return await this.editFile(args.path, {
          method: args.method,
          target: args.target,
          replacement: args.replacement,
          startLine: args.startLine,
          endLine: args.endLine,
          startChar: args.startChar,
          endChar: args.endChar,
          diffFormat: args.diffFormat
        }, args.diffContent);
      case 'delete_file':
        return await this.deleteFile(args.path);
      case 'copy_file':
        return await this.copyFile(args.source, args.destination, args.overwrite);
      case 'move_file':
        return await this.moveFile(args.source, args.destination, args.overwrite);
      case 'list_directory':
        return await this.listDirectory(args.path, args.recursive, args.includeHidden, args.pattern);
      case 'create_directory':
        return await this.createDirectory(args.path, args.recursive);
      case 'delete_directory':
        return await this.deleteDirectory(args.path, args.recursive);
      default:
        throw new Error(`Unknown file operation: ${name}`);
    }
  }

  private async readFile(filePath: string, encoding: string = 'utf8'): Promise<any> {
    try {
      const content = await fs.readFile(filePath, encoding as BufferEncoding);
      const stats = await fs.stat(filePath);
      
      return {
        content: [{
          type: 'text',
          text: `File: ${filePath}\nSize: ${stats.size} bytes\nModified: ${stats.mtime.toISOString()}\n\n${content}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  private async writeFile(filePath: string, content: string, encoding: string = 'utf8', createDirs: boolean = true): Promise<any> {
    try {
      if (createDirs) {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
      }
      
      await fs.writeFile(filePath, content, encoding as BufferEncoding);
      const stats = await fs.stat(filePath);
      
      return {
        content: [{
          type: 'text',
          text: `Successfully wrote ${stats.size} bytes to ${filePath}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error}`);
    }
  }

  private async createFile(filePath: string, content: string = '', overwrite: boolean = false, createDirs: boolean = true): Promise<any> {
    // Check if file exists
    try {
      await fs.access(filePath);
      // File exists
      if (!overwrite) {
        throw new Error(`File ${filePath} already exists and overwrite is false`);
      }
    } catch (accessError: any) {
      // Only proceed if the error is ENOENT (file doesn't exist)
      if (accessError.code !== 'ENOENT') {
        throw accessError; // Re-throw other access errors
      }
      // File doesn't exist, which is what we want for creation
    }

    try {
      return await this.writeFile(filePath, content, 'utf8', createDirs);
    } catch (error) {
      throw new Error(`Failed to create file ${filePath}: ${error}`);
    }
  }

  private async editFile(filePath: string, options: FileEditOptions, diffContent?: string): Promise<any> {
    try {
      const originalContent = await fs.readFile(filePath, 'utf8');
      let newContent: string;

      switch (options.method) {
        case 'replace':
          if (!options.target || options.replacement === undefined) {
            throw new Error('Replace method requires target and replacement');
          }
          newContent = originalContent.replace(new RegExp(options.target, 'g'), options.replacement);
          break;

        case 'line-numbers':
          if (options.startLine === undefined) {
            throw new Error('Line-numbers method requires startLine');
          }
          const lines = originalContent.split('\n');
          const startIdx = options.startLine - 1;
          const endIdx = options.endLine ? options.endLine - 1 : startIdx;
          
          if (startIdx < 0 || startIdx >= lines.length) {
            throw new Error(`Start line ${options.startLine} is out of range`);
          }
          
          lines.splice(startIdx, endIdx - startIdx + 1, ...(options.replacement || '').split('\n'));
          newContent = lines.join('\n');
          break;

        case 'character-match':
          if (options.startChar === undefined || options.endChar === undefined) {
            throw new Error('Character-match method requires startChar and endChar');
          }
          newContent = originalContent.substring(0, options.startChar) + 
                      (options.replacement || '') + 
                      originalContent.substring(options.endChar);
          break;

        case 'diff':
          if (!diffContent) {
            throw new Error('Diff method requires diffContent');
          }
          newContent = this.applyDiff(originalContent, diffContent, options.diffFormat);
          break;

        default:
          throw new Error(`Unknown edit method: ${options.method}`);
      }

      await fs.writeFile(filePath, newContent, 'utf8');
      
      // Generate diff for display
      const patches = diff.createPatch(filePath, originalContent, newContent);
      
      return {
        content: [{
          type: 'text',
          text: `Successfully edited ${filePath}\n\nChanges made:\n${patches}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to edit file ${filePath}: ${error}`);
    }
  }

  private applyDiff(originalContent: string, diffContent: string, format: string = 'unified'): string {
    if (format === 'xml') {
      // Parse XML-style diff tags
      return this.applyXmlDiff(originalContent, diffContent);
    } else {
      // Apply unified diff
      const patches = diff.parsePatch(diffContent);
      if (patches.length === 0) {
        throw new Error('Invalid diff format');
      }
      
      return diff.applyPatch(originalContent, patches[0]) || originalContent;
    }
  }

  private applyXmlDiff(originalContent: string, diffContent: string): string {
    // Simple XML diff parser for <replace>, <insert>, <delete> tags
    let result = originalContent;
    
    // Replace operations
    const replaceRegex = /<replace target="([^"]*)">(.*?)<\/replace>/gs;
    result = result.replace(replaceRegex, (match, target, replacement) => {
      return result.replace(target, replacement);
    });
    
    return result;
  }

  private async deleteFile(filePath: string): Promise<any> {
    try {
      await fs.unlink(filePath);
      return {
        content: [{
          type: 'text',
          text: `Successfully deleted file ${filePath}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to delete file ${filePath}: ${error}`);
    }
  }

  private async copyFile(source: string, destination: string, overwrite: boolean = false): Promise<any> {
    try {
      if (!overwrite) {
        try {
          await fs.access(destination);
          throw new Error(`Destination ${destination} already exists and overwrite is false`);
        } catch {
          // File doesn't exist, which is what we want
        }
      }

      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(source, destination);
      
      return {
        content: [{
          type: 'text',
          text: `Successfully copied ${source} to ${destination}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to copy file: ${error}`);
    }
  }

  private async moveFile(source: string, destination: string, overwrite: boolean = false): Promise<any> {
    try {
      await this.copyFile(source, destination, overwrite);
      await fs.unlink(source);
      
      return {
        content: [{
          type: 'text',
          text: `Successfully moved ${source} to ${destination}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to move file: ${error}`);
    }
  }

  private async listDirectory(dirPath: string = '.', recursive: boolean = false, includeHidden: boolean = false, pattern?: string): Promise<any> {
    try {
      const glob = await import('fast-glob');
      
      let globPattern = recursive ? '**/*' : '*';
      if (pattern) {
        globPattern = pattern;
      }
      
      const options = {
        cwd: dirPath,
        dot: includeHidden,
        onlyFiles: false,
        markDirectories: true,
        stats: true
      };
      
      const entries = await glob.default(globPattern, options);
      
      const formatted = entries.map((entry: any) => {
        const isDir = entry.dirent ? entry.dirent.isDirectory() : false;
        const stats = entry.stats;
        const entryPath = entry.path || entry.name || entry;
        return {
          name: entryPath,
          type: isDir ? 'directory' : 'file',
          size: isDir ? null : (stats ? stats.size : null),
          modified: stats ? stats.mtime.toISOString() : null
        };
      });
      
      return {
        content: [{
          type: 'text',
          text: `Directory listing for ${dirPath}:\n\n${JSON.stringify(formatted, null, 2)}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to list directory ${dirPath}: ${error}`);
    }
  }

  private async createDirectory(dirPath: string, recursive: boolean = true): Promise<any> {
    try {
      await fs.mkdir(dirPath, { recursive });
      return {
        content: [{
          type: 'text',
          text: `Successfully created directory ${dirPath}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to create directory ${dirPath}: ${error}`);
    }
  }

  private async deleteDirectory(dirPath: string, recursive: boolean = false): Promise<any> {
    try {
      if (recursive) {
        await fs.rm(dirPath, { recursive: true, force: true });
      } else {
        await fs.rmdir(dirPath);
      }
      
      return {
        content: [{
          type: 'text',
          text: `Successfully deleted directory ${dirPath}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to delete directory ${dirPath}: ${error}`);
    }
  }
}