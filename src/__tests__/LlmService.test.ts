import { LlmService } from '../llm/LlmService';
import { ValidationOptions } from '../types';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Mock the chat model classes to inspect their constructor calls
jest.mock('@langchain/openai');
jest.mock('@langchain/anthropic');
jest.mock('@langchain/google-genai');

describe('LlmService', () => {
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if agentic validation is not configured', () => {
    const options: ValidationOptions = {};
    expect(() => new LlmService(options)).toThrow(
      'Agentic validation is not configured.',
    );
  });

  it('should create ChatOpenAI for openai provider', () => {
    const options: ValidationOptions = {
      agenticValidation: {
        enabled: true,
        provider: 'openai',
        apiKey: mockApiKey,
        model: 'gpt-4o',
      },
    };
    new LlmService(options);
    expect(ChatOpenAI).toHaveBeenCalledWith({
      model: 'gpt-4o',
      apiKey: mockApiKey,
    });
  });

  it('should create ChatOpenAI for xai provider with custom base URL', () => {
    const options: ValidationOptions = {
      agenticValidation: {
        enabled: true,
        provider: 'xai',
        apiKey: mockApiKey,
        model: 'grok-1.5',
      },
    };
    new LlmService(options);
    expect(ChatOpenAI).toHaveBeenCalledWith({
      model: 'grok-1.5',
      apiKey: mockApiKey,
      configuration: { baseURL: 'https://api.xai.com/v1' },
    });
  });

  it('should create ChatAnthropic for anthropic provider', () => {
    const options: ValidationOptions = {
      agenticValidation: {
        enabled: true,
        provider: 'anthropic',
        apiKey: mockApiKey,
        model: 'claude-3-sonnet',
      },
    };
    new LlmService(options);
    expect(ChatAnthropic).toHaveBeenCalledWith({
      model: 'claude-3-sonnet',
      apiKey: mockApiKey,
    });
  });

  it('should create ChatGoogleGenerativeAI for google provider', () => {
    const options: ValidationOptions = {
      agenticValidation: {
        enabled: true,
        provider: 'google',
        apiKey: mockApiKey,
        model: 'gemini-2.5-pro',
      },
    };
    new LlmService(options);
    expect(ChatGoogleGenerativeAI).toHaveBeenCalledWith({
      model: 'gemini-2.5-pro',
      apiKey: mockApiKey,
    });
  });

  it('should use default model names if none is provided', () => {
    const options: ValidationOptions = {
      agenticValidation: {
        enabled: true,
        provider: 'openai',
        apiKey: mockApiKey,
      },
    };
    new LlmService(options);
    expect(ChatOpenAI).toHaveBeenCalledWith({
      model: 'gpt-4-turbo', // The default value
      apiKey: mockApiKey,
    });
  });

  it('should throw an error for an unsupported provider', () => {
    const options: ValidationOptions = {
      agenticValidation: {
        enabled: true,
        provider: 'unsupported-provider',
        apiKey: mockApiKey,
      },
    };
    expect(() => new LlmService(options)).toThrow(
      'Unsupported LLM provider: unsupported-provider',
    );
  });

  it('should successfully validate policies and return structured results', async () => {
    const mockResponse = {
      results: [
        {
          policyIndex: 0,
          passed: false,
          severity: 'warning' as const,
          reason: 'Policy contains variables that require review',
        },
      ],
    };

    // Mock the chat model and its methods
    const mockWithStructuredOutput = jest.fn().mockReturnValue({
      invoke: jest.fn().mockResolvedValue(mockResponse),
    });

    const mockChatModel = {
      withStructuredOutput: mockWithStructuredOutput,
    };

    // Mock ChatOpenAI to return our mock
    (ChatOpenAI as jest.MockedClass<typeof ChatOpenAI>).mockImplementation(
      () => mockChatModel as any,
    );

    const options: ValidationOptions = {
      agenticValidation: {
        enabled: true,
        provider: 'openai',
        apiKey: mockApiKey,
        model: 'gpt-4o',
      },
    };

    const llmService = new LlmService(options);
    const policies = [
      'Allow group ${var.test_group} to manage all-resources in tenancy',
    ];
    const knowledgeBase = 'Test knowledge base content';

    const result = await llmService.validate(policies, knowledgeBase);

    expect(result).toEqual(mockResponse.results);
    expect(mockWithStructuredOutput).toHaveBeenCalledWith(expect.any(Object)); // Zod schema
  });

  it('should handle LLM service errors gracefully', async () => {
    const mockWithStructuredOutput = jest.fn().mockReturnValue({
      invoke: jest.fn().mockRejectedValue(new Error('LLM API error')),
    });

    const mockChatModel = {
      withStructuredOutput: mockWithStructuredOutput,
    };

    (ChatOpenAI as jest.MockedClass<typeof ChatOpenAI>).mockImplementation(
      () => mockChatModel as any,
    );

    const options: ValidationOptions = {
      agenticValidation: {
        enabled: true,
        provider: 'openai',
        apiKey: mockApiKey,
      },
    };

    const llmService = new LlmService(options);
    const policies = [
      'Allow group ${var.test_group} to manage all-resources in tenancy',
    ];
    const knowledgeBase = 'Test knowledge base';

    await expect(llmService.validate(policies, knowledgeBase)).rejects.toThrow(
      'LLM API error',
    );
  });
});