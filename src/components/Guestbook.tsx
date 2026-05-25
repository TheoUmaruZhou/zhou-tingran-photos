import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, PenLine, Stamp } from 'lucide-react';
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

export default function Guestbook({ isOpen, onClose }: GuestbookProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

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
      date: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    const { data, error } = await supabase
      .from('guestbook')
      .insert([newMsg])
      .select();

    if (!error && data) {
      setMessages([data[0], ...messages]);
      setSent(true);
      setName('');
      setContent('');
      setTimeout(() => setSent(false), 2000);
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
          className="fixed inset-0 z-50 bg-[#ebebeb]/98 dark:bg-[#1a1a1a]/98 backdrop-blur-sm flex items-start justify-center overflow-y-auto transition-colors duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mx-4 my-4 md:my-8"
          >
            <div className="bg-[#f5f0e8] dark:bg-[#2a2520] border border-neutral-300 dark:border-neutral-600 shadow-2xl transition-colors duration-300">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-600">
                <div className="flex items-center gap-3">
                  <Stamp className="w-5 h-5 text-red-600" />
                  <div>
                    <h2 className="font-display font-extrabold text-lg tracking-tight text-[#1a1a1a] dark:text-[#ebebeb] uppercase">
                      Guestbook
                    </h2>
                    <p className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 tracking-wider uppercase">
                      留言墙 — Write a letter to the photographer
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-8 md:px-16 py-10">
                <div className="relative mb-8">
                  <div className="absolute -top-3 -left-2 w-6 h-6 rounded-full bg-red-600/80 shadow-sm" />
                  <div className="border-l-2 border-dashed border-neutral-300 dark:border-neutral-600 ml-1 pl-6 pt-2">
                    <p className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                      From: Visitor &nbsp;&nbsp; To: ZHOU TING RAN
                    </p>
                    <p className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                      {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mb-10">
                  <div className="mb-4">
                    <label className="block font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                      Your Name / 你的名字
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="A visitor from..."
                      className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-600 focus:border-red-600 outline-none py-2 text-sm font-sans text-[#1a1a1a] dark:text-[#ebebeb] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                      Your Message / 你的留言
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write something here..."
                      rows={4}
                      className="w-full bg-transparent border border-neutral-200 dark:border-neutral-600 focus:border-red-600 outline-none p-3 text-sm font-sans text-[#1a1a1a] dark:text-[#ebebeb] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none leading-relaxed transition-colors"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.05) 28px)',
                        backgroundAttachment: 'local',
                        lineHeight: '28px',
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending || !name.trim() || !content.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a] font-mono text-xs uppercase tracking-wider hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                        <span>SEND LETTER</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <PenLine className="w-4 h-4 text-red-600" />
                    <h3 className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Messages on the Wall / 留言墙
                    </h3>
                    <span className="font-mono text-[10px] text-red-600">({messages.length})</span>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                        Loading messages...
                      </p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                        No messages yet. Be the first to write.
                      </p>
                      <p className="font-mono text-[10px] text-neutral-300 dark:text-neutral-600 mt-2">
                        暂无留言，成为第一个写信的人吧
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[600px] overflow-y-auto pr-1">
                      {messages.map((msg, idx) => (
                        <div
                          key={msg.id}
                          className="group relative cursor-default"
                        >
                          <div className="relative bg-[#f5f0e8] dark:bg-[#2a2520] border border-neutral-300 dark:border-neutral-600 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-0 border-l-[100px] border-l-[#e8e0d0] dark:border-l-[#3a3530] border-r-[100px] border-r-transparent border-b-[40px] border-b-transparent opacity-40" />
                            <div className="absolute top-0 right-0 h-0 border-r-[100px] border-r-[#e8e0d0] dark:border-r-[#3a3530] border-l-[100px] border-l-transparent border-b-[40px] border-b-transparent opacity-40" />
                            <div className="relative p-4 pt-8">
                              <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                <div className="w-5 h-5 rounded-full bg-red-600/70 shadow-sm border border-red-700/50" />
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-8 md:px-16 py-4 border-t border-neutral-200 dark:border-neutral-600 bg-[#efe8dc] dark:bg-[#221e19] transition-colors duration-300">
                <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 text-center tracking-wider">
                  THEODORE PHOTOGRAPHY © 2026 — EVERY LETTER IS CHERISHED
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}