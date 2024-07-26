import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import { StatusBar } from 'expo-status-bar';
import VideoCard from '../../components/VideoCard';
import { useState, useEffect } from 'react';
import { getUserSavedVideos } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import { images } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';


const Bookmark = () => {

  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserSavedVideos(user?.$id));
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    refetch();
  }, [])

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
          <VideoCard key={item.title + item.id} video={item} listRefetch={refetch} />
        )}
        ListHeaderComponent={() => (
          // Will appear about the list as a header
          <View className="my-6 px-4">
            <Text className="text-2xl text-white font-psemibold">Saved Videos</Text>
              
              <View className="mt-6 mb-8">
                <SearchInput placeholder="Search your saved videos" refetch={refetch} />
              </View>
          </View>
        )}
        // Specifies what happens when the list is empty
        ListEmptyComponent={() => (
          <View className="justify-center items-center">
            <Image source={images.empty} 
              className="w-[270px] h-[215px]"
              resizeMode='contain'
            />
            <Text className="text-xl text-center font-psemibold text-white mt-2">No Saved Videos Found</Text>
            <Text className="font-pmedium text-sm text-gray-100">Go to the Home Tab to save your first video</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

    </SafeAreaView>
  )
}

export default Bookmark;