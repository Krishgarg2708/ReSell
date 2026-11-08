import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Send, 
  MessageSquare, 
  Tag, 
  CheckCheck, 
  ShoppingBag, 
  CheckCircle2, 
  X, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ChatMessage } from '../../types';

export const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    conversations, 
    sendMessage, 
    respondToOffer, 
    markConversationAsRead, 
    currentUser,
    currentRole,
    addToCart,
    products
  } = useAppStore();

  const isSellerRole = currentRole === 'seller';

  // Active conversation selection
  const convIdParam = searchParams.get('convId');
  const [selectedConvId, setSelectedConvId] = useState<string>(
    convIdParam || (conversations[0]?.id ?? '')
  );

  const [inputMessage, setInputMessage] = useState('');
  const [counterInput, setCounterInput] = useState<number | ''>('');
  const [isCountering, setIsCountering] = useState(false);

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const linkedProduct = products.find((p) => p.id === activeConversation?.productId);

  useEffect(() => {
    if (convIdParam) {
      setSelectedConvId(convIdParam);
    }
  }, [convIdParam]);

  useEffect(() => {
    if (activeConversation) {
      markConversationAsRead(activeConversation.id);
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleQuickReply = (text: string) => {
    if (!activeConversation) return;
    sendMessage(activeConversation.id, text);
  };

  const handleAcceptOffer = () => {
    if (!activeConversation || !activeConversation.activeOffer) return;
    respondToOffer(activeConversation.id, activeConversation.activeOffer.id, 'accept');
  };

  const handleRejectOffer = () => {
    if (!activeConversation || !activeConversation.activeOffer) return;
    respondToOffer(activeConversation.id, activeConversation.activeOffer.id, 'reject');
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !activeConversation.activeOffer || !counterInput) return;
    respondToOffer(activeConversation.id, activeConversation.activeOffer.id, 'counter', Number(counterInput));
    setIsCountering(false);
    setCounterInput('');
  };

  const handleCheckoutAgreed = () => {
    if (!linkedProduct) return;
    const agreedPrice = activeConversation?.activeOffer?.counterPrice || activeConversation?.activeOffer?.offeredPrice || linkedProduct.price;
    const itemWithAgreedPrice = { ...linkedProduct, price: agreedPrice };
    addToCart(itemWithAgreedPrice);
    navigate('/checkout');
  };

  const quickReplies = isSellerRole
    ? [
        'Yes, the price is negotiable for serious buyers.',
        'I can arrange safe pickup near Indiranagar today.',
        'Yes, it includes original purchase bill and box.',
      ]
    : [
        'Hi, is this item still available?',
        'Are there any scratches or dents on the surface?',
        'Can I inspect the item tomorrow in person?',
        'Would you consider a slightly lower offer for quick closing?',
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isSellerRole ? 'Seller Inquiries & Offers' : 'In-App Messages & Negotiations'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simulated live peer-to-peer discussions with instant seller response physics.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[750px]">
        {/* Left Panel: Conversation List */}
        <aside className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Conversations ({conversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv.id === activeConversation?.id;
                const otherPartyName = isSellerRole ? conv.buyerName : conv.sellerName;
                const otherPartyAvatar = isSellerRole ? conv.buyerAvatar : conv.sellerAvatar;
                const unread = isSellerRole ? conv.unreadCountSeller : conv.unreadCountBuyer;

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      markConversationAsRead(conv.id);
                    }}
                    className={`w-full p-4 text-left flex gap-3 transition-colors ${
                      isSelected
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border-l-3 border-blue-600'
                        : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={otherPartyAvatar}
                        alt={otherPartyName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      {conv.isSellerOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {otherPartyName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.lastMessageTimestamp}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate mt-0.5">
                        {conv.productTitle}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                          {conv.lastMessage}
                        </p>
                        {unread > 0 && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Panel: Active Chat Window */}
        {activeConversation ? (
          <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={isSellerRole ? activeConversation.buyerAvatar : activeConversation.sellerAvatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {isSellerRole ? activeConversation.buyerName : activeConversation.sellerName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active now
                    </span>
                    <span>·</span>
                    <span className="truncate">{activeConversation.productTitle}</span>
                  </div>
                </div>
              </div>

              {/* Product link */}
              <Link
                to={`/products/${activeConversation.productId}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-lg hover:bg-blue-100 transition-colors shrink-0"
              >
                View Listing <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Product Context Banner */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeConversation.productImage}
                  alt={activeConversation.productTitle}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/resell_hero_marketplace_1794130051291.jpg';
                  }}
                />
                <div className="truncate">
                  <span className="font-semibold text-slate-900 dark:text-white truncate block">
                    {activeConversation.productTitle}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                    Listing Price: ₹{activeConversation.productPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Price Negotiation Offer Card */}
            {activeConversation.activeOffer && (
              <div className="m-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-blue-950 dark:text-blue-200">
                      Active Price Negotiation
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeConversation.activeOffer.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : activeConversation.activeOffer.status === 'Countered'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : activeConversation.activeOffer.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {activeConversation.activeOffer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Proposed Offer</span>
                    <p className="font-bold text-slate-900 dark:text-white tabular-nums">
                      ₹{activeConversation.activeOffer.offeredPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                  {activeConversation.activeOffer.counterPrice && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">Counteroffer</span>
                      <p className="font-bold text-purple-700 dark:text-purple-300 tabular-nums">
                        ₹{activeConversation.activeOffer.counterPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Listing Price</span>
                    <p className="font-medium text-slate-400 line-through tabular-nums">
                      ₹{activeConversation.activeOffer.listingPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Offer Action Buttons */}
                {activeConversation.activeOffer.status === 'Accepted' ? (
                  <div className="pt-2 flex items-center justify-between border-t border-blue-200 dark:border-blue-800/80">
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                      ✓ Offer agreed at ₹{(activeConversation.activeOffer.counterPrice || activeConversation.activeOffer.offeredPrice).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={handleCheckoutAgreed}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                    >
                      Checkout Agreed Price <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : activeConversation.activeOffer.status !== 'Rejected' ? (
                  <div className="pt-2 border-t border-blue-200 dark:border-blue-800/80 flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleAcceptOffer}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={() => setIsCountering(!isCountering)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      Counteroffer
                    </button>
                    <button
                      onClick={handleRejectOffer}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      Decline
                    </button>

                    {isCountering && (
                      <form onSubmit={handleSendCounter} className="flex items-center gap-2 mt-2 w-full">
                        <input
                          type="number"
                          value={counterInput}
                          onChange={(e) => setCounterInput(Number(e.target.value))}
                          placeholder="Counter amount (₹)"
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                        >
                          Send Counter
                        </button>
                      </form>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConversation.messages.map((msg) => {
                const isMe = isSellerRole
                  ? msg.senderRole === 'seller'
                  : msg.senderRole === 'buyer';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Strip */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Quick:
              </span>
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(reply)}
                  className="px-2.5 py-1 text-[11px] rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 whitespace-nowrap transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message or negotiate terms..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center p-8 text-xs text-slate-400">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};
