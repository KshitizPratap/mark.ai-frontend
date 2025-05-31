import React, { ChangeEvent, KeyboardEvent, useRef, useEffect } from "react";
import { PaperclipIcon, SendIcon } from "./IconComponents";
import { ThreeDots } from "react-loader-spinner";
import { usePostStore } from "@/store/usePostStore";
import { Message } from "@/types";
import { chatWithMark } from "@/services/chatServices";
import { useAuthStore } from "@/store/useAuthStore";
import { marked } from 'marked';
import { initialiseChatWithMark } from "@/commons/constant";

const ChatPanel = () => {
  const {
    messages,
    isThinking,
    setIsThinking,
    setLivePost,
    setMessages,
    livePost,
    loadChatHistory,
  } = usePostStore();
  
  const [inputValue, setInputValue] = React.useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = React.useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {isAuth} = useAuthStore();

  const chatPanelBg = "bg-[#11132f]";
  const chatHeaderBorder = "border-gray-600/60";
  const chatInputBorder = "border-[#475569]/50";
  const chatInputBg = "bg-[#334155]/50";
  const messagePlaceholderColor = "text-gray-400";
  const sendButtonBg = "bg-blue-600";
  const chatBubbleGradient = "bg-gradient-to-r from-[#3b82f6] to-[#2563eb]";
  const userChatBubbleBg = "bg-white";
  const userChatBubbleText = "text-gray-700";

  // Load chat history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      if (isAuth) {
        setIsLoadingHistory(true);
        try {
          await loadChatHistory();
        } catch (error) {
          console.error('Failed to load chat history:', error);
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };

    loadHistory();
  }, [isAuth, loadChatHistory]);

  // Initialize chat with first AI message only if no history exists
  useEffect(() => {
    if (messages && messages.length === 0 && isAuth && !isLoadingHistory) {
      setIsThinking(true);
      handleChatResponse(initialiseChatWithMark);
    }
  }, [isAuth, messages.length, isLoadingHistory]);

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, 0);
    
    return () => clearTimeout(scrollTimeout);
  }, [messages, isThinking]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isWaitingForResponse) {
      setInputValue(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleChatResponse = async (messageText: string) => {
    try {
      const requestBody = {
        message: messageText,
        post: {
          ...livePost,
          scheduleDate: livePost.scheduleDate.toISOString()
        }
      };

      const response = await chatWithMark(requestBody);
      
      if (response?.bot?.text) {
        const aiResponseMessage: Message = {
          id: Date.now().toString(),
          text: response.bot.text,
          sender: "system",
          timestamp: new Date()
        };
        setMessages((prevMessages: Message[]) => [...prevMessages, aiResponseMessage]);

        // Update post state if available
        if (response.hasPost) {
          const { post } = response;
          setLivePost({
            title: post.title ?? "",
            content: post.content ?? "",
            hashtag: Array.isArray(post.hashtags) ? post.hashtags.join(' ') : (post.hashtags ?? "")
          });
        }
      } else {
        const aiErrorResponse: Message = {
          id: Date.now().toString(),
          text: "I am sorry, looks like I am not able to process any request. Can you please try again?",
          sender: "system",
          timestamp: new Date()
        };
        setMessages((prev: Message[]) => [...prev, aiErrorResponse]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error: Could not connect to the AI service.";
      const aiErrorResponse: Message = {
        id: Date.now().toString(),
        text: errorMessage,
        sender: "system",
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, aiErrorResponse]);
    } finally {
      setIsThinking(false);
      setIsWaitingForResponse(false);
    }
  };

  const handleSend = async () => {
    const messageText = inputValue.trim();
    if (messageText && !isWaitingForResponse) {
      setIsWaitingForResponse(true);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: "user",
        timestamp: new Date()
      };
      setMessages((prevMessages: Message[]) => [...prevMessages, newMessage]);
      setInputValue("");

      const textarea = document.getElementById(
        "chat-textarea"
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "auto";
      }

      setIsThinking(true);
      await handleChatResponse(messageText);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isWaitingForResponse) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (text: string) => {
    // Configure marked options
    marked.setOptions({
      breaks: true, // Convert line breaks to <br>
      gfm: true, // GitHub Flavored Markdown
    });

    // Pre-process text to handle double line breaks
    const processedText = text.replace(/\n/g, '<br>');

    // Convert markdown to HTML
    const htmlContent = marked(processedText);

    return (
      <div 
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  return (
    <div
      className={`relative flex flex-col ${chatPanelBg} text-white border-r-2 border-gray-800 h-full overflow-hidden`}
    >
      <div
        className={`h-[54px] flex items-center px-5 border-b ${chatHeaderBorder} shrink-0`}
      >
        <h2 className="font-semibold text-sm">Chat with Mark</h2>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
      >
        {isLoadingHistory ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center space-y-2">
              <ThreeDots
                visible={true}
                height="30"
                width="60"
                color="#3b82f6"
                radius="9"
                ariaLabel="loading-chat-history"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <span className="text-gray-400 text-sm">Loading chat history...</span>
            </div>
          </div>
        ) : (
          <>
            {(messages || []).map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[85%] md:max-w-[80%] shadow-md text-sm ${
                    message.sender === "user"
                      ? `${userChatBubbleBg} ${userChatBubbleText}`
                      : `${chatBubbleGradient} text-white`
                  }`}
                >
                  {renderMessageContent(message.text)}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div
                  className={`px-4 py-2 rounded-lg max-w-[85%] md:max-w-[80%] shadow-md text-sm ${chatBubbleGradient} text-white`}
                >
                  <ThreeDots
                    visible={true}
                    height="20"
                    width="40"
                    color="#fff"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className={`p-4 border-t ${chatInputBorder} shrink-0`}>
        <div
          className={`flex items-end ${chatInputBg} rounded-xl border ${chatInputBorder} px-4 py-2`}
        >
          <textarea
            id="chat-textarea"
            rows={1}
            placeholder={isWaitingForResponse ? "Waiting for response..." : "Type your message..."}
            className={`flex-1 bg-transparent ${messagePlaceholderColor} text-sm focus:outline-none resize-none py-1.5 placeholder-gray-400 max-h-24 overflow-y-auto`}
            style={{ scrollbarWidth: "none" }}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isWaitingForResponse}
          />
          <button
            className={`ml-3 ${sendButtonBg} rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-blue-700 flex-shrink-0 self-center mb-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleSend}
            disabled={!inputValue.trim() || isWaitingForResponse}
          >
            <SendIcon className="w-5 h-5 transform rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;