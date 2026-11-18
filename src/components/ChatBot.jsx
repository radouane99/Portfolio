import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const KNOWLEDGE_BASE = {
  en: {
    skills: "Radouane is a Full-Stack Developer & ISTQB® Certified Tester skilled in React, TypeScript, Node.js, Python (Selenium), Supabase, PostgreSQL, Spring Boot, and Docker.",
    projects: "He has built full-stack platforms including academic digitalization portals, e-commerce analytics, and AI SaaS tools. Check out the Projects section for live demos!",
    hackathons: "Radouane excelled in 3 major hackathons in 2026: 'Galactic Problem Solver' at the 2026 NASA Space Apps Challenge, 1st Place & Certified at the Build with Gemma Hackathon (Technopark Casablanca — Google Gemma & AI Crafters), and selected participant at the national Rally IA Future Lab hackathon in Merzouga!",
    experience: "He works as a Specialized Technician in Development at ENS Fez (since Sept 2024), previously spent 4+ years at E-Market Solutions in Python/JS automation, and is pursuing his State Engineering degree in Computer Engineering at UPF.",
    contact: "You can reach Radouane via the contact form on this page, email him at radouane.elasri@usmba.ac.ma, or call +212 609365349.",
    default: "I can tell you all about Radouane's skills, projects, hackathons & awards, professional experience, or how to contact him!"
  },
  fr: {
    skills: "Radouane est un développeur Full-Stack et certifié ISTQB®, expert en React, TypeScript, Node.js, Python (Selenium), Supabase, PostgreSQL, Spring Boot et Docker.",
    projects: "Il a réalisé plusieurs projets Full-Stack et IA, notamment des plateformes académiques, e-commerce et des tableaux de bord analytiques. Découvrez-les dans la section Projets !",
    hackathons: "Radouane s'est illustré dans 3 grands hackathons en 2026 : 'Galactic Problem Solver' au NASA Space Apps Challenge 2026, 1ère Place & Certifié au Build with Gemma Hackathon (Technopark Casablanca), et participant sélectionné au Rally IA Future Lab à Merzouga !",
    experience: "Il est Technicien Spécialisé en Développement à l'ENS Fès (depuis Sept 2024), avec plus de 4 ans d'expérience chez E-Market Solutions en automatisation Python/Selenium, et prépare son diplôme d'Ingénieur d'État à l'UPF.",
    contact: "Vous pouvez contacter Radouane via le formulaire de contact, par e-mail à radouane.elasri@usmba.ac.ma ou par téléphone au +212 609365349.",
    default: "Je peux vous parler des compétences, des projets, des hackathons, de l'expérience de Radouane ou de la manière de le contacter !"
  }
};

const ChatBot = () => {
    const { t, i18n } = useTranslation();
    const { isDarkMode: drakeMode } = useTheme();
    const lang = (i18n.language || 'en').startsWith('fr') ? 'fr' : 'en';

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: t('chatbot.greeting')
        }
    ]);

    useEffect(() => {
        setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[0].role === 'assistant') {
                newMessages[0].content = t('chatbot.greeting');
            }
            return newMessages;
        });
    }, [i18n.language, t]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const inputRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isOpen, isMinimized]);

    const handleSend = async (e, directMessage = null) => {
        if (e && e.preventDefault) e.preventDefault();

        const messageToSend = directMessage || input;
        if (!messageToSend.trim() || isLoading) return;

        const userMessage = messageToSend.trim();
        if (!directMessage) setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        setIsTyping(true);

        try {
            // Attempt to use Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('portfolio-chat', {
                body: { message: userMessage, history: messages }
            });

            if (error) throw error;
            
            await new Promise(resolve => setTimeout(resolve, 800));
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.warn('Supabase Chat Error, using local fallback:', error);
            
            // Local Fallback Logic
            await new Promise(resolve => setTimeout(resolve, 800));
            let reply = KNOWLEDGE_BASE[lang].default;
            const lowerMsg = userMessage.toLowerCase();
            
            if (lowerMsg.includes('skill') || lowerMsg.includes('compétence') || lowerMsg.includes('tech')) {
                reply = KNOWLEDGE_BASE[lang].skills;
            } else if (lowerMsg.includes('hackathon') || lowerMsg.includes('award') || lowerMsg.includes('prix') || lowerMsg.includes('compétition')) {
                reply = KNOWLEDGE_BASE[lang].hackathons;
            } else if (lowerMsg.includes('project') || lowerMsg.includes('projet')) {
                reply = KNOWLEDGE_BASE[lang].projects;
            } else if (lowerMsg.includes('experience') || lowerMsg.includes('expérience') || lowerMsg.includes('parcours') || lowerMsg.includes('education') || lowerMsg.includes('formation')) {
                reply = KNOWLEDGE_BASE[lang].experience;
            } else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('joindre') || lowerMsg.includes('phone') || lowerMsg.includes('téléphone')) {
                reply = KNOWLEDGE_BASE[lang].contact;
            }
            
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleQuickQuestion = (question) => {
        handleSend(null, question);
    };

    // Responsive dimensions based on screen size
    const getChatDimensions = () => {
        if (windowWidth < 640) { // Mobile
            return {
                width: 'calc(100vw - 2rem)',
                height: isMinimized ? '4rem' : 'calc(100vh - 8rem)',
                position: 'fixed inset-0 m-4',
                maxWidth: 'none',
                quickQuestionsCols: 'grid-cols-1',
                messageMaxWidth: '90%',
                inputPadding: 'p-3'
            };
        } else if (windowWidth < 768) { // Small tablet
            return {
                width: isMinimized ? '16rem' : '24rem',
                height: isMinimized ? '4rem' : '32rem',
                position: 'fixed bottom-6 right-6',
                maxWidth: 'none',
                quickQuestionsCols: 'grid-cols-1',
                messageMaxWidth: '85%',
                inputPadding: 'p-3'
            };
        } else if (windowWidth < 1024) { // Tablet
            return {
                width: isMinimized ? '16rem' : '28rem',
                height: isMinimized ? '4rem' : '36rem',
                position: 'fixed bottom-6 right-6',
                maxWidth: 'none',
                quickQuestionsCols: 'grid-cols-2',
                messageMaxWidth: '85%',
                inputPadding: 'p-4'
            };
        } else { // Desktop
            return {
                width: isMinimized ? '16rem' : '28rem',
                height: isMinimized ? '4rem' : '40rem',
                position: 'fixed bottom-6 right-6',
                maxWidth: 'none',
                quickQuestionsCols: 'grid-cols-2',
                messageMaxWidth: '85%',
                inputPadding: 'p-4'
            };
        }
    };

    const dimensions = getChatDimensions();
    const isMobile = windowWidth < 640;

    const quickQuestions = [
        t('chatbot.skills_q'),
        t('chatbot.projects_q'),
        t('chatbot.experience_q'),
        t('chatbot.contact_q')
    ];

    // Responsive chat position variants
    const chatVariants = isMobile ? {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: 20,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    } : {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transformOrigin: 'bottom right'
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <div className={`${isMobile && isOpen ? 'fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm' : 'fixed bottom-6 right-6 z-[9999]'} font-sans`}>
            {/* Floating Action Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className={`group relative p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${drakeMode
                        ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-white'
                        : 'bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500 text-white'
                        } hover:shadow-3xl hover:shadow-violet-500/40`}
                    aria-label="Open chat"
                >
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1">
                        <div className="relative">
                            <div className={`absolute inset-0 animate-ping ${drakeMode ? 'bg-pink-400' : 'bg-violet-400'} rounded-full opacity-75`}></div>
                            <div className={`relative w-2 h-2 sm:w-3 sm:h-3 ${drakeMode ? 'bg-pink-400' : 'bg-violet-400'} rounded-full`}></div>
                        </div>
                    </div>
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Mobile overlay */}
                        {isMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[-1]"
                            />
                        )}

                        <motion.div
                            variants={chatVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{
                                width: dimensions.width,
                                height: dimensions.height,
                                maxWidth: dimensions.maxWidth,
                                ...(isMobile && {
                                    maxHeight: 'calc(100vh - 2rem)',
                                    margin: '1rem'
                                })
                            }}
                            className={`flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl sm:shadow-3xl overflow-hidden transition-all duration-300 backdrop-blur-xl ${dimensions.position} ${drakeMode
                                ? 'bg-gradient-to-b from-[#0d0d1a]/95 to-[#08080f]/95 border border-violet-500/30 text-white'
                                : 'bg-gradient-to-b from-white to-violet-50/95 border border-violet-200 text-gray-900'
                                }`}
                        >
                            {/* Header */}
                            <div className={`p-3 sm:p-4 flex items-center justify-between ${drakeMode
                                ? 'bg-gradient-to-r from-violet-900/60 to-pink-900/40 border-b border-violet-500/20'
                                : 'bg-gradient-to-r from-violet-600 to-pink-500 border-b border-violet-200'
                                } text-white shadow-lg`}>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                                        className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${drakeMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}
                                    >
                                        <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.div>
                                    <div>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <h3 className="font-bold text-xs sm:text-sm">{t('chatbot.assistant_title')}</h3>
                                            <Sparkles className="w-3 h-3 text-yellow-300 hidden sm:block" />
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-1.5">
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                                            ></motion.span>
                                            <span className="text-[9px] sm:text-[10px] opacity-90 uppercase tracking-wider font-semibold">{t('chatbot.ready')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    {!isMobile && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsMinimized(!isMinimized)}
                                            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
                                            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                                        >
                                            {isMinimized ? (
                                                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            ) : (
                                                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            )}
                                        </motion.button>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
                                        aria-label="Close chat"
                                    >
                                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            {!isMinimized && (
                                <>
                                    <div className={`flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-track-transparent ${drakeMode
                                        ? 'scrollbar-thumb-violet-500/30 hover:scrollbar-thumb-violet-500/50'
                                        : 'scrollbar-thumb-violet-200 hover:scrollbar-thumb-violet-300'
                                        }`}>
                                        {messages.map((msg, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                                    style={{ maxWidth: dimensions.messageMaxWidth }}>
                                                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.role === 'user'
                                                        ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white'
                                                        : drakeMode
                                                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                            : 'bg-violet-100 text-violet-600 border border-violet-200'
                                                        }`}>
                                                        {msg.role === 'user' ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
                                                    </div>
                                                    <motion.div
                                                        initial={{ scale: 0.95 }}
                                                        animate={{ scale: 1 }}
                                                        className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                                            ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-br-none sm:rounded-br-none'
                                                            : drakeMode
                                                                ? 'bg-white/5 text-gray-200 rounded-bl-none sm:rounded-bl-none border border-violet-500/20'
                                                                : 'bg-violet-50/70 text-gray-800 rounded-bl-none sm:rounded-bl-none border border-violet-100'
                                                            }`}
                                                    >
                                                        {msg.content}
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-start"
                                            >
                                                <div className="flex gap-2 sm:gap-3" style={{ maxWidth: dimensions.messageMaxWidth }}>
                                                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${drakeMode
                                                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                        : 'bg-violet-100 text-violet-600 border border-violet-200'
                                                        }`}>
                                                        <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </div>
                                                    <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl rounded-bl-none ${drakeMode
                                                        ? 'bg-white/5 border border-violet-500/20'
                                                        : 'bg-violet-50/70 border border-violet-100'
                                                        }`}>
                                                        <div className="flex items-center gap-1">
                                                            <motion.div
                                                                animate={{ y: [0, -4, 0] }}
                                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${drakeMode ? 'bg-violet-400' : 'bg-violet-500'}`}
                                                            />
                                                            <motion.div
                                                                animate={{ y: [0, -4, 0] }}
                                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${drakeMode ? 'bg-violet-400' : 'bg-violet-500'}`}
                                                            />
                                                            <motion.div
                                                                animate={{ y: [0, -4, 0] }}
                                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${drakeMode ? 'bg-violet-400' : 'bg-violet-500'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {messages.length === 1 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="mt-3 sm:mt-4"
                                            >
                                                <p className={`text-xs font-medium mb-2 sm:mb-3 ${drakeMode ? 'text-violet-300/80' : 'text-violet-600/80'} text-center`}>
                                                    {t('chatbot.try_asking', { defaultValue: 'Try asking about:' })}
                                                </p>
                                                <div className={`grid ${dimensions.quickQuestionsCols} gap-1.5 sm:gap-2`}>
                                                    {quickQuestions.map((question, idx) => (
                                                        <motion.button
                                                            key={idx}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleQuickQuestion(question)}
                                                            className={`p-2 sm:p-3 text-xs rounded-lg sm:rounded-xl text-left transition-all duration-300 ${drakeMode
                                                                ? 'bg-white/5 hover:bg-violet-500/20 border border-violet-500/20 hover:border-violet-400/40 text-gray-200'
                                                                : 'bg-violet-50 hover:bg-violet-100 border border-violet-200 hover:border-violet-300 text-gray-700'
                                                                }`}
                                                        >
                                                            {question}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <motion.form
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onSubmit={handleSend}
                                        className={`p-3 sm:p-4 pt-2 sm:pt-3 ${drakeMode
                                            ? 'bg-gradient-to-t from-violet-950/30 to-transparent border-t border-violet-500/20'
                                            : 'bg-gradient-to-t from-violet-50/50 to-transparent border-t border-violet-100'
                                            } shadow-inner`}
                                    >
                                        <div className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border-2 transition-all duration-300 shadow-sm ${drakeMode
                                            ? 'bg-white/5 border-violet-500/20 focus-within:border-violet-400/50'
                                            : 'bg-white border-violet-200 focus-within:border-violet-400'
                                            }`}>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder={t('chatbot.placeholder')}
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm p-1.5 sm:p-2 outline-none placeholder-gray-400"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSend(e);
                                                    }
                                                }}
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="submit"
                                                disabled={!input.trim() || isLoading}
                                                className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md ${!input.trim() || isLoading
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white'
                                                    }`}
                                                aria-label="Send message"
                                            >
                                                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </motion.button>
                                        </div>
                                    </motion.form>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatBot;