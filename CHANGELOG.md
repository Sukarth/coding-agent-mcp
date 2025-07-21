# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-21

### Added
- Initial release of Coding Agent MCP Server
- **File Operations**: Complete file manipulation suite
  - Read, write, create, edit, delete files
  - Advanced editing methods: replace, line-numbers, character-match, diff
  - Directory operations: list, create, delete
  - File management: copy, move operations
- **Terminal Operations**: Command execution capabilities
  - Run commands with working directory control
  - Real-time command streaming
  - Environment variable management
  - Command path discovery (which/where)
  - Timeout control for long-running commands
- **Search Operations**: Comprehensive search functionality
  - Text search with regex support
  - File search with glob patterns
  - Bulk find and replace operations
  - Duplicate file detection (by content, name, size)
  - Advanced search options (case sensitivity, whole word, context lines)
- **Utility Operations**: Developer utility functions
  - Programmable delays
  - System information retrieval
  - UUID generation (v1 and v4)
  - Text encoding/decoding (Base64, URL, HTML)
  - Cryptographic hashing (MD5, SHA1, SHA256, SHA512)
  - JSON formatting and validation
  - Regular expression validation and testing
  - File statistics calculation
- **Production Ready**: Full test coverage, TypeScript support, proper error handling
- **Cross-Platform**: Windows, macOS, and Linux support
- **MCP Protocol**: Full compliance with Model Context Protocol specification

### Technical Details
- **27 total tools** across 4 categories:
  - File Operations: 10 tools
  - Terminal Operations: 5 tools  
  - Search Operations: 4 tools
  - Utility Operations: 8 tools
- TypeScript implementation with strict type checking
- Comprehensive Jest test suite (48 tests, 100% pass rate)
- Proper error handling and validation
- Cross-platform command execution (Windows, macOS, Linux)
- Efficient file operations with streaming support
- Memory-safe operations with configurable limits
- CLI interface with --help and --version flags

### Documentation
- Complete README with usage and config examples
- API documentation for all tools
- Comprehensive test coverage
- MIT license for open source usage