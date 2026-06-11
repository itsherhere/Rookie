'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { MessageSquare, Send } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface Thread {
  application_id: string;
  application: { jobs: { title: string; companies: { name: string } } };
  last_message: string;
  last_message_at: string;
}

interface Message {
  id: string;
  body: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

interface MessagesPageProps {
  title: string;
  subtitle: string;
}

export function MessagesPage({ title, subtitle }: MessagesPageProps) {
  const { getToken } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const [threadsRes, meRes] = await Promise.all([
          api.get<Thread[]>('/messages/threads', token!),
          api.get<{ id: string }>('/users/me', token!),
        ]);
        setThreads(threadsRes.data || []);
        setUserId(meRes.data?.id || '');
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [getToken]);

  const selectThread = async (thread: Thread) => {
    setSelected(thread);
    try {
      const token = await getToken();
      const res = await api.get<Message[]>(`/messages/thread/${thread.application_id}`, token!);
      setMessages(res.data || []);
    } catch (err) { console.error(err); }
  };

  const sendMessage = async () => {
    if (!body.trim() || !selected) return;
    const receiverId = messages.length > 0
      ? (messages[0].sender_id === userId ? messages[0].receiver_id : messages[0].sender_id)
      : null;
    if (!receiverId) return;

    setSending(true);
    try {
      const token = await getToken();
      const res = await api.post<Message>('/messages', {
        application_id: selected.application_id,
        receiver_id: receiverId,
        body: body.trim(),
      }, token!);
      if (res.data) setMessages((prev) => [...prev, res.data!]);
      setBody('');
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="p-8">
      <PageHeader title={title} description={subtitle} />

      {threads.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Conversations will appear here."
        />
      ) : (
        <div className="flex gap-5 h-[580px]">
          {/* Thread list */}
          <div className="w-64 flex-shrink-0 bg-white border border-[#E8E6F8] rounded-xl overflow-y-auto">
            {threads.map((thread) => (
              <button
                key={thread.application_id}
                onClick={() => selectThread(thread)}
                className={`w-full text-left p-4 border-b border-[#E8E6F8] hover:bg-[#F7F7FF] transition-colors last:border-b-0 ${
                  selected?.application_id === thread.application_id ? 'bg-[#EEF0FF]' : ''
                }`}
              >
                <p className="text-sm font-medium text-[#0F0F1A] truncate">
                  {thread.application?.jobs?.title}
                </p>
                <p className="text-xs text-[#5046E4] truncate">
                  {thread.application?.jobs?.companies?.name}
                </p>
                <p className="text-xs text-[#6B6888] mt-1 truncate">{thread.last_message}</p>
              </button>
            ))}
          </div>

          {/* Thread messages */}
          {selected ? (
            <div className="flex-1 bg-white border border-[#E8E6F8] rounded-xl flex flex-col min-w-0">
              <div className="px-5 py-4 border-b border-[#E8E6F8] flex-shrink-0">
                <p className="text-sm font-semibold text-[#0F0F1A]">
                  {selected.application?.jobs?.title}
                </p>
                <p className="text-xs text-[#5046E4]">
                  {selected.application?.jobs?.companies?.name}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender_id === userId
                        ? 'bg-[#5046E4] text-white'
                        : 'bg-[#F7F7FF] text-[#0F0F1A] border border-[#E8E6F8]'
                    }`}>
                      <p>{msg.body}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender_id === userId ? 'text-white/60' : 'text-[#6B6888]'
                      }`}>
                        {formatRelativeTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 border-t border-[#E8E6F8] flex gap-3 flex-shrink-0">
                <input
                  type="text"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a message..."
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#E8E6F8] text-sm focus:outline-none focus:border-[#5046E4] transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !body.trim()}
                  className="px-4 py-2.5 bg-[#5046E4] hover:bg-[#3D34C4] text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white border border-[#E8E6F8] rounded-xl flex items-center justify-center text-[#6B6888] text-sm">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      )}
    </div>
  );
}
