"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatTrigger from "./ChatTrigger";
import ChatBox from "./ChatBox";

/**
 * FloatingChat - Uses ChatTrigger and ChatBox
 * The ChatTrigger floats at bottom-center, ChatBox opens when user submits a query
 */
export default function FloatingChat() {
    const [showChat, setShowChat] = useState(false);
    const [initialQuery, setInitialQuery] = useState("");

    const handleTriggerSubmit = (query: string) => {
        setInitialQuery(query);
        setShowChat(true);
    };

    const handleCloseChat = () => {
        setShowChat(false);
        setInitialQuery("");
    };

    return (
        <>
            {/* Floating ChatTrigger - Bottom center */}
            <AnimatePresence>
                {!showChat && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <ChatTrigger onSubmit={handleTriggerSubmit} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ChatBox - Bottom right when open */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-48px)]"
                    >
                        <ChatBox
                            onClose={handleCloseChat}
                            initialQuery={initialQuery}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
