'use server';
/**
 * @fileOverview The core AI reasoning engine for the NEOCADE IDE.
 * 
 * This flow analyzes user requests and can suggest file system changes 
 * (creating files/folders) and write code in various languages.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IDEActionSchema = z.object({
  type: z.enum(['createFile', 'createFolder', 'updateCode', 'message']),
  path: z.string().optional().describe('Relative path for the file or folder'),
  content: z.string().optional().describe('Code content for files'),
  message: z.string().optional().describe('Explanation or response text'),
});

const IDEAgentInputSchema = z.object({
  prompt: z.string().describe('The user command or question'),
  context: z.object({
    currentFile: z.string().optional(),
    currentCode: z.string().optional(),
    fileList: z.array(z.string()).optional(),
  }).optional(),
});
export type IDEAgentInput = z.infer<typeof IDEAgentInputSchema>;

const IDEAgentOutputSchema = z.object({
  response: z.string().describe('Natural language response'),
  actions: z.array(IDEActionSchema).describe('Structural actions to perform in the IDE'),
});
export type IDEAgentOutput = z.infer<typeof IDEAgentOutputSchema>;

export async function ideAgent(input: IDEAgentInput): Promise<IDEAgentOutput> {
  return ideAgentFlow(input);
}

const idePrompt = ai.definePrompt({
  name: 'ideAgentPrompt',
  input: { schema: IDEAgentInputSchema },
  output: { schema: IDEAgentOutputSchema },
  prompt: `You are the NEOCADE Quantum AI Architect. You control the development environment.
The user will ask you to write code, create project structures, or analyze things.

Context:
- Current File: {{{context.currentFile}}}
- Current Code: 
"""{{{context.currentCode}}}"""
- Existing Files: {{#each context.fileList}} - {{{this}}} {{/each}}

Instructions:
1. If the user asks for a project structure, output a list of 'createFile' and 'createFolder' actions.
2. If the user asks to write code, provide a 'createFile' or 'updateCode' action with the full content.
3. Always provide a helpful 'response' message in the JSON.
4. If asked to 'Analyze Code', identify bugs or performance issues in the 'response' and suggest fixes.
5. If the user says 'Generate a project for X', create a full directory structure including README and config files.

User Prompt: {{{prompt}}}`,
});

const ideAgentFlow = ai.defineFlow(
  {
    name: 'ideAgentFlow',
    inputSchema: IDEAgentInputSchema,
    outputSchema: IDEAgentOutputSchema,
  },
  async (input) => {
    const { output } = await idePrompt(input);
    if (!output) throw new Error('AI failed to reason about the request.');
    return output;
  }
);
