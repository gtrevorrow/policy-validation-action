import { z } from 'zod';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { LlmValidationResponse, ValidationOptions } from '../types';
import { buildPrompt } from './prompts';

// Define the output schema using Zod. LangChain will use this to enforce JSON output.
const validationResultsSchema = z.object({
  results: z.array(
    z.object({
      policyIndex: z.number(),
      passed: z.boolean(),
      severity: z.enum(['info', 'warning', 'error']),
      reason: z.string(),
    }),
  ),
});

export class LlmService {
  private readonly chatModel: BaseChatModel;

  constructor(options: ValidationOptions) {
    if (
      !options.agenticValidation?.enabled ||
      !options.agenticValidation.provider ||
      !options.agenticValidation.apiKey
    ) {
      throw new Error('Agentic validation is not configured.');
    }
    this.chatModel = this.createChatModel(
      options.agenticValidation.provider,
      options.agenticValidation.apiKey,
      options.agenticValidation.model
    );
  }

  /**
   * Creates the appropriate LangChain chat model instance based on the provider.
   */
  private createChatModel(
    provider: string,
    apiKey: string,
    model?: string,
  ): BaseChatModel {
    switch (provider.toLowerCase()) {
      case 'openai':
        return new ChatOpenAI({ model: model || 'gpt-4-turbo', apiKey });
      case 'xai':
        // xAI uses an OpenAI-compatible API endpoint
        return new ChatOpenAI({
          model: model || 'grok-1',
          apiKey,
          configuration: { baseURL: 'https://api.xai.com/v1' },
        });
      case 'anthropic':
        return new ChatAnthropic({
          model: model || 'claude-3-opus-20240229',
          apiKey,
        });
      case 'google':
        return new ChatGoogleGenerativeAI({
          model: model || 'gemini-1.5-pro',
          apiKey,
        });
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }

  /**
   * Validates policies using the configured LangChain chat model.
   * The implementation is now generic and provider-agnostic.
   */
  public async validate(
    policies: string[],
    knowledgeBase: string,
  ): Promise<LlmValidationResponse[]> {
    const prompt = buildPrompt(policies, knowledgeBase);

    // Attach the Zod schema to the model to get structured, validated output.
    const modelWithStructuredOutput =
      this.chatModel.withStructuredOutput(validationResultsSchema);

    const response = await modelWithStructuredOutput.invoke(prompt);

    return response.results;
  }
}