import React, { useState, useEffect } from 'react';
import ChatInterface, { MessageType } from '@/components/ChatInterface';
import { SecondMessageModal } from '@/components/SignUpPromptModal';
import markImage from '../assets/mark.png';
import { useLocation } from 'wouter';
import { initialMessages } from '@/commons/constant';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthModal } from '@/components/auth/AuthModal';

export default function Home() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auth states
  const { setIsOpen: onOpen, setView, logout, isAuth, userDetails: user } = useAuthStore();
  const [, setLocation] = useLocation();

  // State to control animation of messages
  const [visibleMessages, setVisibleMessages] = useState<MessageType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showSecondMessageModal, setShowSecondMessageModal] = useState(false);

  // Animation effect to show messages one by one with delay
  useEffect(() => {
    if (messageIndex < initialMessages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, initialMessages[messageIndex]]);
        setMessageIndex(messageIndex + 1);
      }, 1000); // 1 second delay between messages
      
      return () => clearTimeout(timer);
    }
  }, [messageIndex]);

  const handleSendMessage = (text: string) => {
    // Add user message
    const newMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setVisibleMessages(prev => [...prev, newMessage]);
    
    // Show modal after second message
    const userMessages = [...messages, newMessage].filter((msg) => msg.sender === "user")
    if (userMessages.length >= 2) {
      setShowSecondMessageModal(true);
      return;
    }
    
    // Simulate system response
    setTimeout(() => {
      const systemResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        text: `I can help with creating engaging captions! Let's work on making your posts stand out with compelling and creative captions.`,
        sender: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemResponse]);
      setVisibleMessages(prev => [...prev, systemResponse]);
    }, 1000);
  };

  const handleSignIn = () => {
    setShowSecondMessageModal(false);
    setView('signin');
    onOpen(true);
  };

  const handleSignUp = () => {
    setShowSecondMessageModal(false);
    setView('signup');
    onOpen(true);
  };

  return (
    <div style={{ 
      position: "relative", 
      minHeight: "100vh", 
      backgroundColor: "#0f172a", 
      color: "white",
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden' // Ensure no scrollbars from animation overflow
    }}>
      {/* Navbar */}
      <header style={{ 
        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 5vw, 2rem)', 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: 'clamp(18px, 5vw, 24px)' }}>Mark</span>
          <span style={{ 
            color: '#60a5fa', 
            marginLeft: '8px', 
            fontSize: 'clamp(14px, 4vw, 18px)',
            display: 'inline-block'
          }}>- Social Growth Expert</span>
        </div>
        
        {/* Hamburger Menu for Mobile */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-only hamburger-menu"
          style={{
            display: 'none', // Initially hidden, class will override on mobile
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            zIndex: 11
          }}
        >
          {/* Hamburger icon */}
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: 'white',
            margin: '4px 0',
            transition: 'all 0.3s ease'
          }}></div>
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: 'white',
            margin: '4px 0',
            transition: 'all 0.3s ease'
          }}></div>
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: 'white',
            margin: '4px 0',
            transition: 'all 0.3s ease'
          }}></div>
        </button>
        
        {/* Navigation - desktop view */}
        <nav 
          className="desktop-only"
          style={{ 
            display: 'flex', 
            gap: 'clamp(0.5rem, 3vw, 1.5rem)', 
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
          <a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 'clamp(14px, 4vw, 16px)' }}>Features</a>
          <a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 'clamp(14px, 4vw, 16px)' }}>About</a>
          <a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 'clamp(14px, 4vw, 16px)' }}>FAQ</a>
          
          {/* Show different buttons based on authentication status */}
          {isAuth ? (
            <>
              <button 
                onClick={() => setLocation('/create')}
                style={{ 
                  backgroundColor: '#1e293b', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '9999px', 
                  padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 20px)',
                  cursor: 'pointer',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  whiteSpace: 'nowrap'
                }}>Create Post</button>
              <button 
                onClick={async () => {
                  await logout();
                }}
                style={{ 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '9999px', 
                  padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 20px)',
                  cursor: 'pointer',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  whiteSpace: 'nowrap'
                }}>Sign out</button>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  setView('signin');
                  onOpen(true);
                }}
                style={{ 
                  backgroundColor: '#1e293b', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '9999px', 
                  padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 20px)',
                  cursor: 'pointer',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  whiteSpace: 'nowrap'
                }}>Sign in</button>
              <button 
                onClick={() => {
                  setView('signup');
                  onOpen(true);
                }}
                style={{ 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '9999px', 
                  padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 20px)',
                  cursor: 'pointer',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  whiteSpace: 'nowrap'
                }}>Sign up</button>
            </>
          )}
        </nav>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#0f172a',
            padding: '1rem',
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderTop: '1px solid #1e293b',
            textAlign: 'center'
          }}>
            <a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '16px', padding: '10px 0' }}>Features</a>
            <a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '16px', padding: '10px 0' }}>About</a>
            <a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '16px', padding: '10px 0' }}>FAQ</a>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '8px',
              justifyContent: 'center'
            }}>
              {isAuth ? (
                <>
                  <button 
                    onClick={() => setLocation('/dashboard')}
                    style={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '9999px', 
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      width: '120px'
                    }}>Dashboard</button>
                  <button 
                    onClick={async () => {
                      await logout();
                      setMobileMenuOpen(false);
                    }}
                    style={{ 
                      backgroundColor: '#2563eb', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '9999px', 
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      width: '120px'
                    }}>Sign out</button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setView('signin');
                      onOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    style={{ 
                      backgroundColor: '#1e293b', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '9999px', 
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      width: '120px'
                    }}>Sign in</button>
                  <button 
                    onClick={() => {
                      setView('signup');
                      onOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    style={{ 
                      backgroundColor: '#2563eb', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '9999px', 
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      width: '120px'
                    }}>Sign up</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        padding: 'clamp(1rem, 5vw, 2rem)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <h1 style={{ 
          fontSize: 'clamp(32px, 10vw, 60px)', 
          fontWeight: 'bold', 
          color: 'white',
          textAlign: 'center',
          margin: '0 0 clamp(0.3rem, 2vw, 0.5rem) 0',
          animation: 'fadeIn 1s ease-in-out',
          width: '100%'
        }}>Interview <span style={{ color: '#60a5fa' }}>Mark</span></h1>
        <p style={{ 
          fontSize: 'clamp(16px, 5vw, 20px)', 
          color: '#93c5fd',
          textAlign: 'center',
          maxWidth: '592px',
          marginBottom: 'clamp(1rem, 5vw, 2rem)',
          animation: 'fadeIn 1.2s ease-in-out',
          width: '100%'
        }}>
          {isAuth && user ? (
            <>Welcome back, {user.name}! Your 24/7 Social Media Expert</>
          ) : (
            <>Your 24/7 Social Media Expert</>
          )}
        </p>

        {/* Profile Image - Mark.png */}
        <div style={{ 
          width: 'clamp(120px, 30vw, 160px)', 
          height: 'clamp(135px, 30vw, 180px)', 
          marginBottom: 'clamp(1rem, 5vw, 2rem)',
          position: 'relative',
          animation: 'fadeIn 1.4s ease-in-out'
        }}>
          {/* Mark image */}
          <img 
            src={markImage} 
            alt="Mark the Social Media Expert" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain'
            }} 
          />
        </div>
        
        {/* Chat Interface */}
        <div style={{ 
          width: '100%',
          maxWidth: '592px',
          animation: 'fadeIn 1.6s ease-in-out'
        }}>
          <ChatInterface 
            messages={visibleMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: 'clamp(16px, 4vw, 25px) clamp(16px, 5vw, 48px) clamp(15px, 4vw, 24px)',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className="footer-content" style={{ 
          width: '100%', 
          maxWidth: '1280px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(10px, 3vw, 20px)'
        }}>
          <span style={{ 
            color: '#64748b', 
            fontSize: 'clamp(12px, 3.5vw, 14px)',
            textAlign: 'center' // Center aligned
          }}>© 2025 Built by The Honeymooners Club</span>
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(12px, 3vw, 24px)',
            flexWrap: 'wrap',
            justifyContent: 'center' // Center aligned
          }}>
            <a href="#" style={{ color: '#64748b', fontSize: 'clamp(12px, 3.5vw, 14px)', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: '#64748b', fontSize: 'clamp(12px, 3.5vw, 14px)', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: '#64748b', fontSize: 'clamp(12px, 3.5vw, 14px)', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </footer>
      
      {/* Cosmic Background with Multiple Layers */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden', 
        pointerEvents: 'none', 
        zIndex: 0,
        background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)'
      }}>
        {/* Static background gradients - no animation */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, rgba(33, 78, 194, 0.05) 0%, transparent 70%)'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.05) 0%, transparent 80%)'
        }}></div>
        
        {/* Static reduced star background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(1px 1px at 5% 15%, white, transparent),
            radial-gradient(1px 1px at 15% 10%, white, transparent),
            radial-gradient(1px 1px at 25% 12%, white, transparent),
            radial-gradient(1px 1px at 35% 22%, white, transparent),
            radial-gradient(1px 1px at 45% 30%, white, transparent),
            radial-gradient(1px 1px at 55% 42%, white, transparent),
            radial-gradient(1px 1px at 65% 25%, white, transparent),
            radial-gradient(1px 1px at 75% 5%, white, transparent),
            radial-gradient(1px 1px at 85% 70%, white, transparent),
            radial-gradient(1px 1px at 95% 80%, white, transparent),
            
            radial-gradient(1.5px 1.5px at 8% 50%, white, transparent),
            radial-gradient(1.5px 1.5px at 22% 85%, white, transparent),
            radial-gradient(1.5px 1.5px at 38% 12%, white, transparent),
            radial-gradient(1.5px 1.5px at 52% 60%, white, transparent),
            radial-gradient(1.5px 1.5px at 68% 40%, white, transparent),
            radial-gradient(1.5px 1.5px at 82% 88%, white, transparent),
            radial-gradient(1.5px 1.5px at 92% 65%, white, transparent),
            
            radial-gradient(2px 2px at 10% 75%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 25% 65%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 40% 45%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 55% 15%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 70% 95%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 85% 50%, rgba(255, 255, 255, 0.9), transparent),
            
            radial-gradient(3px 3px at 17% 45%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(3px 3px at 47% 25%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(3px 3px at 77% 65%, rgba(255, 255, 255, 0.95), transparent),
            
            radial-gradient(1.5px 1.5px at 23% 67%, rgba(161, 196, 253, 0.9), transparent),
            radial-gradient(1.5px 1.5px at 63% 78%, rgba(161, 196, 253, 0.9), transparent)
          `
        }}></div>
        
        {/* Fixed star with glow */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '25%',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 0 10px 2px white'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '65%',
          left: '75%',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 0 15px 3px white'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '85%',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 0 12px 2px white'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '75%',
          left: '15%',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 0 10px 2px white'
        }}></div>
        
        {/* Fixed blue tinted stars */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '60%',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          backgroundColor: '#a1c4fd',
          boxShadow: '0 0 8px 3px #a1c4fd'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '40%',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          backgroundColor: '#a1c4fd',
          boxShadow: '0 0 10px 3px #a1c4fd'
        }}></div>
        
        {/* Static UI Elements */}
        {/* Decorative circle */}
        <div style={{
          position: 'absolute',
          top: '65%',
          right: '10%',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '1px solid rgba(160, 210, 255, 0.2)'
        }}></div>
        
        {/* Small dot */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '12%',
          width: '6px',
          height: '6px',
          backgroundColor: 'rgba(100, 180, 255, 0.6)',
          borderRadius: '50%',
          boxShadow: '0 0 5px rgba(100, 180, 255, 0.4)'
        }}></div>
        
        {/* Larger dot */}
        <div style={{
          position: 'absolute',
          top: '75%',
          left: '25%',
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(100, 180, 255, 0.5)',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(100, 180, 255, 0.3)'
        }}></div>
        
        {/* Decorative rings */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '1px solid rgba(160, 210, 255, 0.15)'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '1px solid rgba(160, 210, 255, 0.25)'
        }}></div>
        
        {/* Small constellation lines */}
        <svg style={{
          position: 'absolute',
          bottom: '20%',
          right: '30%',
          width: '100px',
          height: '80px',
          opacity: 0.4
        }}>
          <line x1="10" y1="10" x2="40" y2="30" stroke="rgba(160, 210, 255, 0.3)" strokeWidth="0.5" />
          <line x1="40" y1="30" x2="80" y2="15" stroke="rgba(160, 210, 255, 0.3)" strokeWidth="0.5" />
          <line x1="40" y1="30" x2="60" y2="60" stroke="rgba(160, 210, 255, 0.3)" strokeWidth="0.5" />
          <circle cx="10" cy="10" r="1" fill="white" />
          <circle cx="40" cy="30" r="1" fill="white" />
          <circle cx="80" cy="15" r="1.5" fill="white" />
          <circle cx="60" cy="60" r="1" fill="white" />
        </svg>
        
        {/* Another small constellation */}
        <svg style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '80px',
          height: '60px',
          opacity: 0.4
        }}>
          <line x1="10" y1="30" x2="40" y2="10" stroke="rgba(160, 210, 255, 0.3)" strokeWidth="0.5" />
          <line x1="40" y1="10" x2="65" y2="40" stroke="rgba(160, 210, 255, 0.3)" strokeWidth="0.5" />
          <circle cx="10" cy="30" r="1" fill="white" />
          <circle cx="40" cy="10" r="1" fill="white" />
          <circle cx="65" cy="40" r="1.5" fill="white" />
        </svg>
        
        {/* Additional UI Elements */}
        {/* Cluster of dots */}
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: '100px',
          height: '100px',
          opacity: 0.6
        }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '3px',
            height: '3px',
            backgroundColor: 'rgba(200, 230, 255, 0.9)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '70%',
            width: '2px',
            height: '2px',
            backgroundColor: 'rgba(200, 230, 255, 0.7)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '70%',
            left: '40%',
            width: '2px',
            height: '2px',
            backgroundColor: 'rgba(200, 230, 255, 0.8)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '60%',
            width: '1px',
            height: '1px',
            backgroundColor: 'rgba(200, 230, 255, 0.6)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '60%',
            left: '20%',
            width: '2px',
            height: '2px',
            backgroundColor: 'rgba(200, 230, 255, 0.7)',
            borderRadius: '50%'
          }}></div>
        </div>
        
        {/* Hexagon shape */}
        <svg style={{
          position: 'absolute',
          top: '70%',
          right: '20%',
          width: '40px',
          height: '40px',
          opacity: 0.3
        }}>
          <polygon 
            points="20,0 40,10 40,30 20,40 0,30 0,10" 
            fill="none" 
            stroke="rgba(160, 210, 255, 0.5)" 
            strokeWidth="0.5"
          />
          <circle cx="20" cy="20" r="1" fill="white" />
        </svg>
        
        {/* Circle with crossing lines */}
        <svg style={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '50px',
          height: '50px',
          opacity: 0.4
        }}>
          <circle cx="25" cy="25" r="15" fill="none" stroke="rgba(160, 210, 255, 0.3)" strokeWidth="0.5" />
          <line x1="10" y1="25" x2="40" y2="25" stroke="rgba(160, 210, 255, 0.3)" strokeWidth="0.5" />
          <line x1="25" y1="10" x2="25" y2="40" stroke="rgba(160, 210, 255, 0.3)" strokeWidth="0.5" />
          <circle cx="25" cy="25" r="1" fill="white" />
        </svg>
        
        {/* Decorative squares */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '70%',
          width: '20px',
          height: '20px',
          border: '1px solid rgba(160, 210, 255, 0.2)',
          opacity: 0.4
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '23%',
          left: '73%',
          width: '10px',
          height: '10px',
          border: '1px solid rgba(160, 210, 255, 0.3)',
          opacity: 0.5
        }}></div>
      </div>
      
      {/* Global style for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes twinkle {
            0% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.1); }
            100% { opacity: 0.6; transform: scale(1); }
          }
          
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-5px) translateX(5px); }
            50% { transform: translateY(0) translateX(10px); }
            75% { transform: translateY(5px) translateX(5px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          @keyframes nebula {
            0% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
            100% { opacity: 0.3; transform: scale(1); }
          }
          
          @keyframes nebula2 {
            0% { opacity: 0.2; transform: scale(1) rotate(0deg); }
            50% { opacity: 0.4; transform: scale(1.3) rotate(5deg); }
            100% { opacity: 0.2; transform: scale(1) rotate(0deg); }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes messageAppear {
            0% { opacity: 0; transform: translateX(-30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.2); }
            50% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3); }
            100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.2); }
          }
          
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(70px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(70px) rotate(-360deg); }
          }
          
          @keyframes pulse {
            0% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 0.6; transform: scale(1.2); }
            100% { opacity: 0.3; transform: scale(0.8); }
          }
          
          @keyframes float-ui {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          
          @keyframes float-ui-slow {
            0% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-5px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }
          
          @keyframes stars-move-1 {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-10px) translateX(10px); }
            50% { transform: translateY(-5px) translateX(15px); }
            75% { transform: translateY(5px) translateX(5px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          @keyframes stars-move-2 {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(5px) translateX(-10px); }
            50% { transform: translateY(10px) translateX(-15px); }
            75% { transform: translateY(5px) translateX(-5px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          @keyframes stars-move-3 {
            0% { transform: translateY(0) translateX(0); }
            33% { transform: translateY(-7px) translateX(7px); }
            66% { transform: translateY(7px) translateX(-7px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          @keyframes stars-move-4 {
            0% { transform: translateY(0) translateX(0); }
            33% { transform: translateY(8px) translateX(8px); }
            66% { transform: translateY(-8px) translateX(-8px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          @keyframes star-pulse {
            0% { opacity: 0.7; box-shadow: 0 0 5px 2px white; }
            100% { opacity: 1; box-shadow: 0 0 15px 4px white; }
          }
          
          @keyframes stars-move-5 {
            0% { transform: translateY(0) translateX(0); }
            33% { transform: translateY(-5px) translateX(5px); }
            66% { transform: translateY(5px) translateX(-5px); }
            100% { transform: translateY(0) translateX(0); }
          }
        `
      }} />
      
      {/* Add SecondMessageModal */}
      <SecondMessageModal 
        isOpen={showSecondMessageModal}
        onClose={() => setShowSecondMessageModal(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      <AuthModal />
    </div>
  );
}
