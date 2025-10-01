import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Send } from "lucide-react";
import { Comment } from "@/api/entities";
import { User } from "@/api/entities";
import { format } from "date-fns";

export default function PostDetailModal({ post, isOpen, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const loadComments = useCallback(async () => {
    if (!post) return;
    try {
      const fetchedComments = await Comment.filter({ post_id: post.id }, '-created_date');
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }, [post]);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) { console.log("User not logged in"); }
    };
    if (isOpen) {
      loadUser();
      loadComments();
    }
  }, [isOpen, loadComments]);


  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await Comment.create({
        post_id: post.id,
        content: newComment,
        user_name: currentUser?.full_name || 'Anonymous'
      });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (comment) => {
    try {
      await Comment.update(comment.id, {
        likes: (comment.likes || 0) + 1
      });
      loadComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  if (!post) return null;

  const sportColors = {
    NFL: "bg-blue-600",
    NBA: "bg-orange-600",
    MLB: "bg-blue-700",
    NHL: "bg-gray-800",
    "College Football": "bg-purple-700",
    "Soccer": "bg-green-600"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0">
          {post.post_type === 'video' ? (
            <video src={post.media_url} controls className="w-full rounded-t-lg bg-black" />
          ) : post.post_type === 'image' ? (
            <img src={post.media_url} alt={post.title || ''} className="w-full max-h-96 object-contain rounded-t-lg bg-gray-100" />
          ) : null}
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
            <Badge className={`${sportColors[post.sport]} text-white border-0 mb-2`}>{post.sport}</Badge>
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-6">{post.content}</p>

            <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Discussion ({comments.length})
                </h3>
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What's your call? Share your thoughts..."
                    rows={2}
                    className="mb-3"
                    />
                    <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="bg-orange-500 hover:bg-orange-600">
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                    </Button>
                    </div>
                </form>

                <div className="space-y-4">
                    {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-orange-200 text-orange-700 text-xs">
                            {comment.user_name?.[0]?.toUpperCase() || 'A'}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.user_name || 'Anonymous'}</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-1">{comment.content}</p>
                        <button onClick={() => handleLikeComment(comment)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-600">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comment.likes || 0}</span>
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}