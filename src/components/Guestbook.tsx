import { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Stamp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  name: string;
  content: string;
  date: string;
  created_at?: string;
}

interface GuestbookProps {
  isOpen: boolean;
  onClose: () => void;
}

function EnvelopeCard({ msg, idx, isNew }: { msg: Message; idx: number; isNew: boolean }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 80, scale: 0.6, rotateX: 90 } : { opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={isNew ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] } : { duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
      className="group relative cursor-default"
    >
      <div className="relative bg-[#f5f0e8] dark:bg-[#2a2520] border border-neutral-300 dark:border-neutral-600 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0 border-l-[100px] border-l-[#e8e0d0] dark:border-l-[#3a3530] border-r-[100px] border-r-transparent border-b-[40px] border-b-transparent opacity-40" />
        <div className="absolute top-0 right-0 h-0 border-r-[100px] border-r-[#e8e0d0] dark:border-r-[#3a3530] border-l-[100px] border-l-transparent border-b-[40px] border-b-transparent opacity-40" />
        <div className="relative p-4 pt-8">
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <div className="w-5 h-5 rounded-full bg-red-700/70 shadow-sm border border-red-700/50" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 tracking-wider uppercase">
              From: {msg.name}
            </span>
            <span className="font-mono text-[8px] text-neutral-400 dark:text-neutral-500">
              {msg.date}
            </span>
          </div>
          <div className="border-t border-dashed border-neutral-300 dark:border-neutral-600 pt-2">
            <p className="text-xs font-sans text-[#1a1a1a] dark:text-[#ebebeb] leading-relaxed whitespace-pre-wrap line-clamp-4">
              {msg.content}
            </p>
          </div>
          <div className="absolute bottom-2 right-3">
            <span className="font-mono text-[7px] text-neutral-300 dark:text-neutral-600 tracking-wider">No.{String(idx + 1).padStart(3, '0')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Guestbook({ isOpen, onClose }: GuestbookProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMsgId, setNewMsgId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setSending(true);

    const newMsg = {
      name: name.trim(),
      content: content.trim(),
    };

    const { data, error } = await supabase
      .from('guestbook')
      .insert([newMsg])
      .select();

    if (error) {
      console.error('发送失败:', error);
      alert('发送失败，请稍后重试');
    } else if (data) {
      setNewMsgId(data[0].id);
      setMessages([data[0], ...messages]);
      setSent(true);
      setName('');
      setContent('');
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => {
        setSent(false);
        setNewMsgId(null);
      }, 2000);
    }

    setSending(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-[#ebebeb]/98 dark:bg-[#1a1a1a]/98 backdrop-blur-sm flex flex-col transition-colors duration-300"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-600 bg-[#f5f0e8] dark:bg-[#2a2520] shrink-0">
            <div className="flex items-center gap-3">
              <Stamp className="w-5 h-5 text-red-700" />
              <div>
                <h2 className="font-display font-extrabold text-lg tracking-tight text-[#1a1a1a] dark:text-[#ebebeb] uppercase">
                  Guestbook
                </h2>
                <p className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 tracking-wider uppercase">
                  留言墙 — Write a letter to the photographer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-red-700">({messages.length})</span>
              <button
                onClick={onClose}
                className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
          >
            {loading ? (
              <div className="text-center py-16">
                <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                  Loading messages...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                  No messages yet. Be the first to write.
                </p>
                <p className="font-mono text-[10px] text-neutral-300 dark:text-neutral-600 mt-2">
                  暂无留言，成为第一个写信的人吧
                </p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {messages.map((msg, idx) => (
                  <EnvelopeCard
                    key={msg.id}
                    msg={msg}
                    idx={idx}
                    isNew={msg.id === newMsgId}
                  />
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -500, scale: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed left-1/2 -translate-x-1/2 bottom-32 z-50 pointer-events-none"
              >
                <div className="w-24 h-16 bg-[#f5f0e8] dark:bg-[#2a2520] border border-neutral-300 dark:border-neutral-600 shadow-xl flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[16px] border-b-red-700/60" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-600 bg-[#f5f0e8] dark:bg-[#2a2520] px-6 md:px-12 py-6 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name / 你的名字"
                  className="sm:w-48 bg-transparent border-b border-neutral-300 dark:border-neutral-600 focus:border-red-700 outline-none py-3 text-sm font-sans text-[#1a1a1a] dark:text-[#ebebeb] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors shrink-0"
                  required
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write something here..."
                  rows={2}
                  className="flex-1 bg-transparent border border-neutral-200 dark:border-neutral-600 focus:border-red-700 outline-none p-3 text-sm font-sans text-[#1a1a1a] dark:text-[#ebebeb] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none transition-colors leading-relaxed"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.05) 28px)',
                    backgroundAttachment: 'local',
                    lineHeight: '28px',
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={sending || !name.trim() || !content.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a] font-mono text-xs uppercase tracking-wider hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {sent ? (
                    <>
                      <span className="text-green-400 dark:text-green-600">✓</span>
                      <span className="text-green-400 dark:text-green-600">SENT</span>
                    </>
                  ) : sending ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>SENDING...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>SEND</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="shrink-0 py-2 bg-[#efe8dc] dark:bg-[#221e19] border-t border-neutral-200 dark:border-neutral-600 transition-colors duration-300">
            <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 text-center tracking-wider">
              THEODORE PHOTOGRAPHY © 2026 — EVERY LETTER IS CHERISHED
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}