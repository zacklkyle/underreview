import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Post } from "@/api/entities";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post, onCommentClick, onVote }) {
  const handleVote = async (voteType) => {
    try {
      if (voteType === 'good') {
        await Post.update(post.id, { good_calls: (post.good_calls || 0) + 1 });
      } else if (voteType === 'bad') {
        await Post.update(post.id, { bad_calls: (post.bad_calls || 0) + 1 });
      }
      onVote(); // Refresh posts list
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const sportColors = {
    NFL: "bg-blue-600",
    NBA: "bg-orange-600",
    MLB: "bg-blue-700",
    NHL: "bg-gray-800",
    "College Football": "bg-purple-700",
    "Soccer": "bg-green-600"
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-orange-200 text-orange-700">
            {post.user_name?.[0]?.toUpperCase() || 'R'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold">{post.user_name}</div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
          </div>
        </div>
        <Badge className={`${sportColors[post.sport]} text-white border-0`}>{post.sport}</Badge>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        {post.title && <h3 className="font-bold text-lg mb-2">{post.title}</h3>}
        
        {post.post_type === 'text' && (
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        )}

        {post.post_type === 'image' && post.media_url && (
          <img src={post.media_url} alt={post.title || 'Post image'} className="rounded-lg max-h-[400px] w-full object-contain bg-gray-100" />
        )}
        
        {post.post_type === 'video' && post.media_url && (
          <video src={post.media_url} controls className="rounded-lg w-full bg-black" />
        )}
      </CardContent>

      <CardFooter className="p-2 bg-gray-50 border-t flex items-center justify-between">
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleVote('good')} className="flex items-center gap-2 hover:bg-green-100 hover:text-green-700">
            <ThumbsUp className="w-4 h-4" /> Good Call <span className="text-xs font-bold">({post.good_calls || 0})</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleVote('bad')} className="flex items-center gap-2 hover:bg-red-100 hover:text-red-700">
            <ThumbsDown className="w-4 h-4" /> Bad Call <span className="text-xs font-bold">({post.bad_calls || 0})</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={onCommentClick} className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Comments
        </Button>
      </CardFooter>
    </Card>
  );
}