import React, { useState, useEffect, useRef } from 'react'
import { 
  Sparkles, MessageSquare, Send, Trash2, Edit2, Pin, FolderPlus, Folder, 
  Search, ArrowRight, Download, Share2, Copy, AlertTriangle, Square, 
  RefreshCw, X, ChevronRight, Scale, Check, Plus
} from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  isStreaming?: boolean
}

interface Conversation {
  id: string
  title: string
  folderId?: string
  pinned: boolean
  messages: ChatMessage[]
}

interface FolderType {
  id: string
  name: string
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'FIR Procedure under BNSS',
      pinned: true,
      folderId: 'f1',
      messages: [
        { role: 'user', content: 'What is the procedure to file an FIR under BNSS?' },
        { 
          role: 'assistant', 
          content: `Under the **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)**, the procedure for lodging a First Information Report (FIR) has been updated to modernize and streamline the process:\n\n### 1. Registration of FIR (Section 173 BNSS)\nEvery information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction.\n\n### 2. Key Updates under BNSS:\n* **Zero FIR:** You can file an FIR at any police station, regardless of the jurisdiction where the crime took place. The station will log it as a Zero FIR and transfer it to the concerned police station.\n* **e-FIR:** Information can be sent through electronic communication. However, it must be signed by the informant within **three days** for the FIR to be formally registered.\n* **Preliminary Enquiry:** In offences punishable with 3-7 years, a preliminary enquiry may be conducted within 14 days before registering the case to verify a prima facie case.\n\n### 3. Citizen Rights:\n* **Copy of FIR:** A copy of the FIR must be provided to the informant free of cost immediately.\n* **Updates:** Police must update the informant on the progress of the investigation within 90 days.`,
          sources: ['Section 173, Bharatiya Nagarik Suraksha Sanhita, 2023', 'Lalita Kumari v. Govt. of UP (2014) SC - Landmark on mandatory registration of FIR']
        }
      ]
    },
    {
      id: '2',
      title: 'Hindu Succession Act partition',
      pinned: false,
      folderId: 'f2',
      messages: [
        { role: 'user', content: 'How is property partitioned under Hindu Succession Act?' },
        { 
          role: 'assistant', 
          content: `Property partition under the **Hindu Succession Act, 1956 (amended in 2005)** details equal rights for male and female heirs:\n\n### 1. Coparcenary Property Rights\nFollowing the 2005 Amendment, daughters have the same rights in the coparcenary property (ancestral property) as sons. They become coparceners by birth and are subject to the same liabilities.\n\n### 2. Succession of Male Intestate (Section 8):\n* **Class I Heirs:** Receive equal shares (includes mother, widow, children, and children of deceased children).\n* **Class II Heirs:** Inherit only if no Class I heirs exist (includes father, siblings, etc.).\n\n### 3. Succession of Female Intestate (Section 15):\n* Primarily goes to sons, daughters, and husband.\n* Secondarily to heirs of the husband.\n* Thirdly to parents.`,
          sources: ['Section 6, Hindu Succession (Amendment) Act, 2005', 'Vineeta Sharma v. Rakesh Sharma (2020) SC - Retroactive coparcenary rights for daughters']
        }
      ]
    }
  ])

  const [folders, setFolders] = useState<FolderType[]>([
    { id: 'f1', name: 'Criminal Law' },
    { id: 'f2', name: 'Family & Property' }
  ])

  const [activeChatId, setActiveChatId] = useState<string>('1')
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentChat = conversations.find(c => c.id === activeChatId) || conversations[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentChat?.messages])

  // Simple Streaming Simulator
  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim() || isGenerating) return

    setInputText('')
    setIsGenerating(true)

    // Add user message immediately
    const userMsg: ChatMessage = { role: 'user', content: text }
    let targetChatId = activeChatId

    // If active chat is empty (new conversation), create one
    if (currentChat.messages.length === 0) {
      const newChatId = Date.now().toString()
      const newChat: Conversation = {
        id: newChatId,
        title: text.length > 25 ? text.substring(0, 25) + '...' : text,
        pinned: false,
        messages: [userMsg]
      }
      setConversations(prev => [newChat, ...prev])
      targetChatId = newChatId
      setActiveChatId(newChatId)
    } else {
      setConversations(prev => prev.map(c => {
        if (c.id === targetChatId) {
          return { ...c, messages: [...c.messages, userMsg] }
        }
        return c
      }))
    }

    // Trigger AI streaming response
    simulateStreamResponse(targetChatId, text)
  }

  const simulateStreamResponse = (chatId: string, userQuery: string) => {
    const streamContent = getMockResponseForQuery(userQuery)
    const assistantMsg: ChatMessage = { 
      role: 'assistant', 
      content: '', 
      isStreaming: true,
      sources: streamContent.sources 
    }

    // Append empty assistant message
    setConversations(prev => prev.map(c => {
      if (c.id === chatId) {
        return { ...c, messages: [...c.messages, assistantMsg] }
      }
      return c
    }))

    let index = 0
    const chars = streamContent.text.split('')
    const interval = setInterval(() => {
      setConversations(prev => prev.map(c => {
        if (c.id === chatId) {
          const updatedMessages = [...c.messages]
          const lastMsg = updatedMessages[updatedMessages.length - 1]
          if (lastMsg && lastMsg.role === 'assistant') {
            index += 3 // Stream 3 characters at a time for speed
            lastMsg.content = chars.slice(0, index).join('')
            if (index >= chars.length) {
              clearInterval(interval)
              lastMsg.isStreaming = false
              setIsGenerating(false)
            }
          }
          return { ...c, messages: updatedMessages }
        }
        return c
      }))
    }, 15)
  }

  const getMockResponseForQuery = (query: string) => {
    const q = query.toLowerCase()
    if (q.includes('bail') || q.includes('480') || q.includes('crpc')) {
      return {
        text: `### Bail under Section 480/482 BNSS (Formerly Section 437/439 CrPC):\n\nBail is a constitutional right to ensure liberty, unless specific conditions prevent it.\n\n### 1. Classification of Offence:\n* **Bailable:** Granting of bail is mandatory by the police or magistrate (Section 478 BNSS).\n* **Non-Bailable:** Magistrate has discretion under Section 480 BNSS. Special provisions are available for women, minors, and sick individuals.\n\n### 2. Key Criteria Considered by Courts:\n1. Gravity of the alleged offence.\n2. Risk of tampering with prosecution witnesses or evidence.\n3. Probability of the accused fleeing from justice.\n4. Prior criminal records and general character.\n\n### 3. Landmark Guidelines:\nIn **Arnesh Kumar v. State of Bihar (2014)**, the Supreme Court held that arrests should not be routine in cases punishable with less than 7 years, advocating for mandatory notices of appearance (under Section 35 BNSS).`,
        sources: ['Section 480, BNSS, 2023', 'Arnesh Kumar v. State of Bihar (2014) 8 SCC 273', 'Sanjay Chandra v. CBI (2012) 1 SCC 40']
      }
    }
    
    return {
      text: `### CourtCounsel AI Assessment:\n\nThank you for asking about "${query}". Here is the guidance based on current Indian legislation:\n\n### 1. Governing Statutes:\nDepending on the exact nature of your query, this matter will fall under the appropriate legal codes: the **Bharatiya Nyaya Sanhita, 2023 (BNS)** (replacing IPC), the **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)** (replacing CrPC), or specific civil/taxation legislation.\n\n### 2. Recommended Action Steps:\n1. **Identify Jurisdiction:** Determine the proper local Court where filing or complaint must be initiated.\n2. **Consult Counsel:** Match with a specialized lawyer using our Court Performance metrics.\n3. **Draft Documentation:** Ensure proper evidence collection, notice drafting, and legal formatting.\n\n### 3. General Exception:\nLimitations of liability and specific limitations acts apply to all civil claims (generally 3 years limitation).`,
      sources: ['Bharatiya Nyaya Sanhita (BNS), 2023', 'Limitation Act, 1963', 'Constitution of India, Article 14']
    }
  }

  const startNewChat = () => {
    const newChatId = 'new-' + Date.now().toString()
    const newChat: Conversation = {
      id: newChatId,
      title: 'New Conversation',
      pinned: false,
      messages: []
    }
    setConversations(prev => [newChat, ...prev])
    setActiveChatId(newChatId)
  }

  const deleteChat = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeChatId === id) {
      setActiveChatId(conversations[0]?.id || '')
    }
  }

  const togglePinChat = (id: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) return { ...c, pinned: !c.pinned }
      return c
    }))
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return
    const newFolder: FolderType = {
      id: 'folder-' + Date.now().toString(),
      name: newFolderName.trim()
    }
    setFolders(prev => [...prev, newFolder])
    setNewFolderName('')
    setShowNewFolderInput(false)
  }

  const moveChatToFolder = (chatId: string, folderId?: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === chatId) return { ...c, folderId }
      return c
    }))
  }

  const startRenameChat = (chat: Conversation) => {
    setEditingChatId(chat.id)
    setEditingTitle(chat.title)
  }

  const saveRenameChat = (id: string) => {
    if (!editingTitle.trim()) return
    setConversations(prev => prev.map(c => {
      if (c.id === id) return { ...c, title: editingTitle.trim() }
      return c
    }))
    setEditingChatId(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleDownloadPDF = (chat: Conversation) => {
    // Basic printable format triggers print dialog styled beautifully
    window.print()
  }

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(sidebarSearch.toLowerCase())
  )

  const suggestedPrompts = [
    { label: "Bail rights in domestic disputes", text: "What are my bail options under BNSS for a matrimonial dispute?" },
    { label: "How to draft a legal notice", text: "Generate a template for a legal notice for non-payment of dues." },
    { label: "Land partition timeline", text: "Explain the procedure and timeline of a property partition suit in Odisha." },
    { label: "GST non-compliance penalties", text: "What are the limitations and exceptions for GST delay interest?" }
  ]

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[var(--bg)] text-[var(--color-text)] transition-colors duration-300 relative overflow-hidden">
      
      {/* 1. Sidebar */}
      <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-md flex flex-col justify-between shrink-0 h-full">
        <div className="p-3 flex flex-col gap-3 overflow-y-auto flex-1">
          
          {/* New Chat Button */}
          <button 
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)] py-3 px-4 text-sm font-bold hover:bg-[var(--color-primary)]/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>New Conversation</span>
          </button>

          {/* Search in Chats */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              placeholder="Search chats..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] pl-9 pr-3 py-1.5 text-xs text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
            />
          </div>

          {/* Folders Management */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-2 py-1">
              <span>Folders</span>
              <button 
                onClick={() => setShowNewFolderInput(!showNewFolderInput)}
                className="hover:text-[var(--color-text)]"
              >
                <FolderPlus size={14} />
              </button>
            </div>

            {showNewFolderInput && (
              <div className="flex gap-1.5 p-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)]">
                <input 
                  type="text" 
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 text-xs bg-transparent outline-none text-[var(--color-text)] px-1"
                />
                <button onClick={createFolder} className="text-xs font-bold text-[var(--color-primary)] px-1">Save</button>
              </div>
            )}

            {folders.map(folder => (
              <div key={folder.id} className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text)] px-2 py-1.5 rounded-lg bg-[var(--color-surface)]">
                  <Folder size={14} className="text-[var(--color-primary)]" />
                  <span>{folder.name}</span>
                </div>
                {/* Conversations in Folder */}
                <div className="pl-4 border-l border-[var(--color-border)] ml-3 space-y-0.5">
                  {filteredConversations.filter(c => c.folderId === folder.id).map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`w-full flex items-center justify-between text-left px-2 py-1.5 rounded text-xs transition-colors ${chat.id === activeChatId ? 'bg-[var(--color-surface-2)] text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'}`}
                    >
                      <span className="truncate flex-1">{chat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pinned Conversations */}
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-2 py-1">
              Pinned
            </div>
            {filteredConversations.filter(c => c.pinned).map(chat => (
              <div 
                key={chat.id}
                className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-all ${chat.id === activeChatId ? 'bg-[var(--color-surface-2)] text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'}`}
              >
                <button 
                  onClick={() => setActiveChatId(chat.id)}
                  className="flex-1 text-left truncate flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  <span className="truncate">{chat.title}</span>
                </button>
                <button 
                  onClick={() => togglePinChat(chat.id)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pin size={12} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>

          {/* Active Chats */}
          <div className="space-y-0.5 mt-2">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-2 py-1">
              Conversations
            </div>
            {filteredConversations.filter(c => !c.pinned).map(chat => (
              <div 
                key={chat.id}
                className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-all ${chat.id === activeChatId ? 'bg-[var(--color-surface-2)] text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'}`}
              >
                {editingChatId === chat.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveRenameChat(chat.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveRenameChat(chat.id)}
                    autoFocus
                    className="flex-1 bg-transparent border border-[var(--color-primary)] outline-none px-1 text-xs text-[var(--color-text)]"
                  />
                ) : (
                  <button 
                    onClick={() => setActiveChatId(chat.id)}
                    className="flex-1 text-left truncate flex items-center gap-2"
                  >
                    <MessageSquare size={14} />
                    <span className="truncate">{chat.title}</span>
                  </button>
                )}
                
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => togglePinChat(chat.id)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    <Pin size={12} />
                  </button>
                  <button onClick={() => startRenameChat(chat)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => deleteChat(chat.id)} className="text-[var(--color-text-muted)] hover:text-red-500">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
        
        {/* User context or help info at bottom */}
        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)] flex items-center justify-center">
              <Scale size={14} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--color-text)]">CourtCounsel AI</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">Premium Legal Intelligence</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Chat Area */}
      <main className="flex-1 flex flex-col justify-between h-full bg-[var(--color-bg)]">
        
        {/* Chat Header */}
        <header className="h-14 border-b border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[var(--color-text)]">{currentChat?.title || "New Chat"}</span>
            {currentChat?.pinned && <Pin size={12} fill="currentColor" className="text-[var(--color-primary)]" />}
          </div>
          
          <div className="flex items-center gap-3">
            {currentChat?.messages.length > 0 && (
              <>
                <button 
                  onClick={() => copyToClipboard(JSON.stringify(currentChat.messages))}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded hover:bg-[var(--color-surface)] transition-all flex items-center justify-center"
                  title="Copy conversation"
                >
                  {copySuccess ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
                <button 
                  onClick={() => handleDownloadPDF(currentChat)}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded hover:bg-[var(--color-surface)] transition-all flex items-center justify-center"
                  title="Download / Print PDF"
                >
                  <Download size={16} />
                </button>
              </>
            )}
          </div>
        </header>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {currentChat?.messages.length === 0 ? (
            /* New Chat Suggestion State */
            <div className="max-w-2xl mx-auto py-12 flex flex-col justify-center items-center text-center space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                <Sparkles size={28} className="text-[var(--color-primary)] animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Ask CourtCounsel AI</h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1.5">Your digital chamber for Indian Law guidance. Ask legal queries, explain acts, or drafts.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 w-full pt-4">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.text)}
                    className="p-4 text-left border border-[var(--color-border)] rounded-xl bg-[var(--color-card)]/50 hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-semibold text-[var(--color-text)] mb-1">{prompt.label}</div>
                    <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 group-hover:text-[var(--color-text)] transition-colors">
                      <span>{prompt.text.substring(0, 50)}...</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat message logs */
            <div className="max-w-3xl mx-auto space-y-6">
              {currentChat.messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col gap-2 p-4 rounded-xl border ${msg.role === 'user' ? 'bg-[var(--color-surface-2)]/30 border-transparent max-w-[85%] ml-auto' : 'bg-[var(--color-card)] border-[var(--color-border)] shadow-sm'}`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                    {msg.role === 'user' ? (
                      <span>You</span>
                    ) : (
                      <span className="text-[var(--color-primary)] flex items-center gap-1">
                        <Sparkles size={13} />
                        CourtCounsel AI
                      </span>
                    )}
                  </div>
                  
                  {/* Message Content Rendered as formatted markdown */}
                  <div className="text-sm leading-relaxed text-[var(--color-text)] select-text whitespace-pre-line prose dark:prose-invert">
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-[var(--color-primary)] ml-1 animate-pulse" />
                    )}
                  </div>

                  {/* References & Sources block */}
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                      <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5"> ingesting References & Sources</span>
                      <div className="flex flex-col gap-1">
                        {msg.sources.map((src, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] hover:underline cursor-pointer">
                            <Scale size={11} />
                            <span>{src}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Legal Disclaimer block */}
                  {msg.role === 'assistant' && !msg.isStreaming && (
                    <div className="mt-4 p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/40 flex items-start gap-2.5">
                      <AlertTriangle size={15} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                      <span className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                        <strong>Disclaimer:</strong> This response is informational and should not replace advice from a qualified advocate.
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* Input box */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-md shrink-0">
          <div className="max-w-3xl mx-auto">
            
            {/* Suggested Follow-up Prompts */}
            {currentChat?.messages.length > 0 && !isGenerating && (
              <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 select-none">
                <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider shrink-0 mr-1">Suggested Follow-ups:</span>
                {["What are the exceptions to this rule?", "Can I file an appeal?", "What documents are required?"].map((fol, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(fol)}
                    className="text-xs px-3 py-1 border border-[var(--color-border)] rounded-full bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all shrink-0 cursor-pointer"
                  >
                    {fol}
                  </button>
                ))}
              </div>
            )}

            {/* Main Input Text Field */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex items-center gap-2 border border-[var(--color-border)] rounded-xl p-1.5 bg-[var(--color-surface)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all duration-200"
            >
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isGenerating ? "AI is generating an assessment..." : "Ask CourtCounsel AI anything..."}
                disabled={isGenerating}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] disabled:opacity-50"
              />
              
              {isGenerating ? (
                <button
                  type="button"
                  onClick={() => setIsGenerating(false)}
                  className="p-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                  title="Stop generation"
                >
                  <Square size={14} fill="currentColor" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-lg bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={14} />
                </button>
              )}
            </form>
            
            <div className="text-[10px] text-[var(--color-text-muted)] text-center mt-2">
              CourtCounsel AI is grounded in Indian legal databases. Double check relevant Acts before taking legal action.
            </div>
          </div>
        </div>

      </main>

    </div>
  )
}
