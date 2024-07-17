import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '../../context/GlobalProvider';

const Home = () => {

  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  // retrieves the data and renames it to posts using the getAllPosts
  // retrieve the refetch function
  const { data: posts, refetch } = useAppwrite(getAllPosts);

  const { data: latestsPosts } = useAppwrite(getLatestPosts);

  const onRefresh = async () => {
    // On Refresh set the state refreshing to true
    // Call and wait until the data is refetched
    setRefreshing(true);
    await refetch();

    // When data has been refetched, setRefressing to false
    setRefreshing(false);
  }


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
          <VideoCard key={item.title + item.id} video={item} />
        )}
        ListHeaderComponent={() => (
          // Will appear about the list as a header
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm, text-gray-100">Welcome Back,</Text>
                <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
              </View>

              <View className="mt-1.5">
                <Image 
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="font-pregular text-gray-100 text-lg">Latest Videos</Text>

              <Trending posts={latestsPosts}  />
              {/* ?? meaning if the posts do not exists return an empty array */}
            </View>
          </View>
        )}
        // Specifies what happens when the list is empty
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" 
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

    </SafeAreaView>
  )
}

export default Home;