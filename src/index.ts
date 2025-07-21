#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { FileOperations } from './tools/file-operations.js';
import { TerminalOperations } from './tools/terminal-operations.js';
import { SearchOperations } from './tools/search-operations.js';
import { UtilityOperations } from './tools/utility-operations.js';

/**
 * Coding Agent MCP Server
 * Provides comprehensive coding agent capabilities including file operations,
 * terminal commands, search functionality, and utility operations.
 * 
 * @author Sukarth Acharya
 */
class CodingAgentMCPServer {
  private server: Server;
  private fileOps: FileOperations;
  private terminalOps: TerminalOperations;
  private searchOps: SearchOperations;
  private utilityOps: UtilityOperations;

  constructor() {
    this.server = new Server(
      {
        name: 'coding-agent-mcp',
        version: '1.0.0',
      }
    );

    this.fileOps = new FileOperations();
    this.terminalOps = new TerminalOperations();
    this.searchOps = new SearchOperations();
    this.utilityOps = new UtilityOperations();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        ...this.fileOps.getTools(),
        ...this.terminalOps.getTools(),
        ...this.searchOps.getTools(),
        ...this.utilityOps.getTools(),
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Route to appropriate tool handler
        if (this.fileOps.hasTools(name)) {
          return await this.fileOps.handleTool(name, args);
        }
        
        if (this.terminalOps.hasTools(name)) {
          return await this.terminalOps.handleTool(name, args);
        }
        
        if (this.searchOps.hasTools(name)) {
          return await this.searchOps.handleTool(name, args);
        }
        
        if (this.utilityOps.hasTools(name)) {
          return await this.utilityOps.handleTool(name, args);
        }

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Coding Agent MCP Server started');
  }
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Coding Agent MCP Server v1.0.0
A comprehensive MCP server providing coding agent capabilities

Usage: coding-agent-mcp [options]

Options:
  --help, -h     Show this help message
  --version, -v  Show version information

Features:
  • File Operations: Read, write, edit, copy, move, delete files and directories
  • Terminal Operations: Execute commands with working directory control
  • Search Operations: Text search, file search, find & replace, duplicate detection
  • Utility Operations: Delays, system info, UUID generation, encoding, hashing

For more information, visit: https://github.com/sukarth/coding-agent-mcp
`);
  process.exit(0);
}

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log('1.0.0');
  process.exit(0);
}

// Start the server
const server = new CodingAgentMCPServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});