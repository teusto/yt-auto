/**
 * Enhanced Config Validator
 * Provides detailed validation with helpful error messages and suggestions
 */

import { CONFIG_SCHEMA, CONFIG_PRESETS, getFieldSchema } from './schema.js';

/**
 * Validation result structure
 */
class ValidationResult {
  constructor() {
    this.errors = [];      // Blocking errors
    this.warnings = [];    // Non-blocking warnings
    this.suggestions = []; // Helpful suggestions
    this.autoFixes = [];   // Possible auto-fixes
  }

  addError(field, message, fix = null) {
    this.errors.push({ field, message, severity: 'error' });
    if (fix) this.autoFixes.push({ field, fix });
  }

  addWarning(field, message, suggestion = null) {
    this.warnings.push({ field, message, severity: 'warning' });
    if (suggestion) this.suggestions.push({ field, suggestion });
  }

  addSuggestion(field, message) {
    this.suggestions.push({ field, message });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasIssues() {
    return this.errors.length > 0 || this.warnings.length > 0;
  }

  /**
   * Print validation results with colors and formatting
   */
  print() {
    if (!this.hasIssues()) {
      console.log('✅ Config validation passed!\n');
      return;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 Config Validation Results');
    console.log('='.repeat(60) + '\n');

    // Print errors
    if (this.errors.length > 0) {
      console.log('❌ ERRORS (must fix):');
      this.errors.forEach(({ field, message }) => {
        console.log(`   • ${field}: ${message}`);
      });
      console.log('');
    }

    // Print warnings
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS (recommended to fix):');
      this.warnings.forEach(({ field, message }) => {
        console.log(`   • ${field}: ${message}`);
      });
      console.log('');
    }

    // Print suggestions
    if (this.suggestions.length > 0) {
      console.log('💡 SUGGESTIONS:');
      this.suggestions.forEach(({ field, suggestion }) => {
        console.log(`   • ${field}: ${suggestion}`);
      });
      console.log('');
    }

    // Print auto-fixes
    if (this.autoFixes.length > 0) {
      console.log('🔧 AUTO-FIX SUGGESTIONS:');
      this.autoFixes.forEach(({ field, fix }) => {
        console.log(`   • ${field}: ${fix}`);
      });
      console.log('');
    }

    console.log('='.repeat(60) + '\n');
  }

  /**
   * Get simple summary for logging
   */
  getSummary() {
    if (!this.hasIssues()) return 'Valid';
    return `${this.errors.length} errors, ${this.warnings.length} warnings`;
  }
}

/**
 * Validate a value against schema rules
 */
function validateValue(value, schema, fieldPath) {
  const result = new ValidationResult();

  if (value === undefined || value === null) {
    if (schema.required) {
      result.addError(
        fieldPath,
        `Required field is missing`,
        schema.default !== undefined ? `Add: "${fieldPath}": ${JSON.stringify(schema.default)}` : null
      );
    }
    return result;
  }

  // Type checking
  const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
  const actualType = Array.isArray(value) ? 'array' : typeof value;
  
  if (!expectedTypes.includes(actualType)) {
    result.addError(
      fieldPath,
      `Invalid type. Expected ${expectedTypes.join(' or ')}, got ${actualType}`,
      `Change to valid ${schema.type} value`
    );
    return result;
  }

  // Valid values (enum)
  if (schema.validValues && !schema.validValues.includes(value)) {
    const suggestions = schema.validValues.join(', ');
    result.addError(
      fieldPath,
      `Invalid value "${value}". Must be one of: ${suggestions}`,
      `Use one of: ${suggestions}`
    );
  }

  // Number range validation
  if (typeof value === 'number') {
    if (schema.min !== undefined && value < schema.min) {
      result.addError(
        fieldPath,
        `Value ${value} is below minimum ${schema.min}`,
        `Set to at least ${schema.min}`
      );
    }
    if (schema.max !== undefined && value > schema.max) {
      result.addError(
        fieldPath,
        `Value ${value} exceeds maximum ${schema.max}`,
        `Set to at most ${schema.max}`
      );
    }
  }

  // String validation
  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      result.addWarning(
        fieldPath,
        `Value "${value}" doesn't match expected pattern`
      );
    }
  }

  // Add examples as suggestions if provided
  if (schema.examples && !schema.validValues) {
    result.addSuggestion(
      fieldPath,
      `Examples: ${schema.examples.join(', ')}`
    );
  }

  return result;
}

/**
 * Recursively validate object against schema
 */
function validateObject(obj, schema, basePath = '') {
  const result = new ValidationResult();

  if (!obj || typeof obj !== 'object') {
    result.addError(basePath || 'root', 'Expected object');
    return result;
  }

  // Validate each field in schema
  for (const [field, fieldSchema] of Object.entries(schema)) {
    const fieldPath = basePath ? `${basePath}.${field}` : field;
    const value = obj[field];

    if (fieldSchema.type === 'object' && fieldSchema.schema) {
      // Nested object
      if (value !== undefined) {
        const nestedSchema = typeof fieldSchema.schema === 'string'
          ? CONFIG_SCHEMA[fieldSchema.schema]
          : fieldSchema.schema;
        
        const nestedResult = validateObject(value, nestedSchema, fieldPath);
        result.errors.push(...nestedResult.errors);
        result.warnings.push(...nestedResult.warnings);
        result.suggestions.push(...nestedResult.suggestions);
        result.autoFixes.push(...nestedResult.autoFixes);
      }
    } else {
      // Simple field
      const fieldResult = validateValue(value, fieldSchema, fieldPath);
      result.errors.push(...fieldResult.errors);
      result.warnings.push(...fieldResult.warnings);
      result.suggestions.push(...fieldResult.suggestions);
      result.autoFixes.push(...fieldResult.autoFixes);
    }
  }

  // Check for unknown fields
  for (const field of Object.keys(obj)) {
    if (!schema[field]) {
      result.addWarning(
        basePath ? `${basePath}.${field}` : field,
        'Unknown field (will be ignored)',
        'Remove this field or check for typos'
      );
    }
  }

  return result;
}

/**
 * Validate channel config
 */
export function validateChannelConfig(config) {
  console.log('\n🔍 Validating channel config...');
  
  const result = validateObject(config, CONFIG_SCHEMA.channel);
  
  // Special validations
  if (config.defaults) {
    const defaultsResult = validateObject(
      config.defaults,
      CONFIG_SCHEMA.projectDefaults,
      'defaults'
    );
    result.errors.push(...defaultsResult.errors);
    result.warnings.push(...defaultsResult.warnings);
    result.suggestions.push(...defaultsResult.suggestions);
    result.autoFixes.push(...defaultsResult.autoFixes);
  }

  result.print();
  return result;
}

/**
 * Validate project config
 */
export function validateProjectConfig(config) {
  console.log('\n🔍 Validating project config...');
  
  const result = validateObject(config, CONFIG_SCHEMA.projectDefaults);
  
  result.print();
  return result;
}

/**
 * Check if config uses a preset and apply it
 */
export function applyPreset(config) {
  if (!config.preset) return config;

  const preset = CONFIG_PRESETS[config.preset];
  if (!preset) {
    console.log(`⚠️  Unknown preset: "${config.preset}"`);
    console.log(`   Available presets: ${Object.keys(CONFIG_PRESETS).join(', ')}`);
    return config;
  }

  console.log(`✨ Applying preset: ${preset.name}`);
  console.log(`   ${preset.description}\n`);

  // Merge preset with custom config (custom overrides preset)
  const merged = {
    ...preset.config,
    ...config.customizations || {},
    name: config.name || preset.name,
    description: config.description || preset.description
  };

  delete merged.preset;
  delete merged.customizations;

  return merged;
}

/**
 * List available presets
 */
export function listPresets() {
  console.log('\n📚 Available Config Presets:\n');
  
  for (const [key, preset] of Object.entries(CONFIG_PRESETS)) {
    console.log(`   ${key}`);
    console.log(`   └─ ${preset.description}\n`);
  }
  
  console.log('Usage in channel.json:');
  console.log('{\n  "preset": "youtube-shorts",\n  "name": "My Channel"\n}\n');
}

/**
 * Generate example config based on schema
 */
export function generateExampleConfig(schemaType = 'channel', includeOptional = false) {
  const schema = CONFIG_SCHEMA[schemaType];
  if (!schema) return null;

  const example = {};
  
  for (const [field, fieldSchema] of Object.entries(schema)) {
    if (fieldSchema.required || includeOptional) {
      if (fieldSchema.default !== undefined) {
        example[field] = fieldSchema.default;
      } else if (fieldSchema.type === 'object') {
        if (fieldSchema.schema) {
          const nestedSchemaName = typeof fieldSchema.schema === 'string'
            ? fieldSchema.schema
            : null;
          if (nestedSchemaName) {
            example[field] = generateExampleConfig(nestedSchemaName, includeOptional);
          }
        }
      } else if (fieldSchema.examples) {
        example[field] = fieldSchema.examples[0];
      }
    }
  }

  return example;
}

export { ValidationResult, CONFIG_PRESETS };
