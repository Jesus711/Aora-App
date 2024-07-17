// Creating a custom webhook useAppwrite that passes in a function to call 
// to retrieve specific data from Appwrite
import { Alert } from "react-native";
import { useState, useEffect } from "react";

const useAppwrite = (fn) => {
    
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Cannot use async directly in the useEffect callback function
  const fetchData = async () => {
    try {
        const response = await fn();

        setData(response);
    } catch (error) {
        Alert.alert("Error", error.message);
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const refetch = () => fetchData();

  return { data, isLoading, refetch }; // returns data in an object
}

export default useAppwrite;