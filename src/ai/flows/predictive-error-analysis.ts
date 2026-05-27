'use server';
/**
 * @fileOverview A predictive AI tool for analyzing code for potential issues.
 *
 * - analyzeCodeForIssues - A function that analyzes code for memory leaks, performance bottlenecks, and security vulnerabilities.
 * - PredictiveErrorAnalysisInput - The input type for the analyzeCodeForIssues function.
 * - PredictiveErrorAnalysisOutput - The return type for the analyzeCodeForIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveErrorAnalysisInputSchema = z.object({
  code: z.string().describe('The source code to be analyzed.'),
  language: z
    .string()
    .optional()
    .describe('The programming language of the source code.'),
});
export type PredictiveErrorAnalysisInput = z.infer<
  typeof PredictiveErrorAnalysisInputSchema
>;

const PredictiveErrorAnalysisOutputSchema = z.object({
  issues: z
    .array(
      z.object({
        type: z
          .enum(["memory leak", "performance bottleneck", "security vulnerability", "bug", "code quality"])
          .describe('The type of issue identified (e.g., memory leak, performance bottleneck, security vulnerability).'),
        description: z.string().describe('A detailed description of the identified issue.'),
        severity: z
          .enum(['critical', 'high', 'medium', 'low', 'info'])
          .describe('The severity of the issue.'),
        lineNumber: z.number().optional().describe('The approximate line number where the issue might be located.'),
        suggestedFix: z.string().describe('A suggested solution or refactoring to address the issue.'),
      })
    )
    .describe('A list of potential issues found in the code.'),
});
export type PredictiveErrorAnalysisOutput = z.infer<
  typeof PredictiveErrorAnalysisOutputSchema
>;

export async function analyzeCodeForIssues(
  input: PredictiveErrorAnalysisInput
): Promise<PredictiveErrorAnalysisOutput> {
  return predictiveErrorAnalysisFlow(input);
}

const predictiveErrorAnalysisPrompt = ai.definePrompt({
  name: 'predictiveErrorAnalysisPrompt',
  input: {schema: PredictiveErrorAnalysisInputSchema},
  output: {schema: PredictiveErrorAnalysisOutputSchema},
  prompt: `You are an expert 