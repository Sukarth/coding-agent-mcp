import { TerminalOperations } from '../src/tools/terminal-operations';
import { TEST_DIR } from './setup';

describe('TerminalOperations', () => {
  let terminalOps: TerminalOperations;

  beforeEach(() => {
    terminalOps = new TerminalOperations();
  });

  describe('run_command', () => {
    it('should execute simple command successfully', async () => {
      const result = await terminalOps.handleTool('run_command', {
        command: process.platform === 'win32' ? 'echo Hello' : 'echo "Hello"'
      });
      
      expect(result.content[0].text).toContain('Hello');
      expect(result.content[0].text).toContain('Exit Code: 0');
    });

    it('should handle command with working directory', async () => {
      const command = process.platform === 'win32' ? 'cd' : 'pwd';
      
      const result = await terminalOps.handleTool('run_command', {
        command,
        workingDirectory: TEST_DIR
      });
      
      expect(result.content[0].text).toContain(TEST_DIR);
    });

    it('should handle command failure', async () => {
      const result = await terminalOps.handleTool('run_command', {
        command: 'nonexistentcommand12345'
      });
      
      expect(result.content[0].text).toContain('Exit Code:');
      // Should not be exit code 0 for failed command
      expect(result.content[0].text).not.toContain('Exit Code: 0');
    });

    it('should respect timeout', async () => {
      const startTime = Date.now();
      
      const result = await terminalOps.handleTool('run_command', {
        command: process.platform === 'win32' ? 'timeout /t 2' : 'sleep 2',
        timeout: 500
      });
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1500); // Should timeout before 2 seconds
    });
  });

  describe('get_working_directory', () => {
    it('should return current working directory', async () => {
      const result = await terminalOps.handleTool('get_working_directory', {});
      
      expect(result.content[0].text).toContain('Current Working Directory:');
      expect(result.content[0].text).toContain(process.cwd());
    });
  });

  describe('get_environment', () => {
    it('should return environment variables', async () => {
      const result = await terminalOps.handleTool('get_environment', {});
      
      expect(result.content[0].text).toContain('Environment Variables:');
      expect(result.content[0].text).toContain('PATH');
    });

    it('should filter environment variables', async () => {
      const result = await terminalOps.handleTool('get_environment', {
        filter: 'PATH'
      });
      
      expect(result.content[0].text).toContain('PATH');
    });
  });

  describe('which_command', () => {
    it('should find existing command', async () => {
      const command = process.platform === 'win32' ? 'cmd' : 'ls';
      
      const result = await terminalOps.handleTool('which_command', {
        command
      });
      
      expect(result.content[0].text).toContain(`Command '${command}' found at:`);
    });

    it('should handle non-existent command', async () => {
      const result = await terminalOps.handleTool('which_command', {
        command: 'nonexistentcommand12345'
      });
      
      expect(result.content[0].text).toContain('not found');
    });
  });
});