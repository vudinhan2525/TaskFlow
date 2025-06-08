export interface INotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  referenceId: string;
  is_read: boolean; // Changed from isRead to is_read to match API response
  createdAt: string;
  updatedAt: string;
}
