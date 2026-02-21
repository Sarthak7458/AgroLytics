"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, User, Bot, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/language-context";

interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
    options?: string[];
}

export function SiteChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const FAQ_DATA = [
        { question: t("chatbot.faq1q"), answer: t("chatbot.faq1a") },
        { question: t("chatbot.faq2q"), answer: t("chatbot.faq2a") },
        { question: t("chatbot.faq3q"), answer: t("chatbot.faq3a") },
        { question: t("chatbot.faq4q"), answer: t("chatbot.faq4a") },
        { question: t("chatbot.faq5q"), answer: t("chatbot.faq5a") },
    ];

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            content: t("chatbot.greeting"),
            options: FAQ_DATA.map(f => f.question)
        }
    ]);
    const [input, setInput] = useState("");
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [messages, isOpen]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            const faqMatch = FAQ_DATA.find(f => f.question === text);
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: faqMatch
                    ? faqMatch.answer
                    : t("chatbot.fallback"),
                options: FAQ_DATA.map(f => f.question)
            };
            setMessages(prev => [...prev, botResponse]);
        }, 600);
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-80 sm:w-96 shadow-2xl rounded-2xl overflow-hidden"
                    >
                        <Card className="border-green-100 dark:border-green-800 shadow-none h-[500px] flex flex-col">
                            <CardHeader className="bg-green-700 text-white p-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-1.5 rounded-full">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold">{t("chatbot.title")}</CardTitle>
                                        <p className="text-xs text-green-100">{t("chatbot.subtitle")}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleChat}
                                    className="text-white hover:bg-white/20 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </CardHeader>

                            <CardContent className="flex-1 p-0 overflow-hidden bg-muted/50 flex flex-col">
                                <ScrollArea className="h-full px-4 pt-4">
                                    <div className="space-y-4 pb-4">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={msg.id}
                                                ref={index === messages.length - 1 ? lastMessageRef : null}
                                                className={cn(
                                                    "flex w-full",
                                                    msg.role === "user" ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "max-w-[80%] rounded-2xl p-3 text-sm",
                                                        msg.role === "user"
                                                            ? "bg-green-600 text-white rounded-tr-none"
                                                            : "bg-card border border-border text-foreground rounded-tl-none shadow-sm"
                                                    )}
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Show options if the last message was from bot */}
                                        {messages[messages.length - 1].role === "bot" && messages[messages.length - 1].options && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {messages[messages.length - 1].options!.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSendMessage(option)}
                                                        className="text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors border border-green-200 dark:border-green-700"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            <CardFooter className="p-3 bg-card border-t border-border">
                                <form
                                    className="flex w-full items-center gap-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage(input);
                                    }}
                                >
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={t("chatbot.placeholder")}
                                        className="flex-1 bg-muted border-0 rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="rounded-full bg-green-600 hover:bg-green-700 w-8 h-8"
                                        disabled={!input.trim()}
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
