import { View, Text, FlatList, Image } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { searchPosts, searchSavedPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { images } from '../../constants';

const Search = () => {

  const { user } = useGlobalContext();
  const { query, type } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => handleSearch(type, user?.$id, query));

  const handleSearch = async (type, userID, query) => {
    if( type === "saved" ) {
      return searchSavedPosts(userID, query)
    } else {
      return searchPosts(query)
    }
  }

  // Call refetch whenever the query changes
  useEffect(() => {
    refetch();
  }, [query])


  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Added the status bar due to Safeareview h-full overwritting the status bar settins in the index.js file un app/ */}
      <StatusBar style={"light"} /> 

      {/* Everything wrapped in a flatlist instead of a scrollview due to scrollview only allowing vert or horizontal
      cannot handle/support both */}
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard key={item.title + item.id} video={item} listRefetch={refetch} />
        )}
        ListHeaderComponent={() => (
          // Will appear about the list as a header
          <View className="my-6 px-4">
              <Text className="font-pmedium text-sm, text-gray-100">Search Results</Text>
              <Text className="text-2xl font-psemibold text-white">{query}</Text>
              
              <View className="mt-6 mb-8">
                <SearchInput placeholder="Search for a video topic" initialQuery={query} />
              </View>
          </View>
        )}
        // Specifies what happens when the list is empty
        ListEmptyComponent={() => 
          ( type === "saved" ? (
              <View className="justify-center items-center">
                <Image source={images.empty} 
                  className="w-[270px] h-[215px]"
                  resizeMode='contain'
                />
                <Text className="text-xl text-center font-psemibold text-white mt-2">No Saved Videos Found</Text>
                <Text className="font-pmedium text-sm text-gray-100">No video titled '{query}' found</Text>
            </View>
          ) :
            <EmptyState title="No Videos Found" 
              subtitle="No videos found for this search query"
            />
        )}
      />

    </SafeAreaView>
  )
}

export default Search;