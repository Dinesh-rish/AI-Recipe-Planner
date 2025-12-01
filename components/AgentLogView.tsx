
import React from 'react';
import { AgentLog } from '../types';
import { BotIcon, CheckCircleIcon } from './icons';

interface AgentLogViewProps {
  logs: AgentLog[];
}

const AgentLogView: React.FC<AgentLogViewProps> = ({ logs }) => {
  const getAgentColor = (agentName: string) => {
    if (agentName.includes('Nutrition')) return 'text-blue-500';
    if (agentName.includes('Recipe')) return 'text-yellow-500';
    if (agentName.includes('Budget')) return 'text-green-500';
    if (agentName.includes('Shopping')) return 'text-purple-500';
    if (agentName.includes('Critic')) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-base-200">
      <div className="flex items-center gap-4 border-b border-base-200 pb-4 mb-6">
        <BotIcon className="h-8 w-8 text-primary"/>
        <h2 className="text-3xl font-bold text-gray-800">AI Agent Logs</h2>
      </div>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-4">
            <div>
              <span className={`flex items-center justify-center h-8 w-8 rounded-full bg-base-200 ${getAgentColor(log.agentName)}`}>
                <BotIcon className="h-5 w-5" />
              </span>
            </div>
            <div className="flex-1 pt-1">
              <p className="font-semibold text-gray-700">
                {log.agentName}
              </p>
              <p className="text-gray-600 text-sm">{log.action}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-4">
            <div>
              <span className={`flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-success`}>
                <CheckCircleIcon className="h-5 w-5" />
              </span>
            </div>
            <div className="flex-1 pt-1">
              <p className="font-semibold text-gray-700">
                Coordinator Agent
              </p>
              <p className="text-gray-600 text-sm">Meal plan generation complete and validated.</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AgentLogView;
