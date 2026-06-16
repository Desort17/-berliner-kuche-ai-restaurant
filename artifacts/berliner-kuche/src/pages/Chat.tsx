import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useSendMessage, useGetMenu } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SendHorizontal, UtensilsCrossed, Globe2 } from "lucide-react";
import type { ChatMessage } from "@workspace/api-client-react";

export default function Chat() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"EN" | "DE">("EN");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Willkommen in der Berliner Küche. Welcome. I am your digital concierge. How can I assist you tonight? Whether you're looking for our seasonal specials, wine pairings, or allergen information, I am here to guide you.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendMessage();
  const { data: menuItems, isLoading: isMenuLoading } = useGetMenu();

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const history = [...messages];
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    sendMessageMutation.mutate(
      { data: { message: text, history } },
      {
        onSuccess: (response) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: response.reply },
          ]);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "I apologize, but I am having trouble connecting to the kitchen. Please try again.",
          });
        },
      }
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleChipClick = (text: string) => {
    setInput(text);
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessageMutation.isPending]);

  // Menu formatting helper
  const renderMenuPanel = () => {
    if (isMenuLoading) return <div className="text-muted-foreground animate-pulse">Loading menu...</div>;
    if (!menuItems || menuItems.length === 0) return null;

    const categories = Array.from(new Set(menuItems.map((m) => m.category)));

    return (
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar snap-x" data-testid="menu-panel">
        {menuItems.map((item) => (
          <Card key={item.id} className="min-w-[280px] max-w-[280px] flex-shrink-0 snap-start bg-card border-card-border shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.nameEn}</p>
                </div>
                <span className="font-medium text-primary">€{item.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 mb-3 line-clamp-2" title={item.description}>{item.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-normal text-xs">{item.category}</Badge>
                {item.allergens?.map((allergen) => (
                  <Badge key={allergen} variant="outline" className="border-muted-border text-muted-foreground font-normal text-xs">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const chips = [
    "Show menu",
    "Vegetarian options",
    "Allergen info",
    "Today's specials",
    "Make a recommendation",
  ];

  const showMenuPanel = messages.some(
    (m) => m.role === "user" && m.content.toLowerCase().includes("menu")
  ) || messages.some((m) => m.role === "assistant" && m.content.toLowerCase().includes("here is our menu"));

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Berliner Küche</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Est. 2024</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLanguage(l => l === "EN" ? "DE" : "EN")}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          data-testid="button-toggle-lang"
        >
          <Globe2 className="w-4 h-4 mr-2" />
          {language}
        </Button>
      </header>

      {/* Main Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div 
                key={i} 
                className={`flex gap-4 animate-message ${isUser ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.role}-${i}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <span className="text-xs font-bold text-primary">BK</span>
                  </div>
                )}
                
                <div 
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm leading-relaxed ${
                    isUser 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-card text-card-foreground border border-border rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}
          
          {sendMessageMutation.isPending && (
            <div className="flex gap-4 animate-message justify-start">
              <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <span className="text-xs font-bold text-primary">BK</span>
              </div>
              <div className="max-w-[85%] rounded-2xl px-5 py-4 shadow-sm bg-card text-card-foreground border border-border rounded-tl-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse-opacity" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse-opacity" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse-opacity" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Inject Menu Panel if requested */}
          {showMenuPanel && (
            <div className="animate-message mt-6 mb-4">
               {renderMenuPanel()}
            </div>
          )}
          
          <div className="h-4" /> {/* Spacer */}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none bg-background border-t border-border p-4 md:p-6 pb-6 md:pb-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          
          {/* Quick Actions */}
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-2 w-max px-1">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="px-4 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors border border-transparent hover:border-border"
                  data-testid={`chip-${chip.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Input Form */}
          <div className="relative flex items-end gap-2 bg-card border border-input rounded-xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring transition-shadow">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the menu, recommendations, or allergens..."
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 flex-1 min-h-[44px] text-base resize-none"
              data-testid="input-chat"
            />
            <Button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || sendMessageMutation.isPending}
              size="icon"
              className="h-11 w-11 rounded-lg shrink-0"
              data-testid="button-send"
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-1">
            Our digital concierge is knowledgeable, but for severe allergies, please confirm with staff.
          </p>
        </div>
      </div>
    </div>
  );
}
