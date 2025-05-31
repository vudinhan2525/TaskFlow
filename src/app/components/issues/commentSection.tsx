import React, { useState } from "react";
import { useComments, useCreateComment } from "@libs/hooks/useComment";
import { IComment } from "@libs/types/comment";

interface CommentSectionProps {
  issueId: string;
  currentUserId: string;
  currentUserName?: string;
}

interface CommentItemProps {
  comment: IComment;
  currentUserId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const getUserInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  const getUserName = (userId: string) => {
    return `User ${userId.slice(-4)}`;
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="flex space-x-3 py-4">
      {/* User Avatar */}
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
          {getUserInitials(comment.user_id)}
        </div>
      </div>

      {/* Comment Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">
            {getUserName(comment.user_id)}
          </span>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(comment.created_at)}
          </span>
          {comment.created_at !== comment.updated_at && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px] w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Add a comment..."
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveEdit}
                className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="text-sm whitespace-pre-wrap text-gray-900">
              {comment.content}
            </div>
          </div>
        )}

        {/* Comment Actions */}
        {!isEditing && (
          <div className="mt-2 flex items-center space-x-4">
            <button className="text-xs font-medium text-gray-500 hover:text-blue-600">
              Reply
            </button>
            {currentUserId === comment.user_id && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-medium text-gray-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button className="text-xs font-medium text-gray-500 hover:text-red-600">
                  Delete
                </button>
              </>
            )}
            <button className="text-xs font-medium text-gray-500 hover:text-blue-600">
              <svg
                className="mr-1 inline h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Like
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({
  issueId,
  currentUserId,
  currentUserName = "Current User",
}) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { comments: commentsList, isLoading } = useComments({
    issue_id: issueId,
    page: 1,
    limit: 50,
  });

  const { createComment, isLoading: isCreating } = useCreateComment({
    issue_id: issueId,
    user_id: currentUserId,
    content: newComment,
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    createComment();
    setNewComment("");
    setIsExpanded(false);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setNewComment("");
    setIsExpanded(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({commentsList?.length || 0})
        </h3>
      </div>

      {/* Add Comment Form */}
      <div className="mb-6">
        <div className="flex space-x-3">
          {/* Current User Avatar */}
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-medium text-white">
              {getUserInitials(currentUserName)}
            </div>
          </div>

          {/* Comment Input */}
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onFocus={handleFocus}
                placeholder="Add a comment..."
                className={`w-full resize-none rounded-md border border-gray-300 p-3 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                  isExpanded ? "min-h-[100px]" : "min-h-[40px]"
                }`}
              />

              {/* Formatting Toolbar */}
              {isExpanded && (
                <div className="rounded-b-md border-t border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="rounded p-1 text-gray-400 hover:text-gray-600">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h14M5 12l4-4m-4 4l4 4"
                          />
                        </svg>
                      </button>
                      <button className="rounded p-1 text-sm font-bold text-gray-400 hover:text-gray-600">
                        B
                      </button>
                      <button className="rounded p-1 text-sm text-gray-400 italic hover:text-gray-600">
                        I
                      </button>
                      <button className="rounded p-1 text-gray-400 hover:text-gray-600">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </button>
                      <button className="rounded p-1 text-gray-400 hover:text-gray-600">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 000-2.828z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCancel}
                        className="rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || isCreating}
                        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isCreating ? "Commenting..." : "Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-500">
              Loading comments...
            </span>
          </div>
        ) : commentsList && commentsList.length > 0 ? (
          <>
            {commentsList.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
              />
            ))}
          </>
        ) : (
          <div className="py-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.319-.34l-4.772 1.18a1 1 0 01-1.24-1.24l1.18-4.772A8 8 0 1121 12z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No comments yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to comment on this issue.
            </p>
          </div>
        )}
      </div>

      {/* Load More Comments */}
      {commentsList && commentsList.length >= 50 && (
        <div className="mt-6 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Load more comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
