import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

const execAsync = promisify(exec);

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  command: string;
  workingDirectory: string;
  duration: number;
}

/**
 * Terminal Operations Tool Handler
 * Provides terminal command execution capabilities with path control and result viewing
 */
export class TerminalOperations {
  private tools: Tool[] = [
    {
      name: 'run_command',
      description: 'Execute a terminal command in a specified directory',
      inputSchema: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'Command to execute' },
          workingDirectory: { type: 'string', description: 'Working directory for command execution', default: '.' },
          timeout: { type: 'number', description: 'Command timeout in milliseconds', default: 30000 },
          shell: { type: 'boolean', description: 'Execute in shell', default: true },
          env: { 
            type: 'object', 
            description: 'Environment variables to set',
            additionalProperties: { type: 'string' }
          }
        },
        required: ['command']
      }
    },
    {
      name: 'run_command_stream',
      description: 'Execute a command and stream output in real-time',
      inputSchema: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'Command to execute' },
          workingDirectory: { type: 'string', description: 'Working directory for command execution', default: '.' },
          timeout: { type: 'number', description: 'Command timeout in milliseconds', default: 60000 }
        },
        required: ['command']
      }
    },
    {
      name: 'get_environment',
      description: 'Get current environment variables',
      inputSchema: {
        type: 'object',
        properties: {
          filter: { type: 'string', description: 'Filter environment variables by name pattern' }
        }
      }
    },
    {
      name: 'get_working_directory',
      description: 'Get the current working directory',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'which_command',
      description: 'Find the path of a command (equivalent to which/where)',
      inputSchema: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'Command name to locate' }
        },
        required: ['command']
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
      case 'run_command':
        return await this.runCommand(
          args.command, 
          args.workingDirectory, 
          args.timeout, 
          args.shell, 
          args.env
        );
      case 'run_command_stream':
        return await this.runCommandStream(args.command, args.workingDirectory, args.timeout);
      case 'get_environment':
        return await this.getEnvironment(args.filter);
      case 'get_working_directory':
        return await this.getWorkingDirectory();
      case 'which_command':
        return await this.whichCommand(args.command);
      default:
        throw new Error(`Unknown terminal operation: ${name}`);
    }
  }

  private async runCommand(
    command: string, 
    workingDirectory: string = '.', 
    timeout: number = 30000,
    shell: boolean = true,
    env?: Record<string, string>
  ): Promise<any> {
    const startTime = Date.now();
    
    try {
      const resolvedPath = path.resolve(workingDirectory);
      
      const options: any = {
        cwd: resolvedPath,
        timeout,
        shell: shell,
        env: env ? { ...process.env, ...env } : process.env,
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      };

      const { stdout, stderr } = await execAsync(command, options);
      const duration = Date.now() - startTime;

      const result: CommandResult = {
        stdout: stdout.toString(),
        stderr: stderr.toString(),
        exitCode: 0,
        command,
        workingDirectory: resolvedPath,
        duration
      };

      return {
        content: [{
          type: 'text',
          text: this.formatCommandResult(result)
        }]
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      const result: CommandResult = {
        stdout: error.stdout?.toString() || '',
        stderr: error.stderr?.toString() || error.message,
        exitCode: error.code || 1,
        command,
        workingDirectory: path.resolve(workingDirectory),
        duration
      };

      return {
        content: [{
          type: 'text',
          text: this.formatCommandResult(result)
        }]
      };
    }
  }

  private async runCommandStream(
    command: string, 
    workingDirectory: string = '.', 
    timeout: number = 60000
  ): Promise<any> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const resolvedPath = path.resolve(workingDirectory);
      
      let stdout = '';
      let stderr = '';
      
      const child = spawn(command, [], {
        cwd: resolvedPath,
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      const timeoutId = setTimeout(() => {
        child.kill('SIGTERM');
      }, timeout);

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;
        
        const result: CommandResult = {
          stdout,
          stderr,
          exitCode: code || 0,
          command,
          workingDirectory: resolvedPath,
          duration
        };

        resolve({
          content: [{
            type: 'text',
            text: this.formatCommandResult(result, true)
          }]
        });
      });

      child.on('error', (error) => {
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;
        
        const result: CommandResult = {
          stdout,
          stderr: error.message,
          exitCode: 1,
          command,
          workingDirectory: resolvedPath,
          duration
        };

        resolve({
          content: [{
            type: 'text',
            text: this.formatCommandResult(result, true)
          }]
        });
      });
    });
  }

  private formatCommandResult(result: CommandResult, isStreamed: boolean = false): string {
    const header = `${isStreamed ? '[STREAMED] ' : ''}Command: ${result.command}
Working Directory: ${result.workingDirectory}
Exit Code: ${result.exitCode}
Duration: ${result.duration}ms
`;

    let output = header + '\n';
    
    if (result.stdout) {
      output += '--- STDOUT ---\n';
      output += result.stdout;
      output += '\n';
    }
    
    if (result.stderr) {
      output += '--- STDERR ---\n';
      output += result.stderr;
      output += '\n';
    }
    
    if (!result.stdout && !result.stderr) {
      output += '(No output)\n';
    }

    return output;
  }

  private async getEnvironment(filter?: string): Promise<any> {
    try {
      let env = process.env;
      
      if (filter) {
        const regex = new RegExp(filter, 'i');
        env = Object.fromEntries(
          Object.entries(env).filter(([key]) => regex.test(key))
        );
      }

      return {
        content: [{
          type: 'text',
          text: `Environment Variables:\n\n${JSON.stringify(env, null, 2)}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to get environment: ${error}`);
    }
  }

  private async getWorkingDirectory(): Promise<any> {
    try {
      const cwd = process.cwd();
      return {
        content: [{
          type: 'text',
          text: `Current Working Directory: ${cwd}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to get working directory: ${error}`);
    }
  }

  private async whichCommand(command: string): Promise<any> {
    try {
      const isWindows = process.platform === 'win32';
      const whichCmd = isWindows ? `where ${command}` : `which ${command}`;
      
      const { stdout, stderr } = await execAsync(whichCmd);
      
      if (stderr && !stdout) {
        return {
          content: [{
            type: 'text',
            text: `Command '${command}' not found`
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Command '${command}' found at:\n${stdout.trim()}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Command '${command}' not found`
        }]
      };
    }
  }
}