"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { validateOpenAIKey, validateMistralKey } from '@/lib/ai/key-validator';

export default function SettingsPage() {
  const router = useRouter();
  const [openaiKey, setOpenaiKey] = useState('');
  const [mistralKey, setMistralKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [defaultProvider, setDefaultProvider] = useState<'openai' | 'mistral' | 'gemini' | 'deepseek' | 'claude'>('openai');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [keyStatus, setKeyStatus] = useState({
    openai: 'unknown' as 'valid' | 'invalid' | 'limited' | 'unknown',
    mistral: 'unknown' as 'valid' | 'invalid' | 'limited' | 'unknown'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved keys from localStorage
    const savedOpenaiKey = localStorage.getItem('openai_api_key') || '';
    const savedMistralKey = localStorage.getItem('mistral_api_key') || '';
    const savedGeminiKey = localStorage.getItem('gemini_api_key') || '';
    const savedDeepseekKey = localStorage.getItem('deepseek_api_key') || '';
    const savedClaudeKey = localStorage.getItem('claude_api_key') || '';
    const savedProvider = localStorage.getItem('default_ai_provider') as 'openai' | 'mistral' | 'gemini' | 'deepseek' | 'claude' || 'openai';
    
    setOpenaiKey(savedOpenaiKey);
    setMistralKey(savedMistralKey);
    setGeminiKey(savedGeminiKey);
    setDeepseekKey(savedDeepseekKey);
    setClaudeKey(savedClaudeKey);
    setDefaultProvider(savedProvider);
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    
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
      
      localStorage.setItem('default_ai_provider', defaultProvider);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save API keys:', error);
      setError(error.message);
      setSaveStatus('error');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <div className="max-w-2xl mx-auto mt-12">
        <h1 className="text-2xl font-bold mb-6">AI Settings</h1>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">API Keys</h2>
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
              <div className="flex space-x-4">
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
                  <span>Mistral AI</span>
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
                  <span>Google Gemini</span>
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
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
            
            {saveStatus === 'success' && (
              <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                Settings saved successfully!
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                Failed to save settings. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 