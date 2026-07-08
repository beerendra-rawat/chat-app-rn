export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  mediaUrl: string;
  createdAt: number;
  expiresAt: number;
  viewers: string[];
}

export interface UserStories {
  userId: string;
  userName: string;
  userAvatar?: string | null;
  stories: Story[];
  hasUnseen: boolean;
}
