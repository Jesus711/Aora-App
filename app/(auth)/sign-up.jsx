import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useState } from 'react';
import { images } from '../../constants';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';

import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {setUser, setIsLoggedIn} = useGlobalContext();

  const submit = async () => {

    if(form.username === "" || form.email === "" || form.password === ""){
      // Error name and message
      Alert.alert("Error", "Please fill in all the fields.")
    }

    setIsSubmitting(true);

    try {
      // Try to create the new user
      const result = await createUser(form.email, form.password, form.username);

      // Set it to global state
      setUser(result);
      setIsLoggedIn(true);
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

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign up to Aora</Text>

          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form,
              username: e })}
            otherStyles="mt-7"
            placeholder="Your unique username"
          />

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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">Already have an account?</Text>
              <Link href="/sign-in" className="text-lg font-psemibold text-secondary">Login</Link>
          </View>
        </View>



      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp;