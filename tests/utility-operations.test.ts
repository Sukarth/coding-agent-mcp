import { UtilityOperations } from '../src/tools/utility-operations';
import { createTestFile, createTestDirectory, TEST_DIR } from './setup';

describe('UtilityOperations', () => {
  let utilityOps: UtilityOperations;

  beforeEach(() => {
    utilityOps = new UtilityOperations();
  });

  describe('delay', () => {
    it('should delay for specified milliseconds', async () => {
      const startTime = Date.now();
      
      const result = await utilityOps.handleTool('delay', {
        milliseconds: 100
      });
      
      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThanOrEqual(90); // Allow some variance
      expect(result.content[0].text).toContain('Delayed for');
    });

    it('should delay for specified seconds', async () => {
      const startTime = Date.now();
      
      const result = await utilityOps.handleTool('delay', {
        seconds: 0.1
      });
      
      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThanOrEqual(90);
      expect(result.content[0].text).toContain('Delayed for');
    });

    it('should throw error for invalid delay', async () => {
      await expect(
        utilityOps.handleTool('delay', { milliseconds: 0 })
      ).rejects.toThrow('Delay time must be greater than 0');
    });
  });

  describe('get_system_info', () => {
    it('should return basic system info', async () => {
      const result = await utilityOps.handleTool('get_system_info', {});
      
      expect(result.content[0].text).toContain('platform');
      expect(result.content[0].text).toContain('architecture');
      expect(result.content[0].text).toContain('nodeVersion');
    });

    it('should return detailed system info', async () => {
      const result = await utilityOps.handleTool('get_system_info', {
        detailed: true
      });
      
      expect(result.content[0].text).toContain('hostname');
      expect(result.content[0].text).toContain('osType');
      expect(result.content[0].text).toContain('totalMemory');
    });
  });

  describe('generate_uuid', () => {
    it('should generate single UUID v4', async () => {
      const result = await utilityOps.handleTool('generate_uuid', {});
      
      const uuid = result.content[0].text;
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate multiple UUIDs', async () => {
      const result = await utilityOps.handleTool('generate_uuid', {
        count: 3
      });
      
      expect(result.content[0].text).toContain('Generated 3 UUIDs');
      const lines = result.content[0].text.split('\n');
      expect(lines.length).toBeGreaterThanOrEqual(4); // Header + 3 UUIDs
    });
  });

  describe('encode_decode', () => {
    it('should encode to base64', async () => {
      const result = await utilityOps.handleTool('encode_decode', {
        text: 'Hello World',
        method: 'base64-encode'
      });
      
      expect(result.content[0].text).toContain('SGVsbG8gV29ybGQ=');
    });

    it('should decode from base64', async () => {
      const result = await utilityOps.handleTool('encode_decode', {
        text: 'SGVsbG8gV29ybGQ=',
        method: 'base64-decode'
      });
      
      expect(result.content[0].text).toContain('Hello World');
    });

    it('should URL encode', async () => {
      const result = await utilityOps.handleTool('encode_decode', {
        text: 'Hello World!',
        method: 'url-encode'
      });
      
      expect(result.content[0].text).toContain('Hello%20World!');
    });

    it('should HTML encode', async () => {
      const result = await utilityOps.handleTool('encode_decode', {
        text: '<script>alert("test")</script>',
        method: 'html-encode'
      });
      
      expect(result.content[0].text).toContain('&lt;script&gt;');
    });
  });

  describe('hash_text', () => {
    it('should generate SHA256 hash', async () => {
      const result = await utilityOps.handleTool('hash_text', {
        text: 'Hello World',
        algorithm: 'sha256'
      });
      
      expect(result.content[0].text).toContain('SHA256 hash');
      expect(result.content[0].text).toMatch(/[0-9a-f]{64}/);
    });

    it('should generate MD5 hash', async () => {
      const result = await utilityOps.handleTool('hash_text', {
        text: 'Hello World',
        algorithm: 'md5'
      });
      
      expect(result.content[0].text).toContain('MD5 hash');
      expect(result.content[0].text).toMatch(/[0-9a-f]{32}/);
    });
  });

  describe('format_json', () => {
    it('should format valid JSON', async () => {
      const result = await utilityOps.handleTool('format_json', {
        json: '{"name":"test","value":123}',
        indent: 2
      });
      
      expect(result.content[0].text).toContain('Formatted JSON:');
      expect(result.content[0].text).toContain('{\n  "name": "test"');
    });

    it('should handle invalid JSON', async () => {
      const result = await utilityOps.handleTool('format_json', {
        json: '{"invalid": json}'
      });
      
      expect(result.content[0].text).toContain('Invalid JSON');
    });

    it('should sort keys when requested', async () => {
      const result = await utilityOps.handleTool('format_json', {
        json: '{"z":1,"a":2,"m":3}',
        sortKeys: true
      });
      
      const formatted = result.content[0].text;
      const aIndex = formatted.indexOf('"a"');
      const mIndex = formatted.indexOf('"m"');
      const zIndex = formatted.indexOf('"z"');
      
      expect(aIndex).toBeLessThan(mIndex);
      expect(mIndex).toBeLessThan(zIndex);
    });
  });

  describe('validate_regex', () => {
    it('should validate correct regex', async () => {
      const result = await utilityOps.handleTool('validate_regex', {
        pattern: '\\d+',
        testString: 'abc123def'
      });
      
      expect(result.content[0].text).toContain('Regular expression is valid');
      expect(result.content[0].text).toContain('Matches: Yes');
      expect(result.content[0].text).toContain('"123"');
    });

    it('should handle invalid regex', async () => {
      const result = await utilityOps.handleTool('validate_regex', {
        pattern: '[invalid'
      });
      
      expect(result.content[0].text).toContain('Invalid regular expression');
    });
  });

  describe('calculate_file_stats', () => {
    it('should calculate file statistics', async () => {
      const testDir = await createTestDirectory('stats-test');
      await createTestFile('stats-test/small.txt', 'small');
      await createTestFile('stats-test/large.js', 'a'.repeat(2000));
      await createTestFile('stats-test/medium.py', 'b'.repeat(500));
      
      // Add a small delay to ensure files are written
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await utilityOps.handleTool('calculate_file_stats', {
        directory: testDir
      });
      
      const resultText = result.content[0].text;
      expect(resultText).toContain('totalFiles');
      expect(resultText).toContain('totalSize');
      expect(resultText).toContain('extensionBreakdown');
      
      // Parse the JSON to check the actual values
      const statsMatch = resultText.match(/File Statistics:\s*\n\s*({[\s\S]*})/);
      if (statsMatch) {
        const stats = JSON.parse(statsMatch[1]);
        expect(stats.totalFiles).toBeGreaterThan(0);
        expect(Object.keys(stats.extensionBreakdown)).toContain('.txt');
        expect(Object.keys(stats.extensionBreakdown)).toContain('.js');
        expect(Object.keys(stats.extensionBreakdown)).toContain('.py');
      } else {
        // Fallback to string matching if JSON parsing fails
        expect(resultText).toContain('.txt');
        expect(resultText).toContain('.js');
        expect(resultText).toContain('.py');
      }
    });
  });
});