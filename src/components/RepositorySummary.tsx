"use client";

import React, { useState, useEffect } from 'react';
// Remove the import and define the interface locally
// import { Repository } from '@/lib/github/types';
import Link from 'next/link';

// Define the Repository interface locally
interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface RepositorySummaryProps {
  repository: Repository;
}

// Create result types directly in this file
interface SummaryResult {
  summary: string;
  keyFeatures: string[];
  technologiesUsed: string[];
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  recommendedUses?: string[];
}

// Expanded provider type
type AIProvider = 'openai' | 'mistral' | 'gemini' | 'deepseek' | 'claude';

export default function RepositorySummary({ repository }: RepositorySummaryProps) {
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Force a refresh when provider changes
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Handle provider change
  const handleProviderChange = (newProvider: AIProvider) => {
    console.log(`Changing provider from ${provider} to ${newProvider}`);
    setProvider(newProvider);
    setRefreshKey(prev => prev + 1);
    // Reset state when changing provider
    setSummary(null);
    setError(null);
    setIsLoading(true);
  };
  
  // Fetch summary directly in this component
  useEffect(() => {
    if (!repository) return;
    
    console.log(`Starting summary fetch with provider: ${provider}`);
    setIsLoading(true);
    setError(null);
    
    const fetchSummary = async () => {
      try {
        // Get the README content first
        const [owner, repo] = repository.full_name.split('/');
        
        // Fetch the README using GitHub API
        console.log(`Fetching README for ${repository.full_name}`);
        const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
        
        if (!readmeResponse.ok) {
          throw new Error('Failed to fetch repository README');
        }
        
        const readmeData = await readmeResponse.json();
        const readmeContent = atob(readmeData.content); // Decode base64 content
        
        // Common prompt for all providers
        const promptContent = `Please analyze the following GitHub repository and provide a summary:
                  
Repository Name: ${repository.full_name}
Description: ${repository.description || 'No description provided'}

README Content:
${readmeContent.slice(0, 4000)}

Format your response as a JSON object with the following fields:
- summary: A concise 3-paragraph summary of the repository
- keyFeatures: An array of key features (maximum 5)
- technologiesUsed: An array of technologies used in the project
- difficultyLevel: One of "Beginner", "Intermediate", or "Advanced"
- recommendedUses: An array of recommended use cases`;
        
        // Now call the appropriate AI service
        console.log(`Using AI provider: ${provider}`);
        
        if (provider === 'openai') {
          const openaiKey = localStorage.getItem('openai_api_key');
          if (!openaiKey) {
            throw new Error('OpenAI API key not found. Please add it in Settings.');
          }
          
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: 'You are an AI assistant that summarizes GitHub repositories accurately and concisely.'
                },
                {
                  role: 'user',
                  content: promptContent
                }
              ],
              temperature: 0.3,
              max_tokens: 1000
            })
          });
          
          if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();
            throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData.error?.message || openaiResponse.statusText}`);
          }
          
          const data = await openaiResponse.json();
          const resultText = data.choices[0].message.content;
          
          // Extract JSON from the response
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
          }
          
          setSummary(JSON.parse(jsonMatch[0]));
        } 
        else if (provider === 'mistral') {
          const mistralKey = localStorage.getItem('mistral_api_key');
          if (!mistralKey) {
            throw new Error('Mistral API key not found. Please add it in Settings.');
          }
          
          const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mistralKey}`
            },
            body: JSON.stringify({
              model: 'mistral-medium',
              messages: [
                {
                  role: 'system',
                  content: 'You are an AI assistant that summarizes GitHub repositories accurately and concisely.'
                },
                {
                  role: 'user',
                  content: promptContent
                }
              ],
              temperature: 0.3,
              max_tokens: 1000
            })
          });
          
          if (!mistralResponse.ok) {
            const errorData = await mistralResponse.json();
            throw new Error(`Mistral API error: ${mistralResponse.status} - ${errorData.error?.message || mistralResponse.statusText}`);
          }
          
          const data = await mistralResponse.json();
          const resultText = data.choices[0].message.content;
          
          // Extract JSON from the response
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
          }
          
          setSummary(JSON.parse(jsonMatch[0]));
        }
        else if (provider === 'gemini') {
          const geminiKey = localStorage.getItem('gemini_api_key');
          if (!geminiKey) {
            throw new Error('Gemini API key not found. Please add it in Settings.');
          }
          
          const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are an AI assistant that summarizes GitHub repositories accurately and concisely.
                      
${promptContent}`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1000
              }
            })
          });
          
          if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorData.error?.message || geminiResponse.statusText}`);
          }
          
          const data = await geminiResponse.json();
          const resultText = data.candidates[0].content.parts[0].text;
          
          // Extract JSON from the response
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
          }
          
          setSummary(JSON.parse(jsonMatch[0]));
        }
        else if (provider === 'deepseek') {
          const deepseekKey = localStorage.getItem('deepseek_api_key');
          if (!deepseekKey) {
            throw new Error('DeepSeek API key not found. Please add it in Settings.');
          }
          
          const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${deepseekKey}`
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [
                {
                  role: 'system',
                  content: 'You are an AI assistant that summarizes GitHub repositories accurately and concisely.'
                },
                {
                  role: 'user',
                  content: promptContent
                }
              ],
              temperature: 0.3,
              max_tokens: 1000
            })
          });
          
          if (!deepseekResponse.ok) {
            const errorData = await deepseekResponse.json();
            throw new Error(`DeepSeek API error: ${deepseekResponse.status} - ${errorData.error?.message || deepseekResponse.statusText}`);
          }
          
          const data = await deepseekResponse.json();
          const resultText = data.choices[0].message.content;
          
          // Extract JSON from the response
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
          }
          
          setSummary(JSON.parse(jsonMatch[0]));
        }
        else if (provider === 'claude') {
          const claudeKey = localStorage.getItem('claude_api_key');
          if (!claudeKey) {
            throw new Error('Claude API key not found. Please add it in Settings.');
          }
          
          const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': claudeKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-3-sonnet-20240229',
              max_tokens: 1000,
              temperature: 0.3,
              messages: [
                {
                  role: 'user',
                  content: `You are an AI assistant that summarizes GitHub repositories accurately and concisely.
                  
${promptContent}`
                }
              ]
            })
          });
          
          if (!claudeResponse.ok) {
            const errorData = await claudeResponse.json();
            throw new Error(`Claude API error: ${claudeResponse.status} - ${errorData.error?.message || claudeResponse.statusText}`);
          }
          
          const data = await claudeResponse.json();
          const resultText = data.content[0].text;
          
          // Extract JSON from the response
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
          }
          
          setSummary(JSON.parse(jsonMatch[0]));
        }
      } catch (error) {
        console.error('Error generating summary:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSummary();
  }, [repository, provider, refreshKey]);
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-24"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-lg font-medium mb-2">Unable to Generate Summary</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        
        {error.includes('API key') && (
          <Link 
            href="/settings" 
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Configure API Keys
          </Link>
        )}
        
        {/* Show alternative providers when one fails */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Try another provider:</p>
          <div className="flex flex-wrap gap-2">
            {provider !== 'openai' && (
              <button onClick={() => handleProviderChange('openai')} 
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded">
                OpenAI
              </button>
            )}
            {provider !== 'mistral' && (
              <button onClick={() => handleProviderChange('mistral')} 
                className="px-3 py-1 bg-purple-600 text-white text-xs rounded">
                Mistral
              </button>
            )}
            {provider !== 'gemini' && (
              <button onClick={() => handleProviderChange('gemini')} 
                className="px-3 py-1 bg-green-600 text-white text-xs rounded">
                Gemini
              </button>
            )}
            {provider !== 'claude' && (
              <button onClick={() => handleProviderChange('claude')} 
                className="px-3 py-1 bg-orange-600 text-white text-xs rounded">
                Claude
              </button>
            )}
            {provider !== 'deepseek' && (
              <button onClick={() => handleProviderChange('deepseek')} 
                className="px-3 py-1 bg-indigo-600 text-white text-xs rounded">
                DeepSeek
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Provider selection UI
  const providerSelector = (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm font-medium">AI Provider:</span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleProviderChange('openai')}
          className={`px-3 py-1 text-xs rounded ${
            provider === 'openai' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          OpenAI
        </button>
        
        <button
          onClick={() => handleProviderChange('mistral')}
          className={`px-3 py-1 text-xs rounded ${
            provider === 'mistral' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Mistral
        </button>
        
        <button
          onClick={() => handleProviderChange('gemini')}
          className={`px-3 py-1 text-xs rounded ${
            provider === 'gemini' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Gemini
        </button>
        
        <button
          onClick={() => handleProviderChange('claude')}
          className={`px-3 py-1 text-xs rounded ${
            provider === 'claude' 
              ? 'bg-orange-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Claude
        </button>
        
        <button
          onClick={() => handleProviderChange('deepseek')}
          className={`px-3 py-1 text-xs rounded ${
            provider === 'deepseek' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          DeepSeek
        </button>
      </div>
    </div>
  );
  
  // Display the initial selection state
  if (!summary) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">AI-Generated Summary</h3>
        {providerSelector}
        <p className="text-gray-600 dark:text-gray-300">
          Select an AI provider above to generate a summary for this repository.
        </p>
      </div>
    );
  }
  
  // Display the result
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">AI-Generated Summary</h3>
        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
          Powered by {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </span>
      </div>
      
      {providerSelector}
      
      <div className="prose dark:prose-invert prose-sm max-w-none mb-4">
        <p>{summary.summary}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Key Features</h4>
        <ul className="list-disc pl-5 space-y-1">
          {summary.keyFeatures.map((feature, index) => (
            <li key={index} className="text-sm">{feature}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Technologies</h4>
        <div className="flex flex-wrap gap-2">
          {summary.technologiesUsed.map((tech, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      {summary.difficultyLevel && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Difficulty Level</h4>
          <span 
            className={`text-xs px-2 py-1 rounded-full ${
              summary.difficultyLevel === 'Beginner' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : summary.difficultyLevel === 'Intermediate'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {summary.difficultyLevel}
          </span>
        </div>
      )}
      
      {summary.recommendedUses && summary.recommendedUses.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Recommended Uses</h4>
          <ul className="list-disc pl-5 space-y-1">
            {summary.recommendedUses.map((use, index) => (
              <li key={index} className="text-sm">{use}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 