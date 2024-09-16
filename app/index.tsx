// app/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function HomeScreen() {
  const [newInstanceName, setNewInstanceName] = useState('');
  const [joinInstanceCode, setJoinInstanceCode] = useState('');
  const [userInstances, setUserInstances] = useState([]);
  const userId = "currentUserId"; // Replace with actual userId from authentication
  const router = useRouter();

  // Fetch instances that the user created or joined
  useEffect(() => {
    const fetchUserInstances = async () => {
      const userDocRef = doc(db, 'users', userId);
      const instancesSnapshot = await getDocs(collection(userDocRef, 'instances'));
      const instances = instancesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserInstances(instances);
    };
    fetchUserInstances();
  }, []);

  // Handle creating a new instance
  const createInstance = async () => {
    if (newInstanceName.trim() === '') return;

    try {
      const newInstanceId = Date.now().toString(); // Generate a unique instance ID
      const newInstanceRef = doc(collection(db, 'instances'), newInstanceId);
      await setDoc(newInstanceRef, {
        name: newInstanceName,
        createdAt: new Date(),
        userId,
      });

      const userDocRef = doc(db, 'users', userId);
      await setDoc(doc(collection(userDocRef, 'instances'), newInstanceId), {
        instanceName: newInstanceName,
        instanceId: newInstanceId,
      });

      router.push(`/${newInstanceId}`); // Navigate to the new instance
    } catch (error) {
      console.error('Error creating instance:', error);
    }
  };

  // Handle joining an existing instance
  const joinInstance = async () => {
    if (joinInstanceCode.trim() === '') return;

    try {
      const instanceRef = doc(db, 'instances', joinInstanceCode);
      const docSnap = await getDocs(instanceRef);

      if (!docSnap.exists()) {
        alert('Instance does not exist!');
        return;
      }

      const userDocRef = doc(db, 'users', userId);
      await setDoc(doc(collection(userDocRef, 'instances'), joinInstanceCode), {
        instanceName: docSnap.data().name,
        instanceId: joinInstanceCode,
      });

      router.push(`/${joinInstanceCode}`);
    } catch (error) {
      console.error('Error joining instance:', error);
    }
  };

  // Handle selecting an instance
  const handleSelectInstance = (instanceId) => {
    router.push(`/${instanceId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Instance</Text>
      <TextInput
        style={styles.input}
        value={newInstanceName}
        onChangeText={setNewInstanceName}
        placeholder="Enter instance name"
      />
      <Button title="Create Instance" onPress={createInstance} />

      <Text style={styles.title}>Join an Existing Instance</Text>
      <TextInput
        style={styles.input}
        value={joinInstanceCode}
        onChangeText={setJoinInstanceCode}
        placeholder="Enter instance code"
      />
      <Button title="Join Instance" onPress={joinInstance} />

      <Text style={styles.title}>Your Instances</Text>
      <FlatList
        data={userInstances}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSelectInstance(item.id)} style={styles.instanceButton}>
            <Text style={styles.instanceText}>{item.instanceName}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  instanceButton: {
    padding: 15,
    backgroundColor: '#eee',
    marginVertical: 5,
    borderRadius: 5,
  },
  instanceText: {
    fontSize: 16,
  },
});
