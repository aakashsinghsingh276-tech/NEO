'use server';
/**
 * @fileOverview A Genkit flow for generating full-stack project structures from natural language descriptions.
 *
 * - generateFullStackProject - A function that handles the generation of a full-stack project.
 * - GenerateFullStackProjectInput - The input type for the generateFullStackProject function.
 * - GenerateFullStackProjectOutput - The return type for the generateFullStackProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFullStackProjectInputSchema = z.object({
  requirements: z
    .string()
    .describe(
      'Natural language description of the application requirements, including desired features, technologies, and functionalities.'
    ),
});
export type GenerateFullStackProjectInput = z.infer<typeof GenerateFullStackProjectInputSchema>;

const ProjectFileSchema = z.object({
  fileName: z.string().describe('The name of the file, including its path relative to the project root (e.g., "frontend/src/App.tsx", "backend/routes/users.js", "database/schema.sql").'),
  content: z.string().describe('The content of the file.'),
});

const GenerateFullStackProjectOutputSchema = z.object({
  frontend: z.object({
    files: z.array(ProjectFileSchema).describe('A list of frontend files with their names and content.'),
  }).describe('The generated frontend project structure.'),
  backend: z.object({
    files: z.array(ProjectFileSchema).describe('A list of backend files with their names and content.'),
  }).describe('The generated backend project structure.'),
  databaseSchema: z.string().describe('The database schema (e.g., SQL DDL statements, or a JSON/YAML representation for NoSQL databases).'),
  explanation: z.string().describe('A brief explanation of the generated project structure and architectural choices.'),
});
export type GenerateFullStackProjectOutput = z.infer<typeof GenerateFullStackProjectOutputSchema>;

export async function generateFullStackProject(
  input: GenerateFullStackProjectInput
): Promise<GenerateFullStackProjectOutput> {
  return generateFullStackProjectFlow(input);
}

const generateFullStackProjectPrompt = ai.definePrompt({
  name: 'generateFullStackProjectPrompt',
  input: {schema: GenerateFullStackProjectInputSchema},
  output: {schema: GenerateFullStackProjectOutputSchema},
  prompt: `You are an expert full-stack architect and developer. Your task is to generate a complete project structure, including frontend code, backend code, and database schema, based on the user's application requirements.

The output must be a valid JSON object strictly adhering to the provided output schema.

Application Requirements:
{{{requirements}}}

Based on these requirements, generate the necessary files for a modern full-stack application.
For the frontend, consider common frameworks like React, Vue, or Angular, and provide example component files.
For the backend, consider frameworks like Node.js (Express), Python (FastAPI/Django), or Go (Gin/Echo), and provide example API endpoints, service files, and configuration.
For the database schema, provide a standard SQL DDL (Data Definition Language) script or a suitable NoSQL schema representation.

Ensure all file paths are relative to the project root and include appropriate file extensions.
Provide a clear explanation of your architectural choices and the overall structure.`,
});

const generateFullStackProjectFlow = ai.defineFlow(
  {
    name: 'generateFullStackProjectFlow',
    inputSchema: GenerateFullStackProjectInputSchema,
    outputSchema: GenerateFullStackProjectOutputSchema,
  },
  async input => {
    const {output} = await generateFullStackProjectPrompt(input);
    if (!output) {
      throw new Error('Failed to generate full stack project structure.');
    }
    return output;
  }
);
