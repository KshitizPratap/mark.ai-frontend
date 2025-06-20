import React, { ChangeEvent, KeyboardEvent, useRef, useEffect } from "react";
import { SendIcon } from "./IconComponents";
import { ThreeDots } from "react-loader-spinner";
import { usePostStore } from "@/store/usePostStore";
import { Message } from "@/types";
import { chatWithMark } from "@/services/chatServices";
import { useAuthStore } from "@/store/useAuthStore";
import { marked } from 'marked';
import { initialiseChatWithMark } from "@/commons/constant";
import { formatHashtagsForDisplay } from "@/utils/postUtils";
import { useLocation } from "wouter";

const ChatPanel = () => {
  const [location, navigate] = useLocation();
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
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isAuth, isMobileView, isOnboardingComplete, fetchOnboardingState } = useAuthStore();

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

  // Initialize chat with Mark only once when conditions are met
  useEffect(() => {
    // Only proceed if we're authenticated and chat history has finished loading
    if (!isAuth || isLoadingHistory) {
      return;
    }

    // Case 1: If onboarding is complete, always initialize chat with Mark
    if (isOnboardingComplete()) {
      handleChatResponse(initialiseChatWithMark);
      return;
    }

    // // Case 2: If onboarding is NOT complete, only initialize if no messages exist
    if (!isOnboardingComplete() && messages?.length === 0) {
      handleChatResponse(initialiseChatWithMark);
    }
  }, [isAuth, isLoadingHistory]);

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

  // Auto-focus textarea when response is received
  useEffect(() => {
    if (!isThinking && textareaRef.current) {
      // Small delay to ensure the textarea is enabled before focusing
      const focusTimeout = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(focusTimeout);
    }
  }, [isThinking]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isThinking) {
      setInputValue(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleChatResponse = async (messageText: string) => {
    let apiCompleted = false;
    let thinkingTimeout = setTimeout(() => {
      if (!apiCompleted) {
        setIsThinking(true);
      }
    }, 2000);

    try {
      const requestBody = {
        message: messageText,
        post: {
          ...livePost,
          scheduleDate: livePost.scheduleDate.toISOString()
        }
      };

      const response = await chatWithMark(requestBody);
      apiCompleted = true;
      
      if (response?.bot?.text) {
        const aiResponseMessage: Message = {
          id: Date.now().toString(),
          text: response.bot.text,
          sender: "mark",
          timestamp: new Date()
        };
        setMessages((prevMessages: Message[]) => [...prevMessages, aiResponseMessage]);

        // Update post state if available
        if (response.hasPost) {
          const { post } = response;
          const rawHashtags = Array.isArray(post.hashtag) ? post.hashtag.join(' ') : (post.hashtag ?? "");
          const formattedHashtags = formatHashtagsForDisplay(rawHashtags);
          
          setLivePost({
            title: post.title ?? "",
            content: post.content ?? "",
            hashtag: formattedHashtags
          });

          if (!location.startsWith('/create')) {
            setMessages((prevMessages) => [
              ...prevMessages, 
              {
                id: Date.now().toString(),
                text: 
                  <>
                    Mark has created the post. 
                    <span className="cursor-pointer underline" onClick={() =>  navigate('/create')}>
                     {" "} Click to view.
                    </span>
                  </>,
                sender: "system",
                timestamp: new Date()
              }
            ]);
          }
        } else {
            if (location === '/mind') {
                await fetchOnboardingState();
            }
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
      clearTimeout(thinkingTimeout);
      setIsThinking(false);
    }
  };

  const handleSend = async () => {
    const messageText = inputValue.trim();
    if (messageText && !isThinking) {
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

      await handleChatResponse(messageText);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isThinking) {
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
      className={`relative flex flex-col ${chatPanelBg} text-white border-r-2 border-gray-800 h-full overflow-hidden ${isMobileView ? '' : ''}`}
    >
      <div
        className={`h-[54px] flex items-center justify-between px-5 border-b ${chatHeaderBorder} shrink-0`}
      >
        <h2 className="font-semibold text-sm">Chat with Mark</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">Online</span>
        </div>
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
                {message.sender === "system" ? (
                  <div className="w-full text-center text-gray-400 text-sm italic py-1">
                    {message.text}
                  </div>
                ) : (
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[85%] md:max-w-[80%] shadow-md text-sm ${
                      message.sender === "user"
                        ? `${userChatBubbleBg} ${userChatBubbleText}`
                        : `${chatBubbleGradient} text-white`
                    }`}
                  >
                    {renderMessageContent(message.text as string)}
                  </div>
                )}
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
            placeholder="Type your message..."
            className={`flex-1 bg-transparent ${messagePlaceholderColor} text-sm focus:outline-none resize-none py-1.5 placeholder-gray-400 max-h-24 overflow-y-auto`}
            style={{ scrollbarWidth: "none" }}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
            ref={textareaRef}
          />
          <button
            className={`ml-3 ${sendButtonBg} rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-blue-700 flex-shrink-0 self-center mb-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking}
          >
            <SendIcon className="w-5 h-5 transform rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;