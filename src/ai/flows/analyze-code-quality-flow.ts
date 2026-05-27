'use server';
/**
 * @fileOverview A Genkit flow for analyzing code quality, providing suggestions for improvements, refactorings, and best practices.
 *
 * - analyzeCodeQuality - A function that handles the code quality analysis process.
 * - AnalyzeCodeQualityInput - The input type for the analyzeCodeQuality function.
 * - AnalyzeCodeQualityOutput - The return type for the analyzeCodeQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeQualityInputSchema = z.object({
  code: z.string().describe('The source code to be analyzed for quality.'),
  language: z
    .string()
    .optional()
    .describe('The programming language of the provided code (e.g., "TypeScript", "Python").'),
});
export type AnalyzeCodeQualityInput = z.infer<typeof AnalyzeCodeQualityInputSchema>;

const AnalyzeCodeQualityOutputSchema = z.object({
  summary: z.string().describe('A general summary of the code quality.'),
  improvements: z
    .array(
      z.object({
        category: z
          .enum(['Readability', 'Performance', 'Security', 'Maintainability', 'Error Handling'])
          .describe('The category of the improvement.'),
        suggestion: z.string().describe('A specific suggestion for improvement.'),
        codeSnippet: z
          .string()
          .optional()
          .describe('A relevant code snippet from the input code.'),
        reasoning: z.string().describe('Explanation for the suggestion.'),
      })
    )
    .describe('A list of specific improvements that can be made to the code.'),
  refactorings: z
    .array(
      z.object({
        description: z.string().describe('Description of the refactoring.'),
        originalCode: z.string().optional().describe('The original code block.'),
        refactoredCode: z.string().optional().describe('The suggested refactored code block.'),
        reasoning: z.string().describe('Explanation for the refactoring.'),
      })
    )
    .describe('A list of suggested code refactorings.'),
  bestPractices: z
    .array(z.string())
    .describe('A list of best practices relevant to the provided code.'),
});
export type AnalyzeCodeQualityOutput = z.infer<typeof AnalyzeCodeQualityOutputSchema>;

export async function analyzeCodeQuality(
  input: AnalyzeCodeQualityInput
): Promise<AnalyzeCodeQualityOutput> {
  return analyzeCodeQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodeQualityPrompt',
  input: {schema: AnalyzeCodeQualityInputSchema},
  output: {schema: AnalyzeCodeQualityOutputSchema},
  prompt: `You are an expert AI code quality analyzer.
Your task is to review the provided code, identify areas for improvement, suggest refactorings, and highlight relevant best practices.
Provide a comprehensive analysis in the specified JSON format.

Programming Language: {{{language}}}
Code:
"""{{{code}}}"""

Analyze the code for:
- Readability
- Performance bottlenecks
- Potential security vulnerabilities
- Maintainability issues
- Error handling deficiencies

Provide specific suggestions, with code snippets where applicable, and detailed reasoning.
`,
});

const analyzeCodeQualityFlow = ai.defineFlow(
  {
    name: 'analyzeCodeQualityFlow',
    inputSchema: AnalyzeCodeQualityInputSchema,
    outputSchema: AnalyzeCodeQualityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get output from the prompt.');
    }
    return output;
  }
);
