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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    }, 1200);
  };

  return (
    <div id="about-contact-section" className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-32">
      <div className="pt-8 pb-16">
        <span className="font-mono text-xs text-red-600 tracking-widest block uppercase mb-3">
          ABOUT & CONTACT / 简介与联络
        </span>
        <h2 className="text-4xl md:text-7xl font-display font-black text-[#1a1a1a] uppercase tracking-tight leading-none">
          THE ARTIST STATEMENT
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h3 className="text-xl md:text-2xl font-display font-semibold text-neutral-800 uppercase border-b border-neutral-300 pb-3">
              ZHOU TING RAN / 周亭燃（Theodore）
            </h3>
            <p className="text-neutral-600 text-lg md:text-xl font-sans font-light leading-relaxed">
              2007年生于重庆渝北，一名探索摄影三年的创作者。作品类型跨越新地形、风光、人文纪实与画意摄影。擅长以冷静视角观察城市化进程中的人地关系，也乐于用画笔般的镜头语言营造诗意瞬间。持续创作中，欢迎交流。
            </p>
            <p className="text-neutral-500 text-base leading-relaxed">
              Born in Yubei, Chongqing in 2007, I am an artist who has been exploring photography for three years. My works span genres of New Topographics, landscape, documentary, and pictorial photography. I specialize in observing human-land relationships amid urbanization from a detached perspective, and also enjoy using paintbrush-like lens language to create poetic moments. I am constantly creating, and welcome any communication.
            </p>
          </div>

          <div className="relative border-l border-neutral-400 pl-6 py-2 my-2 bg-[#e0e0e0] p-6 max-w-2xl">
            <p className="text-base font-mono text-neutral-500 leading-relaxed italic">
              "摄影于我，是一个体悟生命的过程。它让我用心感受每一个当下，发现那些细小的美好，并认真地去记录。而摄影本身，也时常让我感动。"
            </p>
          </div>

        </div>

        <div className="lg:col-span-5 lg:pl-8 flex flex-col gap-10">
          <div className="bg-[#e0e0e0] border border-neutral-300 p-8 flex flex-col gap-6">
            <h4 className="text-lg font-display font-bold text-[#1a1a1a] uppercase tracking-tight">
              Studio Introduction
            </h4>

            <div className="flex flex-col gap-4 font-mono text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Chong Qing / Yu Bei / Chongqing College of Humanities, Science & Technology</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href="mailto:1532737473@qq.com" className="hover:text-red-600 transition-colors">
                  1532737473@qq.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-red-600 transition-colors">
                  抖音号：Theo.Umaru.Zhou 小红书：THEOUMARUZHOU
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Library className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>WeChat Official / 微信公众号: 茉域影像Molly Field</span>
              </div>
            </div>

            <p className="text-xs font-sans text-neutral-500 leading-relaxed border-t border-neutral-300 pt-4">
            </p>
          </div>

          <div className="p-8 bg-[#e5e5e5] border border-neutral-300 flex flex-col gap-6 relative">
            <h4 className="text-lg font-display font-bold text-[#1a1a1a] uppercase tracking-tight">
              Art & Print Inquiries
            </h4>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-200 p-6 text-center border border-green-200 flex flex-col items-center gap-4 py-12"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <div>
                  <h5 className="font-display font-bold text-[#1a1a1a] uppercase text-base">Inquiry Dispatched</h5>
                  <p className="text-xs text-neutral-500 mt-2 font-sans font-light">
                    您的参展、收藏咨询留言已妥善发送至工作室。由于陈路老师常在西南偏远地区进行田野调查，我们一般在 3 个工作日内给予正式电子信件回复。祝好。
                  </p>
                </div>
                <button
                  id="form-success-reset-btn"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 font-mono text-xs uppercase text-neutral-500 hover:text-[#1a1a1a] underline cursor-pointer"
                >
                  Send another message / 重新留言
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="block font-mono text-[10px] text-neutral-500 uppercase mb-1">
                    Your Name / 您的姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#ebebeb] border border-neutral-300 focus:border-red-600 focus:outline-none p-3 text-sm text-[#1a1a1a] font-sans font-light rounded-none transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-mono text-[10px] text-neutral-500 uppercase mb-1">
                    Email Address / 电子邮箱 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#ebebeb] border border-neutral-300 focus:border-red-600 focus:outline-none p-3 text-sm text-[#1a1a1a] font-sans font-light rounded-none transition-colors"
                    placeholder="name@domain.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono text-[10px] text-neutral-500 uppercase mb-1">
                    Inquiry Content / 详情描述 *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#ebebeb] border border-neutral-300 focus:border-red-600 focus:outline-none p-3 text-sm text-[#1a1a1a] font-sans font-light rounded-none transition-colors resize-none"
                    placeholder="Describe your request, project timeline or sizes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  id="inquiry-form-submit-btn"
                  className="w-full font-mono bg-[#1a1a1a] text-[#ebebeb] py-4 uppercase text-xs font-semibold tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-700 transition-colors cursor-pointer mt-2"
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
