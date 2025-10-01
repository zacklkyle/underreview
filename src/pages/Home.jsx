
import React, { useState, useEffect, useCallback } from 'react';
import { Post } from "@/api/entities";

import HeroSection from '../components/home/HeroSection';
import PostForm from '../components/home/PostForm';
import PostCard from '../components/home/PostCard';
import PostDetailModal from '../components/home/PostDetailModal';
import { Button } from "@/components/ui/button";
import { Filter, MessageSquare, Video } from "lucide-react";

const SPORTS = ['All', 'NFL', 'NBA', 'MLB', 'NHL', 'College Football', 'Soccer'];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const fetchedPosts = await Post.list('-created_date');
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (selectedSport === 'All') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((p) => p.sport === selectedSport));
    }
  }, [selectedSport, posts]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  return (
    <div>
      <HeroSection />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Feed Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">You're the Ref</h2>
            <p className="text-gray-600">Analyze plays, cast your vote, and join the discussion.</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
              {SPORTS.map((sport) =>
              <Button
                key={sport}
                variant={selectedSport === sport ? 'default' : 'ghost'}
                onClick={() => setSelectedSport(sport)}
                className={`rounded-md h-8 px-3 text-sm ${selectedSport === sport ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}>

                  {sport}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Create Post Form */}
        <div className="mb-8">
          <PostForm onPostCreated={loadPosts} />
        </div>

        {/* Posts Feed */}
        {filteredPosts.length === 0 ?
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              The Feed is Quiet
            </h3>
            <p className="text-gray-500">
              Start a new discussion or select a different sport.
            </p>
          </div> :

        <div className="space-y-6">
            {filteredPosts.map((post) =>
          <PostCard
            key={post.id}
            post={post}
            onCommentClick={() => handlePostClick(post)}
            onVote={loadPosts} />

          )}
          </div>
        }
      </div>

      {/* Modals */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)} />

    </div>);

}
