/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Instagram, MapPin, CheckCircle2, Send, Library } from 'lucide-react';

export default function AboutContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSending(true);
    setSendError(false);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '781b372f-89b5-4d0f-ae49-d1edbb7e61d2',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: formData.name,
          subject: `新咨询来自 ${formData.name} - Theodore Photography`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFormSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSendError(true);
      }
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="about-contact-section" className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-32 transition-colors duration-300">
      <div className="pt-8 pb-16">
        <span className="font-mono text-xs text-red-600 tracking-widest block uppercase mb-3">
          ABOUT & CONTACT / 简介与联络
        </span>
        <h2 className="text-4xl md:text-7xl font-display font-black text-[#1a1a1a] dark:text-[#ebebeb] uppercase tracking-tight leading-none">
          THE ARTIST STATEMENT
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 flex flex-col gap-10">
          <div className="relative w-full max-w-sm mx-auto lg:mx-0">
            <img
              src="/images/20260715.webp"
              alt="Zhou Ting Ran Portrait"
              className="w-full h-auto object-cover border border-neutral-300 dark:border-neutral-700 shadow-lg"
              style={{ aspectRatio: '3/4' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a1a1a]/80 to-transparent p-4">
              <p className="font-mono text-xs text-neutral-300 uppercase tracking-wider font-semibold">
                ZHOU TING RAN / 周亭燃
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xl md:text-2xl font-display font-semibold text-neutral-800 dark:text-neutral-200 uppercase border-b border-neutral-300 dark:border-neutral-700 pb-3">
              ZHOU TING RAN / 周亭燃（Theodore / 西奥多）
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl font-sans font-light leading-relaxed">
              2007年生于重庆渝北，一名探索摄影三年的创作者。作品类型跨越新地形、风光、人文纪实与画意摄影。擅长以冷静视角观察城市化进程中的人地关系，也乐于用画笔般的镜头语言营造诗意瞬间。持续创作中，欢迎交流。
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed">
              Born in Yubei, Chongqing in 2007, I am an artist who has been exploring photography for three years. My works span genres of New Topographics, landscape, documentary, and pictorial photography. I specialize in observing human-land relationships amid urbanization from a detached perspective, and also enjoy using paintbrush-like lens language to create poetic moments. I am constantly creating, and welcome any communication.
            </p>
          </div>

          <div className="relative border-l border-neutral-400 pl-6 py-2 my-2 bg-[#e0e0e0] dark:bg-[#2a2a2a] p-6 max-w-2xl">
            <p className="text-base font-mono text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
              "摄影于我，是一个体悟生命的过程。它让我用心感受每一个当下，发现那些细小的美好，并认真地去记录。而摄影本身，也时常让我感动。"
            </p>
          </div>

        </div>

        <div className="lg:col-span-5 lg:pl-8 flex flex-col gap-10">
          <div className="bg-[#e0e0e0] dark:bg-[#2a2a2a] border border-neutral-300 dark:border-neutral-700 p-8 flex flex-col gap-6">
            <h4 className="text-lg font-display font-bold text-[#1a1a1a] dark:text-[#ebebeb] uppercase tracking-tight">
              Studio Introduction / 工作室介绍
            </h4>

            <div className="flex flex-col gap-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                <span>Chong Qing / Yu Bei / Chongqing College of Humanities, Science & Technology</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                <a href="mailto:1532737473@qq.com" className="hover:text-red-600 transition-colors">
                  1532737473@qq.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-red-600 transition-colors">
                  抖音号：Theo.Umaru.Zhou 小红书：THEOUMARUZHOU
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Library className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                <span>WeChat Official / 微信公众号: 茉域影像Molly Field</span>
              </div>
            </div>

            <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-300 dark:border-neutral-700 pt-4">
            </p>
          </div>

          <div className="p-8 bg-[#e5e5e5] dark:bg-[#2a2a2a] border border-neutral-300 dark:border-neutral-700 flex flex-col gap-6 relative">
            <h4 className="text-lg font-display font-bold text-[#1a1a1a] dark:text-[#ebebeb] uppercase tracking-tight">
              Art & Cooperation Inquiry / 艺术与合作咨询
            </h4>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-200 dark:bg-neutral-800 p-6 text-center border border-green-200 dark:border-green-800 flex flex-col items-center gap-4 py-12"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <div>
                  <h5 className="font-display font-bold text-[#1a1a1a] dark:text-[#ebebeb] uppercase text-base">Inquiry Dispatched</h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-sans font-light">
您的留言已成功发送，我们会尽快回复你。
                  </p>
                </div>
                <button
                  id="form-success-reset-btn"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 font-mono text-xs uppercase text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] underline cursor-pointer"
                >
                  Send another message / 重新留言
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {sendError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-xs text-red-600 font-mono">
                    发送失败，请稍后重试或直接发送邮件至 1532737473@qq.com
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase mb-1">
                    Your Name / 您的姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#ebebeb] dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 focus:border-red-600 focus:outline-none p-3 text-sm text-[#1a1a1a] dark:text-[#ebebeb] font-sans font-light rounded-none transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase mb-1">
                    Email Address / 电子邮箱 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#ebebeb] dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 focus:border-red-600 focus:outline-none p-3 text-sm text-[#1a1a1a] dark:text-[#ebebeb] font-sans font-light rounded-none transition-colors"
                    placeholder="name@domain.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase mb-1">
                    Inquiry Content / 详情描述 *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#ebebeb] dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 focus:border-red-600 focus:outline-none p-3 text-sm text-[#1a1a1a] dark:text-[#ebebeb] font-sans font-light rounded-none transition-colors resize-none"
                    placeholder="Describe your request, project or idea..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  id="inquiry-form-submit-btn"
                  className="w-full font-mono bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a] py-4 uppercase text-xs font-semibold tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-700 transition-colors cursor-pointer mt-2"
                >
                  {sending ? (
                    <>
                      <span>TRANSMITTING MESSAGE...</span>
                      <div className="w-3 h-3 rounded-full border border-[#ebebeb] border-t-transparent animate-spin"></div>
                    </>
                  ) : (
                    <>
                      <span>DISPATCH RECOLLECTION</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
