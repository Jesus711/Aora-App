import { Image, ScrollView, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useState } from 'react';
import { images } from '../../constants';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from '../../lib/appwrite';

import { useGlobalContext } from '../../context/GlobalProvider';


const SignIn = () => {

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {setUser, setIsLoggedIn} = useGlobalContext();

  const submit = async () => {

    if(!form.email || !form.password){
      // Error name and message
      Alert.alert("Error", "Please fill in all the fields.")
    }

    setIsSubmitting(true);

    try {
      // Try to create the new user
      await signIn(form.email, form.password);

      // set it to global state
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true)

      Alert.alert("Success", "User signed in successfully");
      
      // If successful, navigate to the home page
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo}
            resizeMode='contain' className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign in to Aora</Text>

          {/* Email Form Field. Keyboard type email-address, allows email autofill */}
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form,
              email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          {/* Password Form Field */}
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form,
              password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Log In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
              <Link href="/sign-up" className="text-lg font-psemibold text-secondary">Sign Up</Link>
          </View>
        </View>



      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn;