import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Utility Operations Tool Handler
 * Provides utility functions like delays, system info, and other helpful operations
 */
export class UtilityOperations {
  private tools: Tool[] = [
    {
      name: 'delay',
      description: 'Wait for a specified amount of time',
      inputSchema: {
        type: 'object',
        properties: {
          milliseconds: { type: 'number', description: 'Time to wait in milliseconds' },
          seconds: { type: 'number', description: 'Time to wait in seconds (alternative to milliseconds)' }
        }
      }
    },
    {
      name: 'get_system_info',
      description: 'Get system information',
      inputSchema: {
        type: 'object',
        properties: {
          detailed: { type: 'boolean', description: 'Include detailed system information', default: false }
        }
      }
    },
    {
      name: 'generate_uuid',
      description: 'Generate a UUID',
      inputSchema: {
        type: 'object',
        properties: {
          version: { type: 'number', enum: [1, 4], description: 'UUID version (1 or 4)', default: 4 },
          count: { type: 'number', description: 'Number of UUIDs to generate', default: 1, minimum: 1, maximum: 100 }
        }
      }
    },
    {
      name: 'encode_decode',
      description: 'Encode or decode text using various methods',
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to encode/decode' },
          method: { 
            type: 'string', 
            enum: ['base64-encode', 'base64-decode', 'url-encode', 'url-decode', 'html-encode', 'html-decode'],
            description: 'Encoding/decoding method'
          }
        },
        required: ['text', 'method']
      }
    },
    {
      name: 'hash_text',
      description: 'Generate hash of text using various algorithms',
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to hash' },
          algorithm: { 
            type: 'string', 
            enum: ['md5', 'sha1', 'sha256', 'sha512'],
            description: 'Hash algorithm',
            default: 'sha256'
          },
          encoding: {
            type: 'string',
            enum: ['hex', 'base64'],
            description: 'Output encoding',
            default: 'hex'
          }
        },
        required: ['text']
      }
    },
    {
      name: 'format_json',
      description: 'Format and validate JSON',
      inputSchema: {
        type: 'object',
        properties: {
          json: { type: 'string', description: 'JSON string to format' },
          indent: { type: 'number', description: 'Indentation spaces', default: 2 },
          sortKeys: { type: 'boolean', description: 'Sort object keys', default: false }
        },
        required: ['json']
      }
    },
    {
      name: 'validate_regex',
      description: 'Validate and test regular expressions',
      inputSchema: {
        type: 'object',
        properties: {
          pattern: { type: 'string', description: 'Regular expression pattern' },
          testString: { type: 'string', description: 'String to test against the pattern' },
          flags: { type: 'string', description: 'Regex flags (g, i, m, s, u, y)', default: '' }
        },
        required: ['pattern']
      }
    },
    {
      name: 'calculate_file_stats',
      description: 'Calculate statistics for files in a directory',
      inputSchema: {
        type: 'object',
        properties: {
          directory: { type: 'string', description: 'Directory to analyze', default: '.' },
          recursive: { type: 'boolean', description: 'Include subdirectories', default: true },
          filePattern: { type: 'string', description: 'File pattern to include', default: '*' }
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
      case 'delay':
        return await this.delay(args.milliseconds, args.seconds);
      case 'get_system_info':
        return await this.getSystemInfo(args.detailed);
      case 'generate_uuid':
        return await this.generateUuid(args.version, args.count);
      case 'encode_decode':
        return await this.encodeDecode(args.text, args.method);
      case 'hash_text':
        return await this.hashText(args.text, args.algorithm, args.encoding);
      case 'format_json':
        return await this.formatJson(args.json, args.indent, args.sortKeys);
      case 'validate_regex':
        return await this.validateRegex(args.pattern, args.testString, args.flags);
      case 'calculate_file_stats':
        return await this.calculateFileStats(args.directory, args.recursive, args.filePattern);
      default:
        throw new Error(`Unknown utility operation: ${name}`);
    }
  }

  private async delay(milliseconds?: number, seconds?: number): Promise<any> {
    const delayMs = milliseconds || (seconds ? seconds * 1000 : 0);
    
    if (delayMs <= 0) {
      throw new Error('Delay time must be greater than 0');
    }

    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, delayMs));
    const actualDelay = Date.now() - startTime;

    return {
      content: [{
        type: 'text',
        text: `Delayed for ${actualDelay}ms (requested: ${delayMs}ms)`
      }]
    };
  }

  private async getSystemInfo(detailed: boolean = false): Promise<any> {
    const os = await import('os');
    
    const basicInfo = {
      platform: process.platform,
      architecture: process.arch,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    if (detailed) {
      const detailedInfo = {
        ...basicInfo,
        hostname: os.hostname(),
        osType: os.type(),
        osRelease: os.release(),
        osVersion: os.version(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus(),
        networkInterfaces: os.networkInterfaces(),
        userInfo: os.userInfo(),
        loadAverage: os.loadavg()
      };

      return {
        content: [{
          type: 'text',
          text: `System Information (Detailed):\n\n${JSON.stringify(detailedInfo, null, 2)}`
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: `System Information:\n\n${JSON.stringify(basicInfo, null, 2)}`
      }]
    };
  }

  private async generateUuid(version: number = 4, count: number = 1): Promise<any> {
    const crypto = await import('crypto');
    const uuids: string[] = [];

    for (let i = 0; i < count; i++) {
      if (version === 4) {
        uuids.push(crypto.randomUUID());
      } else if (version === 1) {
        // Simple UUID v1 implementation (not fully compliant)
        const timestamp = Date.now();
        const random = crypto.randomBytes(10).toString('hex');
        const uuid = `${timestamp.toString(16)}-${random.slice(0, 4)}-1${random.slice(4, 7)}-${random.slice(7, 11)}-${random.slice(11)}`;
        uuids.push(uuid);
      } else {
        throw new Error(`Unsupported UUID version: ${version}`);
      }
    }

    return {
      content: [{
        type: 'text',
        text: count === 1 ? uuids[0] : `Generated ${count} UUIDs:\n${uuids.join('\n')}`
      }]
    };
  }

  private async encodeDecode(text: string, method: string): Promise<any> {
    let result: string;

    try {
      switch (method) {
        case 'base64-encode':
          result = Buffer.from(text, 'utf8').toString('base64');
          break;
        case 'base64-decode':
          result = Buffer.from(text, 'base64').toString('utf8');
          break;
        case 'url-encode':
          result = encodeURIComponent(text);
          break;
        case 'url-decode':
          result = decodeURIComponent(text);
          break;
        case 'html-encode':
          result = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
          break;
        case 'html-decode':
          result = text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
          break;
        default:
          throw new Error(`Unknown encoding method: ${method}`);
      }

      return {
        content: [{
          type: 'text',
          text: `${method} result:\n${result}`
        }]
      };
    } catch (error) {
      throw new Error(`Encoding/decoding failed: ${error}`);
    }
  }

  private async hashText(text: string, algorithm: string = 'sha256', encoding: string = 'hex'): Promise<any> {
    try {
      const crypto = await import('crypto');
      const hash = crypto.createHash(algorithm);
      hash.update(text);
      const result = hash.digest(encoding as any);

      return {
        content: [{
          type: 'text',
          text: `${algorithm.toUpperCase()} hash (${encoding}):\n${result}`
        }]
      };
    } catch (error) {
      throw new Error(`Hashing failed: ${error}`);
    }
  }

  private async formatJson(json: string, indent: number = 2, sortKeys: boolean = false): Promise<any> {
    try {
      const parsed = JSON.parse(json);
      
      let formatted: string;
      if (sortKeys) {
        const sortedObj = this.sortObjectKeys(parsed);
        formatted = JSON.stringify(sortedObj, null, indent);
      } else {
        formatted = JSON.stringify(parsed, null, indent);
      }

      return {
        content: [{
          type: 'text',
          text: `Formatted JSON:\n${formatted}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Invalid JSON: ${error}`
        }]
      };
    }
  }

  private sortObjectKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    } else if (obj !== null && typeof obj === 'object') {
      const sorted: any = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = this.sortObjectKeys(obj[key]);
      });
      return sorted;
    }
    return obj;
  }

  private async validateRegex(pattern: string, testString?: string, flags: string = ''): Promise<any> {
    try {
      const regex = new RegExp(pattern, flags);
      
      let result = `Regular expression is valid: /${pattern}/${flags}\n`;
      
      if (testString) {
        const matches = testString.match(regex);
        const globalMatches = [...testString.matchAll(new RegExp(pattern, flags + (flags.includes('g') ? '' : 'g')))];
        
        result += `\nTest string: "${testString}"\n`;
        result += `Matches: ${matches ? 'Yes' : 'No'}\n`;
        
        if (globalMatches.length > 0) {
          result += `All matches:\n`;
          globalMatches.forEach((match, index) => {
            result += `  ${index + 1}: "${match[0]}" at position ${match.index}\n`;
          });
        }
      }

      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Invalid regular expression: ${error}`
        }]
      };
    }
  }

  private async calculateFileStats(directory: string = '.', recursive: boolean = true, filePattern: string = '*'): Promise<any> {
    try {
      const glob = await import('fast-glob');
      const fs = await import('fs/promises');
      const path = await import('path');
      
      let globPattern = recursive ? `**/${filePattern}` : filePattern;
      
      const files = await glob.default(globPattern, {
        cwd: directory,
        onlyFiles: true,
        stats: true
      });

      let totalSize = 0;
      let totalFiles = 0;
      const extensions: Record<string, number> = {};
      const sizeRanges = {
        'tiny (< 1KB)': 0,
        'small (1KB - 10KB)': 0,
        'medium (10KB - 100KB)': 0,
        'large (100KB - 1MB)': 0,
        'huge (> 1MB)': 0
      };

      for (const entry of files) {
        const stats = entry.stats;
        const entryPath = typeof entry === 'string' ? entry : (entry.path || entry.name);
        const filePath = path.join(directory, entryPath);
        const ext = path.extname(filePath).toLowerCase() || '(no extension)';
        
        if (!stats) continue;
        
        totalSize += stats.size;
        totalFiles++;
        
        extensions[ext] = (extensions[ext] || 0) + 1;
        
        if (stats.size < 1024) {
          sizeRanges['tiny (< 1KB)']++;
        } else if (stats.size < 10240) {
          sizeRanges['small (1KB - 10KB)']++;
        } else if (stats.size < 102400) {
          sizeRanges['medium (10KB - 100KB)']++;
        } else if (stats.size < 1048576) {
          sizeRanges['large (100KB - 1MB)']++;
        } else {
          sizeRanges['huge (> 1MB)']++;
        }
      }

      const stats = {
        directory,
        totalFiles,
        totalSize,
        averageSize: totalFiles > 0 ? Math.round(totalSize / totalFiles) : 0,
        extensionBreakdown: extensions,
        sizeDistribution: sizeRanges
      };

      return {
        content: [{
          type: 'text',
          text: `File Statistics:\n\n${JSON.stringify(stats, null, 2)}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to calculate file stats: ${error}`);
    }
  }
}