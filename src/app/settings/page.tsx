"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import HeaderWrapper from '@/components/HeaderWrapper';
import { validateOpenAIKey, validateMistralKey } from '@/lib/ai/key-validator';
import { GitHubClient } from '@/lib/github';

// Simple function to validate GitHub token
const validateGitHubToken = async (token: string): Promise<'valid' | 'invalid'> => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`
      }
    });
    
    if (response.ok) {
      return 'valid';
    } else {
      return 'invalid';
    }
  } catch (error: any) {
    console.error('Error validating GitHub token:', error);
    return 'invalid';
  }
};

// Loading fallback for settings page
function SettingsLoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto mt-12 animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      </div>
    </div>
  );
}

function SettingsContent() {
  const router = useRouter();
  const [openaiKey, setOpenaiKey] = useState('');
  const [mistralKey, setMistralKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [defaultProvider, setDefaultProvider] = useState<'openai' | 'mistral' | 'gemini' | 'deepseek' | 'claude'>('openai');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [keyStatus, setKeyStatus] = useState({
    openai: 'unknown' as 'valid' | 'invalid' | 'limited' | 'unknown',
    mistral: 'unknown' as 'valid' | 'invalid' | 'limited' | 'unknown',
    github: 'unknown' as 'valid' | 'invalid' | 'unknown'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved keys from localStorage
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    const savedMistralKey = localStorage.getItem('mistral_api_key') || '';
    const savedGeminiKey = localStorage.getItem('gemini_api_key') || '';
    const savedDeepseekKey = localStorage.getItem('deepseek_api_key') || '';
    const savedClaudeKey = localStorage.getItem('claude_api_key') || '';
    const savedGithubToken = localStorage.getItem('github_token') || '';
    const savedProvider = localStorage.getItem('default_ai_provider') as 'openai' | 'mistral' | 'gemini' | 'deepseek' | 'claude' || 'openai';
    
    setOpenaiKey(savedOpenaiKey);
    setMistralKey(savedMistralKey);
    setGeminiKey(savedGeminiKey);
    setDeepseekKey(savedDeepseekKey);
    setClaudeKey(savedClaudeKey);
    setGithubToken(savedGithubToken);
    setDefaultProvider(savedProvider);
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    setError(null);
    
    try {
      // Validate OpenAI key if provided
      if (openaiKey) {
        setKeyStatus(prev => ({...prev, openai: 'unknown'}));
        const openaiStatus = await validateOpenAIKey(openaiKey);
        setKeyStatus(prev => ({...prev, openai: openaiStatus}));
        
        if (openaiStatus === 'invalid') {
          throw new Error('Invalid OpenAI API key');
        }
        
        if (openaiStatus === 'limited') {
          console.warn('OpenAI API key is valid but has usage limits');
        }
      }
      
      // Validate Mistral key if provided
      if (mistralKey) {
        setKeyStatus(prev => ({...prev, mistral: 'unknown'}));
        const mistralStatus = await validateMistralKey(mistralKey);
        setKeyStatus(prev => ({...prev, mistral: mistralStatus}));
        
        if (mistralStatus === 'invalid') {
          throw new Error('Invalid Mistral API key');
        }
      }
      
      // Validate GitHub token if provided
      if (githubToken) {
        setKeyStatus(prev => ({...prev, github: 'unknown'}));
        const githubStatus = await validateGitHubToken(githubToken);
        setKeyStatus(prev => ({...prev, github: githubStatus}));
        
        if (githubStatus === 'invalid') {
          throw new Error('Invalid GitHub token');
        }
        
        // Update GitHub client with new token
        GitHubClient.updateToken(githubToken.trim());
      }
      
      // Save valid keys to localStorage
      if (openaiKey) {
        localStorage.setItem('openai_api_key', openaiKey.trim());
      }
      
      if (mistralKey) {
        localStorage.setItem('mistral_api_key', mistralKey.trim());
      }
      
      if (geminiKey) {
        localStorage.setItem('gemini_api_key', geminiKey.trim());
      }
      
      if (deepseekKey) {
        localStorage.setItem('deepseek_api_key', deepseekKey.trim());
      }
      
      if (claudeKey) {
        localStorage.setItem('claude_api_key', claudeKey.trim());
      }
      
      if (githubToken) {
        localStorage.setItem('github_token', githubToken.trim());
      }
      
      localStorage.setItem('default_ai_provider', defaultProvider);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Failed to save API keys:', error);
      setError(error.message);
      setSaveStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">GitHub Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Enter your GitHub personal access token to access repositories and increase rate limits.
              For public repositories, this is optional but recommended.
            </p>
            
            <div>
              <label htmlFor="github-token" className="block text-sm font-medium mb-1">
                GitHub Personal Access Token
              </label>
              <input
                id="github-token"
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
              />
              {keyStatus.github === 'valid' && (
                <p className="mt-1 text-xs text-green-500">
                  ✓ Valid GitHub token
                </p>
              )}
              {keyStatus.github === 'invalid' && (
                <p className="mt-1 text-xs text-red-500">
                  ✗ Invalid GitHub token
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Create a token with <code>repo</code> scope at{' '}
                <a 
                  href="https://github.com/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  GitHub Developer Settings
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">AI Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Enter your API keys to use AI-powered features. Your keys are stored locally in your browser
              and are never sent to our servers.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="openai-key" className="block text-sm font-medium mb-1">
                  OpenAI API Key
                </label>
                <input
                  id="openai-key"
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Get your key from{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    OpenAI Dashboard
                  </a>
                </p>
              </div>
              
              <div>
                <label htmlFor="mistral-key" className="block text-sm font-medium mb-1">
                  Mistral AI API Key
                </label>
                <input
                  id="mistral-key"
                  type="password"
                  value={mistralKey}
                  onChange={(e) => setMistralKey(e.target.value)}
                  placeholder="..."
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Get your key from{' '}
                  <a 
                    href="https://console.mistral.ai/api-keys/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mistral AI Console
                  </a>
                </p>
              </div>
              
              <div>
                <label htmlFor="gemini-key" className="block text-sm font-medium mb-1">
                  Google Gemini API Key
                </label>
                <input
                  id="gemini-key"
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="..."
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Get your key from{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
              
              <div>
                <label htmlFor="claude-key" className="block text-sm font-medium mb-1">
                  Anthropic Claude API Key
                </label>
                <input
                  id="claude-key"
                  type="password"
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Get your key from{' '}
                  <a 
                    href="https://console.anthropic.com/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Anthropic Console
                  </a>
                </p>
              </div>
              
              <div>
                <label htmlFor="deepseek-key" className="block text-sm font-medium mb-1">
                  DeepSeek API Key
                </label>
                <input
                  id="deepseek-key"
                  type="password"
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  placeholder="..."
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Get your key from DeepSeek's developer portal
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">Default AI Provider</h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ai-provider"
                  value="openai"
                  checked={defaultProvider === 'openai'}
                  onChange={() => setDefaultProvider('openai')}
                  className="mr-2"
                />
                <span>OpenAI</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ai-provider"
                  value="mistral"
                  checked={defaultProvider === 'mistral'}
                  onChange={() => setDefaultProvider('mistral')}
                  className="mr-2"
                />
                <span>Mistral</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="ai-provider"
                  value="gemini"
                  checked={defaultProvider === 'gemini'}
                  onChange={() => setDefaultProvider('gemini')}
                  className="mr-2"
                />
                <span>Gemini</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="ai-provider"
                  value="claude"
                  checked={defaultProvider === 'claude'}
                  onChange={() => setDefaultProvider('claude')}
                  className="mr-2"
                />
                <span>Claude</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="ai-provider"
                  value="deepseek"
                  checked={defaultProvider === 'deepseek'}
                  onChange={() => setDefaultProvider('deepseek')}
                  className="mr-2"
                />
                <span>DeepSeek</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`rounded-md px-4 py-2 font-medium text-white 
                ${saveStatus === 'saving' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
          
          {saveStatus === 'success' && (
            <p className="text-sm text-green-500 text-center">
              ✓ Settings saved successfully!
            </p>
          )}
          
          {saveStatus === 'error' && (
            <p className="text-sm text-red-500 text-center">
              ✗ Error saving settings: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HeaderWrapper />
      <Suspense fallback={<SettingsLoadingFallback />}>
        <SettingsContent />
      </Suspense>
    </main>
  );
} 