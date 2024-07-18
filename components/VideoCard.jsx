import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av'

const VideoCard = ({ video: { title, thumbnail, video, creator: { username, avatar }} }) => {

    const [play, setPlay] = useState(false);


    return (
        <View className="flex-col items-center px-4 mb-14">
            <View className="flex-row gap-3 items-start">

                {/* User's Avatar image/initials, video title, and username*/}
                <View className="justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                        <Image source={{ uri: avatar}} 
                            className="w-full h-full rounded-lg"
                            resizeMode="contain"
                        />
                    </View>

                    <View className="justify-center flex-1 ml-3 gap-y-1">
                        <Text className="text-white font-psemibold text-sm"
                         numberOfLines={1}>{title}</Text>

                         <Text className="text-gray-100 font-pregular text-xs"
                         numberOfLines={1}>{username}</Text>
                    </View>
                </View>
                
                {/* 3 dot menu */}
                <View className="pt-2">
                    <Image source={icons.menu} className="w-5 h-5" 
                        resizeMode='contain'
                    />
                </View>
            </View>

            {play ? (
                <Video
                // Vimeo videos given in the dummy data are not working. It may be due not being able to access the video
                // or since the url do not point to the video directly with the extension it does not work.
                // May need to create / get an access token and fetch the video url directly
                source={{ uri: video }} // item.video
                className="w-full h-60 rounded-xl mt-3 bg-white/10"
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay
                onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                    setPlay(false);
                    }
                }}
                />
            ) : (
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                    className="w-full h-60 rounded-xl mt-3 relative justify-center 
                    items-center"
                    
                >
                    
                    {/* If source is a url, must use uri: (url) else local image use normal pathing */}
                    <Image source={{ uri:thumbnail }}
                        className="w-full h-full rounded-xl mt-3"
                        resizeMode='cover'
                    />
                    <Image source={icons.play} 
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}

        </View>
    )
}
export default VideoCard