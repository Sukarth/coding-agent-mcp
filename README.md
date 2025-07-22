# Coding Agent MCP Server

[![smithery badge](https://smithery.ai/badge/@Sukarth/coding-agent-mcp)](https://smithery.ai/server/@Sukarth/coding-agent-mcp)

A comprehensive Model Context Protocol (MCP) server that provides coding agent capabilities including file operations, terminal commands, search functionality, and utility operations.

## Features

### 🗂️ File Operations
- **Read/Write Files**: Read file contents and write/overwrite files with encoding support
- **Advanced File Editing**: Multiple editing methods including:
  - String replacement with regex support
  - Line-based editing with line numbers
  - Character-based editing with precise positioning
  - Diff-based editing (unified and XML formats)
- **File Management**: Create, copy, move, and delete files
- **Directory Operations**: List, create, and delete directories with recursive options

### 💻 Terminal Operations
- **Command Execution**: Run terminal commands with working directory control
- **Real-time Streaming**: Stream command output in real-time
- **Environment Management**: Get and filter environment variables
- **Command Discovery**: Find command paths (which/where functionality)
- **Timeout Control**: Set execution timeouts for long-running commands

### 🔍 Search Operations
- **Text Search**: Search for patterns in files with regex support
- **File Search**: Find files by name patterns with glob support
- **Find & Replace**: Bulk find and replace across multiple files
- **Duplicate Detection**: Find duplicate files by content, name, or size
- **Advanced Options**: Case sensitivity, whole word matching, context lines

### 🛠️ Utility Operations
- **Delays**: Wait for specified time periods
- **System Information**: Get detailed system and runtime information
- **UUID Generation**: Generate UUIDs (v1 and v4)
- **Text Encoding**: Base64, URL, and HTML encoding/decoding
- **Hashing**: Generate hashes using MD5, SHA1, SHA256, SHA512
- **JSON Formatting**: Format and validate JSON with key sorting
- **Regex Validation**: Test and validate regular expressions
- **File Statistics**: Calculate comprehensive file statistics



## 🛠️ Installation

### Requirements
- Node.js >= v18.0.0
- Cursor, Windsurf, Claude Desktop or another MCP Client

<details>
<summary><b>Installing via Smithery</b></summary>

To install Coding Agent MCP Server for any client automatically via [Smithery](https://smithery.ai):

```bash
npx -y @smithery/cli@latest install @Sukarth/coding-agent-mcp --client <CLIENT_NAME> --key <YOUR_SMITHERY_KEY>
```
You can find your Smithery key in the [Smithery.ai webpage](https://smithery.ai/server/@Sukarth/coding-agent-mcp).
</details>

<details>
<summary><b>Install in Cursor</b></summary>

Go to: `Settings` → `Cursor Settings` → `MCP` → `Add new global MCP server`

Pasting the following configuration into your Cursor `~/.cursor/mcp.json` file is the recommended approach. You may also install in a specific project by creating `.cursor/mcp.json` in your project folder. See [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

<details>
<summary>Alternative: Use Bun</summary>

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "bunx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

</details>

<details>
<summary>Alternative: Use Deno</summary>

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "deno",
      "args": ["run", "--allow-env=NO_DEPRECATION,TRACE_DEPRECATION", "--allow-net", "--allow-read", "--allow-write", "npm:coding-agent-mcp"]
    }
  }
}
```

</details>

</details>

<details>
<summary><b>Install in Windsurf</b></summary>

Add this to your Windsurf MCP config file. See [Windsurf MCP docs](https://docs.windsurf.com/windsurf/mcp) for more info.

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in Trae</b></summary>

Use the Add manually feature and fill in the JSON configuration information for that MCP server.
For more details, visit the [Trae documentation](https://docs.trae.ai/ide/model-context-protocol?_lang=en).

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in VS Code</b></summary>

Add this to your VS Code MCP config file. See [VS Code MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

```json
{
  "mcp": {
    "servers": {
      "coding-agent": {
        "type": "stdio",
        "command": "npx",
        "args": ["coding-agent-mcp"]
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Visual Studio 2022</b></summary>

You can configure Coding Agent MCP in Visual Studio 2022 by following the [Visual Studio MCP Servers documentation](https://learn.microsoft.com/visualstudio/ide/mcp-servers?view=vs-2022).

Add this to your Visual Studio MCP config file (see the [Visual Studio docs](https://learn.microsoft.com/visualstudio/ide/mcp-servers?view=vs-2022) for details):

```json
{
  "mcp": {
    "servers": {
      "coding-agent": {
        "type": "stdio",
        "command": "npx",
        "args": ["coding-agent-mcp"]
      }
    }
  }
}
```

For more information and troubleshooting, refer to the [Visual Studio MCP Servers documentation](https://learn.microsoft.com/visualstudio/ide/mcp-servers?view=vs-2022).

</details>

<details>
<summary><b>Install in Zed</b></summary>

Add this to your Zed `settings.json`. See [Zed Context Server docs](https://zed.dev/docs/assistant/context-servers) for more info.

```json
{
  "context_servers": {
    "coding-agent": {
      "command": {
        "path": "npx",
        "args": ["coding-agent-mcp"]
      },
      "settings": {}
    }
  }
}
```

</details>

<details>
<summary><b>Install in Gemini CLI</b></summary>

See [Gemini CLI Configuration](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md) for details.

1. Open the Gemini CLI settings file. The location is `~/.gemini/settings.json` (where `~` is your home directory).

2. Add the following to the `mcpServers` object in your `settings.json` file:

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

If the `mcpServers` object does not exist, create it.

</details>

<details>
<summary><b>Install in Claude Code</b></summary>

Run this command. See [Claude Code MCP docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/tutorials#set-up-model-context-protocol-mcp) for more info.

```sh
claude mcp add coding-agent -- npx coding-agent-mcp
```

</details>

<details>
<summary><b>Install in Claude Desktop</b></summary>

Add this to your Claude Desktop `claude_desktop_config.json` file. See [Claude Desktop MCP docs](https://modelcontextprotocol.io/quickstart/user) for more info.

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in Cline</b></summary>

You can easily install Coding Agent through the [Cline MCP Server Marketplace](https://cline.bot/mcp-marketplace) by following these instructions:

1. Open **Cline**.
2. Click the hamburger menu icon (☰) to enter the **MCP Servers** section.
3. Use the search bar within the **Marketplace** tab to find *Coding Agent*.
4. Click the **Install** button.

Alternatively, add this configuration to your Cline MCP settings:

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

</details>

<details>
<summary><b>Install in BoltAI</b></summary>

Open the "Settings" page of the app, navigate to "Plugins," and enter the following JSON:

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

Once saved, you can use the tools directly. More information is available on [BoltAI's Documentation site](https://docs.boltai.com/docs/plugins/mcp-servers). For BoltAI on iOS, [see this guide](https://docs.boltai.com/docs/boltai-mobile/mcp-servers).

</details>

<details>
<summary><b>Using Docker</b></summary>

If you prefer to run the MCP server in a Docker container:

1. **Build the Docker Image:**

   First, create a `Dockerfile` in the project root (or anywhere you prefer):

   <details>
   <summary>Click to see Dockerfile content</summary>

   ```Dockerfile
   FROM node:18-alpine

   WORKDIR /app

   # Install the latest version globally
   RUN npm install -g coding-agent-mcp

   # Expose default port if needed (optional, depends on MCP client interaction)
   # EXPOSE 3000

   # Default command to run the server
   CMD ["coding-agent-mcp"]
   ```

   </details>

   Then, build the image using a tag (e.g., `coding-agent-mcp`). **Make sure Docker Desktop (or the Docker daemon) is running.** Run the following command in the same directory where you saved the `Dockerfile`:

   ```bash
   docker build -t coding-agent-mcp .
   ```

2. **Configure Your MCP Client:**

   Update your MCP client's configuration to use the Docker command.

   _Example for a cline_mcp_settings.json:_

   ```json
   {
     "mcpServers": {
       "coding-agent": {
         "autoApprove": [],
         "disabled": false,
         "timeout": 60,
         "command": "docker",
         "args": ["run", "-i", "--rm", "coding-agent-mcp"],
         "transportType": "stdio"
       }
     }
   }
   ```

   _Note: This is an example configuration. Please refer to the specific examples for your MCP client (like Cursor, VS Code, etc.) earlier in this README to adapt the structure (e.g., `mcpServers` vs `servers`). Also, ensure the image name in `args` matches the tag used during the `docker build` command._

</details>

<details>
<summary><b>Install on Windows</b></summary>

The configuration on Windows is slightly different compared to Linux or macOS (_`Cline` is used in the example_). The same principle applies to other editors; refer to the configuration of `command` and `args`.

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "cmd",
      "args": ["/c", "npx", "coding-agent-mcp"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

</details>

<details>
<summary><b>Install in Augment Code</b></summary>

To configure Coding Agent MCP in Augment Code, you can use either the graphical interface or manual configuration.

### **A. Using the Augment Code UI**

1. Click the hamburger menu.
2. Select **Settings**.
3. Navigate to the **Tools** section.
4. Click the **+ Add MCP** button.
5. Enter the following command:
   ```
   npx coding-agent-mcp
   ```
6. Name the MCP: **Coding Agent**.
7. Click the **Add** button.

Once the MCP server is added, you can start using Coding Agent's comprehensive coding features directly within Augment Code.

---

### **B. Manual Configuration**

1. Press Cmd/Ctrl Shift P or go to the hamburger menu in the Augment panel
2. Select Edit Settings
3. Under Advanced, click Edit in settings.json
4. Add the server configuration to the `mcpServers` array in the `augment.advanced` object

```json
"augment.advanced": {
  "mcpServers": [
    {
      "name": "coding-agent",
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  ]
}
```

Once the MCP server is added, restart your editor. If you receive any errors, check the syntax to make sure closing brackets or commas are not missing.

</details>

<details>
<summary><b>Install in Roo Code</b></summary>

Add this to your Roo Code MCP configuration file. See [Roo Code MCP docs](https://docs.roocode.com/features/mcp/using-mcp-in-roo) for more info.

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in Zencoder</b></summary>

To configure Coding Agent MCP in Zencoder, follow these steps:

1. Go to the Zencoder menu (...)
2. From the dropdown menu, select Agent tools
3. Click on the Add custom MCP
4. Add the name and server configuration from below, and make sure to hit the Install button

```json
{
  "command": "npx",
  "args": ["coding-agent-mcp"]
}
```

Once the MCP server is added, you can easily continue using it.

</details>

<details>
<summary><b>Install in Amazon Q Developer CLI</b></summary>

Add this to your Amazon Q Developer CLI configuration file. See [Amazon Q Developer CLI docs](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-mcp-configuration.html) for more details.

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in Qodo Gen</b></summary>

See [Qodo Gen docs](https://docs.qodo.ai/qodo-documentation/qodo-gen/qodo-gen-chat/agentic-mode/agentic-tools-mcps) for more details.

1. Open Qodo Gen chat panel in VSCode or IntelliJ.
2. Click Connect more tools.
3. Click + Add new MCP.
4. Add the following configuration:

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in JetBrains AI Assistant</b></summary>

See [JetBrains AI Assistant Documentation](https://www.jetbrains.com/help/ai-assistant/configure-an-mcp-server.html) for more details.

1. In JetBrains IDEs go to `Settings` → `Tools` → `AI Assistant` → `Model Context Protocol (MCP)`
2. Click `+ Add`.
3. Click on `Command` in the top-left corner of the dialog and select the As JSON option from the list
4. Add this configuration and click `OK`

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

5. Click `Apply` to save changes.
6. The same way coding-agent could be added for JetBrains Junie in `Settings` → `Tools` → `Junie` → `MCP Settings`

</details>

<details>
<summary><b>Install in Warp</b></summary>

See [Warp Model Context Protocol Documentation](https://docs.warp.dev/knowledge-and-collaboration/mcp#adding-an-mcp-server) for details.

1. Navigate `Settings` > `AI` > `Manage MCP servers`.
2. Add a new MCP server by clicking the `+ Add` button.
3. Paste the configuration given below:

```json
{
  "coding-agent": {
    "command": "npx",
    "args": ["coding-agent-mcp"],
    "env": {},
    "working_directory": null,
    "start_on_launch": true
  }
}
```

4. Click `Save` to apply the changes.

</details>

<details>
<summary><b>Install in Opencode</b></summary>

Add this to your Opencode configuration file. See [Opencode MCP docs](https://opencode.ai/docs/mcp-servers) docs for more info.

```json
{
  "mcp": {
    "coding-agent": {
      "type": "local",
      "command": ["npx", "coding-agent-mcp"],
      "enabled": true
    }
  }
}
```

</details>

<details>
<summary><b>Install in Copilot Coding Agent</b></summary>

## Using Coding Agent with Copilot Coding Agent

Add the following configuration to the `mcp` section of your Copilot Coding Agent configuration file Repository->Settings->Copilot->Coding agent->MCP configuration:

```json
{
  "mcpServers": {
    "coding-agent": {
      "type": "stdio",
      "command": "npx",
      "args": ["coding-agent-mcp"]
    }
  }
}
```

For more information, see the [official GitHub documentation](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp).

</details>

<details>
<summary><b>Install in Kiro</b></summary>

See [Kiro Model Context Protocol Documentation](https://kiro.dev/docs/mcp/configuration/) for details.

1. Navigate `Kiro` > `MCP Servers`
2. Add a new MCP server by clicking the `+ Add` button.
3. Paste the configuration given below:

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "npx",
      "args": ["coding-agent-mcp"],
      "env": {},
      "disabled": false,
      "autoApprove": [
        "read_file",
        "list_directory",
        "get_working_directory",
        "get_environment",
        "search_text",
        "search_files",
        "get_system_info"
      ]
    }
  }
}
```

4. Click `Save` to apply the changes.

</details>

<details>
<summary><b>Install in OpenAI Codex</b></summary>

See [OpenAI Codex](https://github.com/openai/codex) for more information.

Add the following configuration to your OpenAI Codex MCP server settings:

```toml
[mcp_servers.coding-agent]
args = ["coding-agent-mcp"]
command = "npx"
```

</details>

<details>
<summary><b>Install from Source</b></summary>

For development or custom builds:

```bash
git clone https://github.com/sukarth/coding-agent-mcp.git
cd coding-agent-mcp
npm install
npm run build
npm start
```

Or configure your MCP client to use the local build:

```json
{
  "mcpServers": {
    "coding-agent": {
      "command": "node",
      "args": ["/path/to/coding-agent-mcp/dist/index.js"],
      "disabled": false
    }
  }
}
```

</details>

## Available Tools

**Total: 27 Tools across 4 categories**

### File Operations (10 tools)
- `read_file` - Read file contents with encoding support
- `write_file` - Write content to file (overwrites existing)
- `create_file` - Create new file with optional content and overwrite protection
- `edit_file` - Edit file using 4 methods (replace, line-numbers, character-match, diff)
- `delete_file` - Delete a file safely
- `copy_file` - Copy file to new location with overwrite control
- `move_file` - Move/rename file with overwrite control
- `list_directory` - List directory contents (recursive/non-recursive)
- `create_directory` - Create directory with recursive option
- `delete_directory` - Delete directory with recursive option

### Terminal Operations (5 tools)
- `run_command` - Execute terminal command with working directory and timeout control
- `run_command_stream` - Execute command with real-time streaming output
- `get_environment` - Get and filter environment variables
- `get_working_directory` - Get current working directory
- `which_command` - Find command path (cross-platform which/where)

### Search Operations (4 tools)
- `search_text` - Search for text patterns in files with regex, case sensitivity, context
- `search_files` - Search for files by name pattern with glob support
- `find_and_replace` - Bulk find and replace across files with dry-run mode
- `search_duplicates` - Find duplicate files by content, name, or size

### Utility Operations (8 tools)
- `delay` - Wait for specified time (milliseconds or seconds)
- `get_system_info` - Get system information (basic or detailed)
- `generate_uuid` - Generate UUIDs (v1 and v4, single or multiple)
- `encode_decode` - Encode/decode text (Base64, URL, HTML)
- `hash_text` - Generate text hashes (MD5, SHA1, SHA256, SHA512)
- `format_json` - Format and validate JSON with key sorting
- `validate_regex` - Validate and test regular expressions
- `calculate_file_stats` - Calculate comprehensive file statistics

## File Editing Methods

The `edit_file` tool supports multiple editing approaches:

### 1. String Replace
```json
{
  "method": "replace",
  "target": "old text",
  "replacement": "new text"
}
```

### 2. Line Numbers
```json
{
  "method": "line-numbers",
  "startLine": 5,
  "endLine": 7,
  "replacement": "new content"
}
```

### 3. Character Matching
```json
{
  "method": "character-match",
  "startChar": 100,
  "endChar": 150,
  "replacement": "new content"
}
```

### 4. Diff-based
```json
{
  "method": "diff",
  "diffContent": "unified diff content",
  "diffFormat": "unified"
}
```

## Performance & Limits

- **File Size**: Handles files up to 10MB efficiently
- **Command Timeout**: Default 30 seconds (configurable)
- **Search Results**: Limited to 100 matches by default
- **Concurrent Operations**: Optimized for single-threaded usage
- **Memory Usage**: ~50MB typical, ~100MB peak

## Development

### Setup
```bash
git clone https://github.com/sukarth/coding-agent-mcp.git
cd coding-agent-mcp
npm install
```

### Build
```bash
npm run build
```

### Test
```bash
npm test
npm run test:watch  # Watch mode
```

### Development Mode
```bash
npm run dev
```
## 📚 Development Usage Examples

Once installed, the MCP server provides 27 tools across 4 categories. Here are some practical examples of how you can use these tools in your code.

> **Note:** The following examples show how MCP clients interact with the Coding Agent MCP server using the `callTool` function. These code samples are intended for use within an MCP client environment (such as Cursor, Kiro, Claude Desktop, etc.) that provides the `callTool` API. The MCP client handles all communication with the server automatically. These examples will not work in a regular Node.js script unless you have an MCP client SDK and the server properly set up.

### 🗂️ File Operations Examples

#### Reading and Writing Files
```javascript
// Read a configuration file
await callTool('read_file', { 
  path: 'package.json',
  encoding: 'utf8'
});

// Create a new file with content
await callTool('create_file', {
  path: 'src/config.ts',
  content: 'export const API_URL = "https://api.example.com";',
  overwrite: false
});

// Write data to a file (overwrites existing)
await callTool('write_file', {
  path: 'output/results.json',
  content: JSON.stringify({ status: 'success', data: [] }, null, 2)
});
```

#### Advanced File Editing
```javascript
// Replace all occurrences of a string
await callTool('edit_file', {
  path: 'src/constants.ts',
  method: 'replace',
  target: 'localhost:3000',
  replacement: 'production.example.com'
});

// Edit specific lines
await callTool('edit_file', {
  path: 'README.md',
  method: 'line-numbers',
  startLine: 15,
  endLine: 17,
  replacement: '## Updated Section\n\nThis content has been updated.'
});

// Precise character-based editing
await callTool('edit_file', {
  path: 'src/app.js',
  method: 'character-match',
  startChar: 245,
  endChar: 267,
  replacement: 'newFunctionName'
});
```

#### Directory Operations
```javascript
// List directory contents recursively
await callTool('list_directory', {
  path: './src',
  recursive: true,
  includeHidden: false
});

// Create nested directories
await callTool('create_directory', {
  path: 'src/components/ui/buttons',
  recursive: true
});

// Copy files with overwrite protection
await callTool('copy_file', {
  source: 'template.config.js',
  destination: 'project.config.js',
  overwrite: false
});
```

### 💻 Terminal Operations Examples

#### Command Execution
```javascript
// Run tests in a specific directory
await callTool('run_command', {
  command: 'npm test',
  workingDirectory: './my-project',
  timeout: 60000
});

// Install dependencies with environment variables
await callTool('run_command', {
  command: 'npm install',
  workingDirectory: './frontend',
  env: { NODE_ENV: 'development' }
});

// Stream long-running command output
await callTool('run_command_stream', {
  command: 'npm run build:watch',
  workingDirectory: './app',
  timeout: 300000
});
```

#### Environment and System Info
```javascript
// Get Node.js related environment variables
await callTool('get_environment', {
  filter: 'NODE'
});

// Find where a command is located
await callTool('which_command', {
  command: 'git'
});

// Get current working directory
await callTool('get_working_directory', {});
```

### 🔍 Search Operations Examples

#### Text Search
```javascript
// Find TODO comments in source code
await callTool('search_text', {
  pattern: 'TODO|FIXME|HACK',
  directory: './src',
  recursive: true,
  caseSensitive: false,
  contextLines: 2
});

// Search for function definitions
await callTool('search_text', {
  pattern: 'function\\s+\\w+\\(',
  directory: './lib',
  filePattern: '*.js',
  wholeWord: false,
  maxResults: 50
});
```

#### File Search
```javascript
// Find all TypeScript files
await callTool('search_files', {
  pattern: '*.ts',
  directory: './src',
  recursive: true,
  type: 'file'
});

// Find configuration files
await callTool('search_files', {
  pattern: '*config*',
  directory: '.',
  includeHidden: true,
  maxResults: 20
});
```

#### Find and Replace
```javascript
// Update import statements (dry run first)
await callTool('find_and_replace', {
  findPattern: 'import.*from [\'"]lodash[\'"]',
  replaceWith: 'import * as _ from "lodash"',
  directory: './src',
  filePattern: '*.ts',
  dryRun: true
});

// Replace API endpoints across the project
await callTool('find_and_replace', {
  findPattern: 'https://old-api.example.com',
  replaceWith: 'https://new-api.example.com',
  directory: './src',
  recursive: true,
  dryRun: false
});
```

#### Duplicate Detection
```javascript
// Find duplicate files by content
await callTool('search_duplicates', {
  directory: './assets',
  method: 'content',
  recursive: true,
  minSize: 1024
});

// Find files with duplicate names
await callTool('search_duplicates', {
  directory: './src',
  method: 'name',
  filePattern: '*.js'
});
```

### 🛠️ Utility Operations Examples

#### Time and Delays
```javascript
// Add a delay between operations
await callTool('delay', {
  seconds: 2
});

// Precise millisecond delay
await callTool('delay', {
  milliseconds: 1500
});
```

#### System Information
```javascript
// Get basic system info
await callTool('get_system_info', {
  detailed: false
});

// Get detailed system information
await callTool('get_system_info', {
  detailed: true
});
```

#### Text Processing
```javascript
// Generate UUIDs for database records
await callTool('generate_uuid', {
  version: 4,
  count: 5
});

// Encode sensitive data
await callTool('encode_decode', {
  text: 'sensitive-api-key',
  method: 'base64-encode'
});

// Generate file checksums
await callTool('hash_text', {
  text: 'file content here',
  algorithm: 'sha256',
  encoding: 'hex'
});
```

#### JSON and Regex
```javascript
// Format and validate JSON
await callTool('format_json', {
  json: '{"name":"test","values":[1,2,3]}',
  indent: 2,
  sortKeys: true
});

// Test regex patterns
await callTool('validate_regex', {
  pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  testString: 'user@example.com',
  flags: 'i'
});$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',$',
  testString: 'user@example.com',
  flags: 'i'
});
```

#### File Statistics
```javascript
// Analyze project file statistics
await callTool('calculate_file_stats', {
  directory: './src',
  recursive: true,
  filePattern: '*'
});
```

### 🔄 Workflow Examples

#### Project Setup Automation
```javascript
// 1. Create project structure
await callTool('create_directory', { path: 'my-app/src/components', recursive: true });
await callTool('create_directory', { path: 'my-app/tests', recursive: true });

// 2. Copy template files
await callTool('copy_file', { 
  source: 'templates/package.json', 
  destination: 'my-app/package.json' 
});

// 3. Install dependencies
await callTool('run_command', {
  command: 'npm install',
  workingDirectory: './my-app'
});

// 4. Run initial build
await callTool('run_command', {
  command: 'npm run build',
  workingDirectory: './my-app'
});
```

#### Code Refactoring
```javascript
// 1. Find all files using old API
const searchResult = await callTool('search_text', {
  pattern: 'oldApiFunction',
  directory: './src',
  recursive: true
});

// 2. Replace with new API (dry run first)
await callTool('find_and_replace', {
  findPattern: 'oldApiFunction\\(',
  replaceWith: 'newApiFunction(',
  directory: './src',
  dryRun: true
});

// 3. Apply changes
await callTool('find_and_replace', {
  findPattern: 'oldApiFunction\\(',
  replaceWith: 'newApiFunction(',
  directory: './src',
  dryRun: false
});

// 4. Run tests to verify
await callTool('run_command', {
  command: 'npm test',
  workingDirectory: '.'
});
```


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

### v1.0.0 - Latest
- ✅ **27 tools** across 4 categories
- ✅ **48 comprehensive tests** (100% pass rate)
- ✅ **Cross-platform support** (Windows, macOS, Linux)
- ✅ **Production-ready** with full error handling
- ✅ **TypeScript** implementation with strict typing

---
<br>

**Made with ❤️ by [Sukarth Acharya](https://github.com/sukarth)**

