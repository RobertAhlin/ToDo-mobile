// app/[instanceId].tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Pressable, Platform, Switch, KeyboardAvoidingView } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { lightStyles, darkStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

const isWeb = Platform.OS === 'web';

export default function ToDoApp() {
  const { instanceId } = useLocalSearchParams(); // Retrieve the dynamic instanceId
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newTask, setNewTask] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedList, setExpandedList] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null);

  const inputRef = useRef(null);

  // Load theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = isWeb ? localStorage.getItem('theme') : await AsyncStorage.getItem('theme');
        if (savedTheme !== null) setIsDarkMode(savedTheme === 'dark');
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        if (isWeb) {
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        } else {
          await AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };
    saveThemePreference();
  }, [isDarkMode]);

  // Fetch lists from Firestore based on the instanceId
  useEffect(() => {
    const q = query(collection(db, 'lists'), where('instanceId', '==', instanceId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLists(fetchedLists);
    });
    return () => unsubscribe();
  }, [instanceId]);

  // Add a new list
  const addList = async () => {
    if (newListName.trim() !== '') {
      await addDoc(collection(db, 'lists'), { name: newListName, tasks: [], instanceId });
      setNewListName('');
    }
  };

  // Add a new task to a list
  const addTaskToList = async (listId) => {
    if (newTask.trim() !== '') {
      const listRef = doc(db, 'lists', listId);
      const list = lists.find(list => list.id === listId);
      const updatedTasks = [...list.tasks, { id: Date.now().toString(), name: newTask, isDone: false }];
      await updateDoc(listRef, { tasks: updatedTasks });
      setNewTask('');
    }
  };

  // Toggle task done
  const toggleTaskDone = async (listId, taskId) => {
    const listRef = doc(db, 'lists', listId);
    const list = lists.find(list => list.id === listId);
    const updatedTasks = list.tasks.map(task =>
      task.id === taskId ? { ...task, isDone: !task.isDone } : task
    );
    await updateDoc(listRef, { tasks: updatedTasks });
  };

  // Toggle expand/collapse list
  const toggleExpandList = (listId) => {
    setExpandedList(expandedList === listId ? null : listId);
  };

  // Edit a task
  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskText(task.name);
    setTimeout(() => inputRef.current?.focus(), 100); // Focus on the input when editing starts
  };

  const saveEditedTask = async (listId, taskId) => {
    const listRef = doc(db, 'lists', listId);
    const list = lists.find(list => list.id === listId);
    const updatedTasks = list.tasks.map(task =>
      task.id === taskId ? { ...task, name: editedTaskText } : task
    );
    await updateDoc(listRef, { tasks: updatedTasks });
    setEditingTaskId(null);
  };

  // Start task deletion
  const confirmDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
  };

  // Cancel task deletion
  const cancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  const deleteTask = async (listId, taskId) => {
    const listRef = doc(db, 'lists', listId);
    const list = lists.find(list => list.id === listId);
    const updatedTasks = list.tasks.filter(task => task.id !== taskId);
    await updateDoc(listRef, { tasks: updatedTasks });
    setTaskToDelete(null);
  };

  const currentStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={currentStyles.container}>
      {/* Header Section */}
      <View style={currentStyles.header}>
        <Text style={currentStyles.title}>Instance ID: {instanceId}</Text>
        <Switch
          value={isDarkMode}
          onValueChange={(value) => setIsDarkMode(value)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      {/* List and Task Rendering */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={currentStyles.listItem}>
            {/* List Title */}
            <Pressable onPress={() => toggleExpandList(item.id)} style={currentStyles.listButton}>
              <Text style={currentStyles.listName}>{item.name}</Text>
            </Pressable>

            {/* Expand/Collapse Task Section */}
            {expandedList === item.id && (
              <View style={currentStyles.taskContainer}>
                <FlatList
                  data={item.tasks}
                  keyExtractor={(task, index) => index.toString()}
                  renderItem={({ item: task }) => (
                    <View
                      style={[
                        currentStyles.taskRow,
                        taskToDelete === task.id && { backgroundColor: 'red' },
                        editingTaskId === task.id && currentStyles.taskRowEdit
                      ]}
                    >
                      {/* Checkbox Button */}
                      <Pressable
                        onPress={() => toggleTaskDone(item.id, task.id)}
                        style={[
                          currentStyles.checkButton,
                          task.isDone && currentStyles.checkButtonDone
                        ]}
                      >
                        {task.isDone && <AntDesign name="check" size={16} color="white" />}
                      </Pressable>

                      {/* Task Name */}
                      {editingTaskId === task.id ? (
                        <>
                          <TextInput
                            ref={inputRef}
                            value={editedTaskText}
                            onChangeText={setEditedTaskText}
                            style={[currentStyles.taskName, { flex: 1 }, currentStyles.taskNameEdit]}
                          />
                          <Pressable onPress={() => saveEditedTask(item.id, task.id)} style={{ marginLeft: 10 }}>
                            <AntDesign name="check" size={24} color="green" />
                          </Pressable>
                        </>
                      ) : (
                        <>
                          <Text style={[currentStyles.taskName, task.isDone && currentStyles.taskDone]}>
                            {task.name}
                          </Text>
                          <Pressable onPress={() => startEditingTask(task)} style={{ marginLeft: 'auto' }}>
                            <AntDesign name="edit" size={24} color="gray" />
                          </Pressable>
                          <Pressable onPress={() => confirmDeleteTask(task.id)} style={{ marginLeft: 10 }}>
                            <MaterialIcons name="delete" size={24} color="darkred" />
                          </Pressable>
                        </>
                      )}

                      {/* Task Deletion Confirmation */}
                      {taskToDelete === task.id && (
                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                          <Pressable
                            onPress={() => deleteTask(item.id, task.id)}
                            style={{ backgroundColor: 'white', padding: 5, borderRadius: 5, marginRight: 5 }}
                          >
                            <Text style={{ color: 'red' }}>Delete</Text>
                          </Pressable>
                          <Pressable
                            onPress={cancelDeleteTask}
                            style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}
                          >
                            <Text style={{ color: 'black' }}>Cancel</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  )}
                />

                {/* New Task Input */}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                  <View style={currentStyles.newTaskFooterContent}>
                    <TextInput
                      style={currentStyles.newTaskInput}
                      placeholder="Add new task"
                      value={newTask}
                      onChangeText={setNewTask}
                      placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
                    />
                    <Pressable onPress={() => addTaskToList(item.id)} style={currentStyles.newTaskButton}>
                      <Text style={currentStyles.newTaskButtonText}>+</Text>
                    </Pressable>
                  </View>
                </KeyboardAvoidingView>
              </View>
            )}
          </View>
        )}
      />

      {/* Footer: Add New List */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={currentStyles.footer}>
        <View style={currentStyles.footerContent}>
          <TextInput
            style={currentStyles.footerInput}
            placeholder="New List Name"
            value={newListName}
            onChangeText={setNewListName}
            placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
          />
          <Pressable onPress={addList} style={currentStyles.footerButton}>
            <Text style={currentStyles.footerButtonText}>Add List</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
