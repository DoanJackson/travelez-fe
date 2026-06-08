"use client";

import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
  showAvatar?: boolean;
}

export function MessageBubble({ message, isMe, showAvatar = true }: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full mb-4", isMe ? "justify-end" : "justify-start")}>
      
      {!isMe && (
        <div className="w-8 mr-2 shrink-0 flex flex-col justify-end">
          {showAvatar && (
            <Avatar className="h-8 w-8 border border-slate-100 shadow-sm">
              <AvatarImage src={message.sender?.avatarUrl} />
              <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                {message.sender?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
        isMe ? "bg-pink-500 text-white" : "bg-white text-slate-800 border"
      )}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.files && message.files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.files.map((file, i) => (
              <img key={i} src={file} alt="attachment" className="w-32 h-32 object-cover rounded-md border" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}