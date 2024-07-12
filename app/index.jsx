import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Home page or Route: '/'
import { Redirect, router } from 'expo-router'
import { images } from '../constants';
import CustomButton from '../components/CustomButton';


export default function App() {

  return (
    // SafeAreaView: when you have the most outside view that should be a safeareaview
    // Ensures the content is visible on all different devices 
    // Ensures the content will not overlap with the status bar, bottom bar, etc
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        {/* Iphone had min-h-85vh to center all the content */}
        {/* Added custom media query to use h-full when height > 768px */}
        <View className="w-full justify-center items-center tall:h-full min-h-[85vh] px-4">
          <Image 
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain" 
          />

          <Image 
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image 
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration with Aora</Text>
          
          <CustomButton 
            title="Continue with Email" 
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      {/* Shows the phone's status bar, such as internet battery time, notifications, etc */}
      <StatusBar backgroundColor="#161622" style={'light'} />
    </SafeAreaView>
  );
}