import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import { getUserPosts, signOut } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '../../components/InfoBox';
import { router } from 'expo-router';

const Profile = () => {

  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user?.$id));

  // Call refetch whenever the query changes
  useEffect(() => {
    refetch();
  }, [])

  const logout = async () => {
    await signOut(); // Deletes the user's session

    // Update state variables in GlobalContext
    setUser(null);
    setIsLoggedIn(false);

    // Replace the current route with /sign-in
    // instead push
    router.replace('/sign-in');
  }


  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar style={"light"} /> 

      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard key={item.title + item.id} video={item} />
        )}
        ListHeaderComponent={() => (
          // Will appear about the list as a header
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <View className="w-full h-8 flex-row justify-end items-center">
              <TouchableOpacity
                className="w-8 h-full justify-center items-center"
                onPress={logout}
              >
                <Image source={icons.logout} 
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

              <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image source={{ uri: user?.avatar }} 
                  className="w-[95%] h-[95%] rounded-lg"
                  resizeMode="cover"
                />
              </View>

              <InfoBox 
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />

              <View className="mt-5 flex-row">
                <InfoBox 
                  title={posts.length || 0}
                  subtitle="Posts"
                  containerStyles="mr-10"
                  titleStyles="text-xl"
                />

                <InfoBox 
                  title="1.2k"
                  subtitle="Followers"
                  titleStyles="text-xl"
                />

              </View>


          </View>
        )}
        // Specifies what happens when the list is empty
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" 
            subtitle="No videos found for this search query"
          />
        )}
      />

    </SafeAreaView>
  )
}

export default Profile;