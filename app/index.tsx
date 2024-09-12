import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Pressable, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { db } from './firebaseConfig';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { lightStyles, darkStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

export default function ToDoApp() {
  const [lists, setLists] = useState([]);
  const [expandedList, setExpandedList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newTask, setNewTask] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        if (isWeb) {
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme !== null) setIsDarkMode(savedTheme === 'dark');
        } else {
          const savedTheme = await AsyncStorage.getItem('theme');
          if (savedTheme !== null) setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, []);

  // Save theme preference
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        if (isWeb) {
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        } else {
          await AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
      } catch (error) {
        console.log('Error saving theme preference:', error);
      }
    };
    saveThemePreference();
  }, [isDarkMode]);

  // Fetch lists from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'lists'), (snapshot) => {
      const fetchedLists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLists(fetchedLists);
    });
    return () => unsubscribe();
  }, []);

  // Add a new list
  const addList = async () => {
    if (newListName.trim() !== '') {
      await addDoc(collection(db, 'lists'), { name: newListName, tasks: [] });
      setNewListName('');
    }
  };

  // Add a new task
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
    const updatedTasks = list.tasks.map(task => task.id === taskId ? { ...task, isDone: !task.isDone } : task);
    await updateDoc(listRef, { tasks: updatedTasks });
  };

  // Toggle expand/collapse a list
  const toggleExpandList = (listId) => {
    setExpandedList(expandedList === listId ? null : listId);
  };

  // Edit a task
  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskText(task.name);
  };

  const saveEditedTask = async (listId, taskId) => {
    const listRef = doc(db, 'lists', listId);
    const list = lists.find(list => list.id === listId);
    const updatedTasks = list.tasks.map(task => task.id === taskId ? { ...task, name: editedTaskText } : task);
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
      <View style={currentStyles.header}>
        <Text style={currentStyles.title}>ToDo</Text>
        <Switch
          value={isDarkMode}
          onValueChange={(value) => setIsDarkMode(value)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={currentStyles.listItem}>
            <Pressable onPress={() => toggleExpandList(item.id)} style={currentStyles.listButton}>
              <Text style={currentStyles.listName}>{item.name}</Text>
            </Pressable>

            {expandedList === item.id && (
              <View style={currentStyles.taskContainer}>
                <FlatList
                  data={item.tasks.sort((a, b) => a.isDone - b.isDone)}
                  keyExtractor={(task) => task.id}
                  renderItem={({ item: task }) => (
                    <View
                      style={[
                        currentStyles.taskRow,
                        taskToDelete === task.id && { backgroundColor: 'red' },
                      ]}
                    >
                      {editingTaskId === task.id ? (
                        <>
                          <TextInput
                            value={editedTaskText}
                            onChangeText={setEditedTaskText}
                            style={[currentStyles.taskName, { flex: 1 }]}
                          />
                          <Pressable onPress={() => saveEditedTask(item.id, task.id)} style={{ marginLeft: 10 }}>
                            <AntDesign name="check" size={24} color="green" />
                          </Pressable>
                        </>
                      ) : (
                        <>
                          <Pressable
                            onPress={() => toggleTaskDone(item.id, task.id)}
                            style={[
                              currentStyles.checkButton,
                              task.isDone && currentStyles.checkButtonDone,
                            ]}
                          >
                            {task.isDone && <AntDesign name="check" size={16} color="white" />}
                          </Pressable>
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

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={currentStyles.newTaskFooter}>
                  <View style={currentStyles.newTaskFooterContent}>
                    <TextInput
                      style={currentStyles.newTaskInput}
                      placeholder="New task"
                      placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
                      value={newTask}
                      onChangeText={setNewTask}
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

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={currentStyles.footer}>
        <View style={currentStyles.footerContent}>
          <TextInput
            style={currentStyles.footerInput}
            placeholder="New list name"
            placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
            value={newListName}
            onChangeText={setNewListName}
          />
          <Pressable onPress={addList} style={currentStyles.footerButton}>
            <Text style={currentStyles.footerButtonText}>Add List</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
