import { View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { icons } from '../constants';
import { router, usePathname } from 'expo-router';
import { useState } from 'react';


const SearchInput = ({ initialQuery, placeholder, refetch }) => {

  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery || "")

  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 
      bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput 
            className="text-base mt-0.5 text-white flex-1 font-pregular" 
            value={query}
            placeholder={placeholder}
            placeholderTextColor="#CDCDE0"
            onChangeText={(e) => setQuery(e)}
        />

        <TouchableOpacity
          onPress={() => {
            // If user presses search and query is empty raise error / alert
            if(!query){
              return Alert.alert("Missing query", "Please input something to search results across database")
            }

            // if user is alread in the search page/view/screen
            // Only update the parameters
            if(pathname.startsWith("/search")){
              router.setParams({ query });
              
            } else if (pathname.startsWith("/bookmark")) {
              router.push({pathname: `/search/${query}`, params: {query: query, type: "saved", refetchList: refetch} })
            } else {
              // else if user searched something outside of the search screen/view, route them to the 
              // search screen with their search in the query
              router.push({pathname: `/search/${query}`, params: {query: query, type: "home"} })
            }

          }}
        >
            <Image
                source={icons.search}
                className="w-5 h-5"
                resizeMode="contain"
            />
        </TouchableOpacity>
        
    </View>
  )
}

export default SearchInput;