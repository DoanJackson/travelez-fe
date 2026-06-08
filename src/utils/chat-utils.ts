import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Conversation } from '@/types/chat';

export function formatMessageTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
  } catch {
    return '';
  }
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

export function getLastMessagePreview(conv: Conversation, currentUserId: string | number): string {
  const sender = conv.lastMessageSender;
  const content = conv.lastMessageContent;
  const mediaCount = conv.lastMessageMediaCount || 0;

  const isMe = sender && String(sender.id) === String(currentUserId);
  const isGroup = conv.isGroup;

  if (!content && mediaCount === 0) return 'Chưa có tin nhắn';

  if (content) {
    if (isGroup || !sender) return content;
    return isMe ? `Bạn: ${content}` : `${sender.fullName}: ${content}`;
  }

  const mediaSuffix = `đã gửi ${mediaCount} file đính kèm`;
  if (isGroup || !sender) return `Đã gửi ${mediaCount} file đính kèm`;
  return isMe ? `Bạn ${mediaSuffix}` : `${sender.fullName} ${mediaSuffix}`;
}