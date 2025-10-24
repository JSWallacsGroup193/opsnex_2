/**
 * Chat Service
 * Handles AI chat assistant interactions
 */

import apiClient from './api';
import type { ChatRequest, ChatResponse, ChatLog } from '../types';

export const chatService = {
  /**
   * Send message to AI assistant
   */
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/chat', data);
  },

  /**
   * Get chat history/logs for tenant
   */
  async getChatLogs(tenantId: string): Promise<ChatLog[]> {
    return apiClient.get<ChatLog[]>(`/chat/logs/${tenantId}`);
  },
};
