import { useTheme } from '@/components/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Song } from '@/types';
import { Music, Plus, TrendingUp } from 'lucide-react';
import React from 'react';
import SongCard from './SongCard';
import TrendingSong from './TrendingSong';


interface HomePageProps {
  songs: Song[];
  trendingSongs: Song[];
  onSongPlay: (song: Song) => void;
  formatNumber: (num: number) => string;
  onAddToPlaylist: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  imageUrls: Record<string, string>;
  onLoadMore: () => void;
  hasMoreSongs: boolean;
  recentlyPlayedSongs: Song[];
  loading?: boolean;
}


const HomePage: React.FC<HomePageProps> = ({ songs, trendingSongs, onSongPlay, formatNumber, onAddToPlaylist, onAddToQueue, imageUrls, onLoadMore, hasMoreSongs, recentlyPlayedSongs, loading = false }) => {
  const { isDarkMode } = useTheme();

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Good night';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  const user = getUserData()

  // Show loading state if no songs are loaded yet
  if (songs.length === 0 && !loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music size={32} className="text-white" />
          </div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No music available</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'} backdrop-blur-md z-10 px-4 py-4`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>What do you want to listen to?</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Music size={20} className="text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Trending Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingUp className="mr-2 text-purple-400" size={20} />
              Trending Now
            </h2>
            <button className="text-purple-400 text-sm font-medium">See all</button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {trendingSongs.slice(0, 15).map((song) => (
              <TrendingSong 
                key={song.id}
                song={{ ...song, image: imageUrls[song.id] || '' }}
                onPlay={onSongPlay}
                formatNumber={formatNumber}
                cachedImageUrl={imageUrls[song.id]}
              />
            ))}
          </div>
        </div>

{recentlyPlayedSongs.length > 0 && (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4 px-2">Recently Played</h2>
    <div className="overflow-x-auto">
      <div className="flex gap-6 px-2 py-4">
        {Array.from({ length: Math.ceil(recentlyPlayedSongs.length / 3) }).map((_, columnIndex) => {
          const start = columnIndex * 3;
          const end = start + 3;
          const group = recentlyPlayedSongs.slice(start, end);

          return (
            <div key={columnIndex} className="min-w-[260px] flex flex-col gap-5">
              {group.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all group cursor-pointer"
                  onClick={() => onSongPlay({ ...song, image: imageUrls[song.id] || '' })}
                >
                  <img
                    src={imageUrls[song.id] || '/placeholder.jpg'}
                    alt={song.name}
                    className="w-16 h-16 rounded-lg object-cover shadow-md"
                  />
                  <div className="flex flex-col ml-4">
                    <div className="text-base font-semibold text-white">{song.name}</div>
                    <div className="text-sm text-neutral-300">{song.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}


        {/* Recommendations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Made for you</h2>
            <button className="text-purple-400 text-sm font-medium">See all</button>
          </div>
          <div className="space-y-3">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={{ ...song, image: imageUrls[song.id] || '' }}
                onPlay={onSongPlay}
                formatNumber={formatNumber}
                onAddToPlaylist={onAddToPlaylist}
                onAddToQueue={onAddToQueue}
                cachedImageUrl={imageUrls[song.id]}
              />
            ))}
          </div>
          
          {/*Load More Button*/}
          {hasMoreSongs && (
  <div className="flex justify-center mt-6">
    <button
      onClick={onLoadMore}
      className={`flex items-center space-x-2 px-6 py-3 ${
        isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'
      } border rounded-full transition-colors`}
    >
      <Plus size={18} className="text-purple-400" />
      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Load More</span>
    </button>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default HomePage;