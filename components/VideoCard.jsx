import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av'
import { checkSavedVideo, removeSavedVideo, saveVideo } from '../lib/appwrite'
import { useGlobalContext } from '../context/GlobalProvider'
import useAppwrite from '../lib/useAppwrite'

const VideoCard = ({ listRefetch, refresh, video: { title, thumbnail, video, $id: videoID, creator: { username, avatar }} }) => {

    const [play, setPlay] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { user } = useGlobalContext();

    const { data: isSavedVideo, refetch } = useAppwrite(() => checkSavedVideo(user?.$id, videoID))

    const handleSaveVideo = async () => {

        try {

            const response = await saveVideo(user?.$id, videoID);

            if(response === 1){
                Alert.alert("Video has already been saved.")
            }
            else {
                refetch();
                listRefetch?.();
            }
    
        } catch (error) {
            Alert.alert("Error", error.message)
        }

    }

    const handleRemoveSavedVideo = async () => {
        try {
            const response = await removeSavedVideo(user?.$id, videoID)

            refetch();
            listRefetch?.();

        } catch (error) {
            Alert.alert("Error", "Video may have already been removed. Try refreshing")
            //refetch(); Fixes the unsaved error, error pops up trying to unsave an already unsaved video, will refetch saved List after error appears
        }
    }

    // Has savedVideo list to refetch when the home page refreshes to update if any saved videos were removed from the bookmark tab
    useEffect(() => {
        refetch();
    }, [refresh])



    return (
        <View className="flex-col items-center px-4 mb-14">
            <View className="flex-row gap-3 items-start relative">

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
                <TouchableOpacity className="pt-2" onPress={() => setShowMenu(!showMenu)}>
                    <Image source={icons.menu} className="w-3 h-3" 
                        resizeMode='contain'
                    />
                </TouchableOpacity>


                {showMenu && (
                    <View className="z-10 p-4 absolute top-6 right-0 w-[150px] justify-center items-center bg-slate-600 rounded-xl">
                        
                        {isSavedVideo ? (
                            <TouchableOpacity className="flex-row justify-center gap-2 w-full"
                                onPress={handleRemoveSavedVideo}
                            >
                                <Image source={icons.bookmark} className="w-5 h-5" resizeMode='contain' />
                                <Text className="text-white font-psemibold text-sm">Unsave Video</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity className="flex-row justify-center gap-2 w-full"
                                onPress={handleSaveVideo}
                            >
                                <Image source={icons.bookmark} className="w-5 h-5" resizeMode='contain' />
                                <Text className="text-white font-psemibold text-sm">Save Video</Text>
                            </TouchableOpacity>
                        )}

                    </View>                
                )}



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