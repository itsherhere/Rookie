'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Send, MessageSquare } from 'lucide-react';

interface Thread {
  application_id: string; job_title: string; unread: number; last_message: string; last_message_at: string;
  other_user: { full_name: string; company_name?: string };
}

interface Message {
  id: string; content: string; sender_id: string; created_at: string;
}

export default function CandidateMessagesPage() {
  const { getToken, userId } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/threads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) { const d = await res.json(); setThreads(d); if (d.length) setActive(d[0]); }
      } finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!active) return;
    (async () => {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/thread/${active.application_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMessages(await res.json());
    })();
  }, [active]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    if (!text.trim() || !active) return;
    setSending(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ application_id: active.application_id, content: text.trim() }),
      });
      if (res.ok) { const msg = await res.json(); setMessages(p => [...p, msg]); setText(''); }
    } finally { setSending(false); }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-[#5046E4] border-t-transparent animate-spin" />
    </div>
  );

  if (!threads.length) return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#F7F7FF] flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={28} className="text-[#E8E6F8]" />
        </div>
        <p className="font-bold text-[#0F0F1A] mb-1">No messages yet</p>
        <p className="text-sm text-[#6B6888]">Employers will message you here after reviewing your application</p>
      </div>
    </div>
  );

  const senderName = active?.other_user?.company_name || active?.other_user?.full_name || 'Employer';
  const senderInitial = senderName[0].toUpperCase();

  return (
    <div className="flex h-[calc(100vh-64px)]" style={{ background: '#F7F8FF' }}>
      {/* Thread list */}
      <div className="w-72 bg-white border-r border-[#E8E6F8] flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-[#E8E6F8]">
          <h2 className="font-bold text-[#0F0F1A]">Messages</h2>
          <p className="text-xs text-[#6B6888] mt-0.5">{threads.length} conversation{threads.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map(t => {
            const isActive = active?.application_id === t.application_id;
            const name = t.other_user?.company_name || t.other_user?.full_name || 'Employer';
            return (
              <button key={t.application_id} onClick={() => setActive(t)}
                className="w-full text-left px-4 py-3.5 border-b border-[#E8E6F8] transition-all relative"
                style={{ background: isActive ? '#F7F8FF' : 'white' }}>
                {isActive && <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-[#5046E4]" />}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #EEF0FF, #F0EEFF)', color: '#5046E4' }}>
                    {name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0F0F1A] truncate">{name}</p>
                      {t.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#5046E4] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ml-1">
                          {t.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5046E4] font-medium truncate">{t.job_title}</p>
                    <p className="text-xs text-[#6B6888] truncate mt-0.5">{t.last_message}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      {active && (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="h-[57px] bg-white border-b border-[#E8E6F8] px-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background: 'linear-gradient(135deg, #EEF0FF, #F0EEFF)', color: '#5046E4' }}>
              {senderInitial}
            </div>
            <div>
              <p className="font-semibold text-sm text-[#0F0F1A]">{senderName}</p>
              <p className="text-xs text-[#6B6888]">{active.job_title}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-[#6B6888]">No messages yet. Say hello!</p>
              </div>
            )}
            {messages.map(msg => {
              const mine = msg.sender_id === userId;
              const time = new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              return (
                <div key={msg.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'} gap-1`}>
                  <div className="max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: mine ? '#5046E4' : 'white',
                      color: mine ? 'white' : '#0F0F1A',
                      border: mine ? 'none' : '1px solid #E8E6F8',
                      borderBottomRightRadius: mine ? 6 : 16,
                      borderBottomLeftRadius: mine ? 16 : 6,
                    }}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[#6B6888] px-1">{time}</span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-3.5 bg-white border-t border-[#E8E6F8]">
            <div className="flex gap-3 items-end">
              <textarea value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 px-4 py-3 rounded-xl border border-[#E8E6F8] text-sm text-[#0F0F1A] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 resize-none transition-all"
                style={{ background: '#F7F8FF' }}
              />
              <button onClick={send} disabled={!text.trim() || sending}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: text.trim() ? '#5046E4' : '#E8E6F8' }}>
                <Send size={16} style={{ color: text.trim() ? 'white' : '#6B6888' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
