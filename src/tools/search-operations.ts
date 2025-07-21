import * as fs from 'fs/promises';
import * as path from 'path';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export interface SearchResult {
  file: string;
  line: number;
  column: number;
  match: string;
  context: string;
}

export interface FileSearchResult {
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
}

/**
 * Search Operations Tool Handler
 * Provides comprehensive search capabilities for text and files
 */
export class SearchOperations {
  private tools: Tool[] = [
    {
      name: 'search_text',
      description: 'Search for text patterns in files',
      inputSchema: {
        type: 'object',
        properties: {
          pattern: { type: 'string', description: 'Text pattern to search for (supports regex)' },
          directory: { type: 'string', description: 'Directory to search in', default: '.' },
          filePattern: { type: 'string', description: 'File pattern to include (glob)', default: '*' },
          excludePattern: { type: 'string', description: 'File pattern to exclude (glob)' },
          recursive: { type: 'boolean', description: 'Search recursively', default: true },
          caseSensitive: { type: 'boolean', description: 'Case sensitive search', default: false },
          wholeWord: { type: 'boolean', description: 'Match whole words only', default: false },
          maxResults: { type: 'number', description: 'Maximum number of results', default: 100 },
          contextLines: { type: 'number', description: 'Number of context lines to show', default: 2 }
        },
        required: ['pattern']
      }
    },
    {
      name: 'search_files',
      description: 'Search for files by name pattern',
      inputSchema: {
        type: 'object',
        properties: {
          pattern: { type: 'string', description: 'File name pattern (supports glob and regex)' },
          directory: { type: 'string', description: 'Directory to search in', default: '.' },
          recursive: { type: 'boolean', description: 'Search recursively', default: true },
          includeHidden: { type: 'boolean', description: 'Include hidden files', default: false },
          type: { type: 'string', enum: ['file', 'directory', 'both'], description: 'Type of items to search for', default: 'both' },
          maxResults: { type: 'number', description: 'Maximum number of results', default: 100 }
        },
        required: ['pattern']
      }
    },
    {
      name: 'find_and_replace',
      description: 'Find and replace text across multiple files',
      inputSchema: {
        type: 'object',
        properties: {
          findPattern: { type: 'string', description: 'Pattern to find (supports regex)' },
          replaceWith: { type: 'string', description: 'Text to replace with' },
          directory: { type: 'string', description: 'Directory to search in', default: '.' },
          filePattern: { type: 'string', description: 'File pattern to include (glob)', default: '*' },
          excludePattern: { type: 'string', description: 'File pattern to exclude (glob)' },
          recursive: { type: 'boolean', description: 'Search recursively', default: true },
          caseSensitive: { type: 'boolean', description: 'Case sensitive search', default: false },
          dryRun: { type: 'boolean', description: 'Preview changes without applying them', default: true },
          maxFiles: { type: 'number', description: 'Maximum number of files to process', default: 50 }
        },
        required: ['findPattern', 'replaceWith']
      }
    },
    {
      name: 'search_duplicates',
      description: 'Find duplicate files based on content or name',
      inputSchema: {
        type: 'object',
        properties: {
          directory: { type: 'string', description: 'Directory to search in', default: '.' },
          method: { type: 'string', enum: ['content', 'name', 'size'], description: 'Duplicate detection method', default: 'content' },
          recursive: { type: 'boolean', description: 'Search recursively', default: true },
          minSize: { type: 'number', description: 'Minimum file size to consider (bytes)', default: 0 },
          filePattern: { type: 'string', description: 'File pattern to include (glob)', default: '*' }
        }
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
      case 'search_text':
        return await this.searchText(
          args.pattern,
          args.directory,
          args.filePattern,
          args.excludePattern,
          args.recursive,
          args.caseSensitive,
          args.wholeWord,
          args.maxResults,
          args.contextLines
        );
      case 'search_files':
        return await this.searchFiles(
          args.pattern,
          args.directory,
          args.recursive,
          args.includeHidden,
          args.type,
          args.maxResults
        );
      case 'find_and_replace':
        return await this.findAndReplace(
          args.findPattern,
          args.replaceWith,
          args.directory,
          args.filePattern,
          args.excludePattern,
          args.recursive,
          args.caseSensitive,
          args.dryRun,
          args.maxFiles
        );
      case 'search_duplicates':
        return await this.searchDuplicates(
          args.directory,
          args.method,
          args.recursive,
          args.minSize,
          args.filePattern
        );
      default:
        throw new Error(`Unknown search operation: ${name}`);
    }
  }

  private async searchText(
    pattern: string,
    directory: string = '.',
    filePattern: string = '*',
    excludePattern?: string,
    recursive: boolean = true,
    caseSensitive: boolean = false,
    wholeWord: boolean = false,
    maxResults: number = 100,
    contextLines: number = 2
  ): Promise<any> {
    try {
      const glob = await import('fast-glob');
      
      // Build glob pattern
      let globPattern = recursive ? `**/${filePattern}` : filePattern;
      
      const globOptions = {
        cwd: directory,
        ignore: excludePattern ? [excludePattern] : [],
        onlyFiles: true,
        dot: false
      };

      const files = await glob.default(globPattern, globOptions);
      
      // Create regex pattern
      let regexFlags = caseSensitive ? 'g' : 'gi';
      let searchPattern = pattern;
      
      if (wholeWord) {
        searchPattern = `\\b${pattern}\\b`;
      }
      
      const regex = new RegExp(searchPattern, regexFlags);
      const results: SearchResult[] = [];
      
      for (const file of files) {
        if (results.length >= maxResults) break;
        
        try {
          const filePath = path.join(directory, file);
          const content = await fs.readFile(filePath, 'utf8');
          const lines = content.split('\n');
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const matches = [...line.matchAll(regex)];
            
            for (const match of matches) {
              if (results.length >= maxResults) break;
              
              const contextStart = Math.max(0, i - contextLines);
              const contextEnd = Math.min(lines.length - 1, i + contextLines);
              const context = lines.slice(contextStart, contextEnd + 1).join('\n');
              
              results.push({
                file: filePath,
                line: i + 1,
                column: match.index! + 1,
                match: match[0],
                context
              });
            }
          }
        } catch (error) {
          // Skip files that can't be read
          continue;
        }
      }

      return {
        content: [{
          type: 'text',
          text: `Text search results for "${pattern}":\n\nFound ${results.length} matches in ${files.length} files\n\n${this.formatSearchResults(results)}`
        }]
      };
    } catch (error) {
      throw new Error(`Text search failed: ${error}`);
    }
  }

  private async searchFiles(
    pattern: string,
    directory: string = '.',
    recursive: boolean = true,
    includeHidden: boolean = false,
    type: string = 'both',
    maxResults: number = 100
  ): Promise<any> {
    try {
      const glob = await import('fast-glob');
      
      let globPattern = recursive ? `**/${pattern}` : pattern;
      
      const globOptions = {
        cwd: directory,
        onlyFiles: type === 'file',
        onlyDirectories: type === 'directory',
        dot: includeHidden,
        markDirectories: true,
        stats: true
      };

      const entries = await glob.default(globPattern, globOptions);
      const results: FileSearchResult[] = [];
      
      for (const entry of entries.slice(0, maxResults)) {
        const isDir = typeof entry === 'object' && (entry as any).path ? (entry as any).path.endsWith('/') : false;
        const entryPath = typeof entry === 'string' ? entry : (entry as any).path;
        const stats = typeof entry === 'object' && (entry as any).stats ? (entry as any).stats : null;
        
        results.push({
          path: path.join(directory, entryPath),
          type: isDir ? 'directory' : 'file',
          size: stats && !isDir ? stats.size : undefined,
          modified: stats ? stats.mtime.toISOString() : undefined
        });
      }

      return {
        content: [{
          type: 'text',
          text: `File search results for "${pattern}":\n\nFound ${results.length} items\n\n${JSON.stringify(results, null, 2)}`
        }]
      };
    } catch (error) {
      throw new Error(`File search failed: ${error}`);
    }
  }

  private async findAndReplace(
    findPattern: string,
    replaceWith: string,
    directory: string = '.',
    filePattern: string = '*',
    excludePattern?: string,
    recursive: boolean = true,
    caseSensitive: boolean = false,
    dryRun: boolean = true,
    maxFiles: number = 50
  ): Promise<any> {
    try {
      const glob = await import('fast-glob');
      
      let globPattern = recursive ? `**/${filePattern}` : filePattern;
      
      const globOptions = {
        cwd: directory,
        ignore: excludePattern ? [excludePattern] : [],
        onlyFiles: true,
        dot: false
      };

      const files = await glob.default(globPattern, globOptions);
      const results: Array<{file: string, matches: number, preview?: string}> = [];
      
      const regexFlags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(findPattern, regexFlags);
      
      for (const file of files.slice(0, maxFiles)) {
        try {
          const filePath = path.join(directory, file);
          const content = await fs.readFile(filePath, 'utf8');
          const matches = content.match(regex);
          
          if (matches && matches.length > 0) {
            const newContent = content.replace(regex, replaceWith);
            
            if (!dryRun) {
              await fs.writeFile(filePath, newContent, 'utf8');
            }
            
            results.push({
              file: filePath,
              matches: matches.length,
              preview: dryRun ? await this.generateReplacePreview(content, newContent, 3) : undefined
            });
          }
        } catch (error) {
          // Skip files that can't be processed
          continue;
        }
      }

      const action = dryRun ? 'Would replace' : 'Replaced';
      const totalMatches = results.reduce((sum, r) => sum + r.matches, 0);
      
      return {
        content: [{
          type: 'text',
          text: `Find and Replace Results:\n\n${action} ${totalMatches} occurrences in ${results.length} files\n\n${JSON.stringify(results, null, 2)}`
        }]
      };
    } catch (error) {
      throw new Error(`Find and replace failed: ${error}`);
    }
  }

  private async searchDuplicates(
    directory: string = '.',
    method: string = 'content',
    recursive: boolean = true,
    minSize: number = 0,
    filePattern: string = '*'
  ): Promise<any> {
    try {
      const glob = await import('fast-glob');
      const crypto = await import('crypto');
      
      let globPattern = recursive ? `**/${filePattern}` : filePattern;
      
      const files = await glob.default(globPattern, {
        cwd: directory,
        onlyFiles: true,
        stats: true
      });

      const duplicates: Record<string, string[]> = {};
      
      for (const entry of files) {
        const filePath = path.join(directory, entry.path);
        const stats = entry.stats;
        
        if (!stats || stats.size < minSize) continue;
        
        let key: string;
        
        switch (method) {
          case 'content':
            try {
              const content = await fs.readFile(filePath);
              key = crypto.createHash('md5').update(content).digest('hex');
            } catch {
              continue;
            }
            break;
          case 'name':
            key = path.basename(filePath);
            break;
          case 'size':
            key = stats.size.toString();
            break;
          default:
            throw new Error(`Unknown duplicate detection method: ${method}`);
        }
        
        if (!duplicates[key]) {
          duplicates[key] = [];
        }
        duplicates[key].push(filePath);
      }
      
      // Filter out non-duplicates
      const actualDuplicates = Object.entries(duplicates)
        .filter(([_, files]) => files.length > 1)
        .reduce((acc, [key, files]) => {
          acc[key] = files;
          return acc;
        }, {} as Record<string, string[]>);

      return {
        content: [{
          type: 'text',
          text: `Duplicate search results (method: ${method}):\n\nFound ${Object.keys(actualDuplicates).length} duplicate groups\n\n${JSON.stringify(actualDuplicates, null, 2)}`
        }]
      };
    } catch (error) {
      throw new Error(`Duplicate search failed: ${error}`);
    }
  }

  private formatSearchResults(results: SearchResult[]): string {
    return results.map(result => {
      return `${result.file}:${result.line}:${result.column}\n  Match: "${result.match}"\n  Context:\n${result.context.split('\n').map(line => `    ${line}`).join('\n')}\n`;
    }).join('\n');
  }

  private async generateReplacePreview(original: string, modified: string, maxLines: number = 3): Promise<string> {
    const diff = await import('diff');
    const patches = diff.createPatch('file', original, modified);
    const lines = patches.split('\n').slice(4); // Skip header
    
    return lines.slice(0, maxLines * 2).join('\n');
  }
}