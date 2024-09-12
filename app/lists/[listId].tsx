import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ListDetail() {
  const { listId } = useLocalSearchParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Function to add a task
  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now().toString(), name: newTask, isDone: false }]);
      setNewTask('');
    }
  };

  // Function to mark task as done
  const markTaskDone = (taskId) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, isDone: !task.isDone } : task));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks in List {listId}</Text>

      {/* Input to add new task */}
      <TextInput
        style={styles.input}
        placeholder="New task"
        value={newTask}
        onChangeText={setNewTask}
      />
      <Button title="Add Task" onPress={addTask} />

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => markTaskDone(item.id)}>
            <View style={styles.taskItem}>
              <Text style={[styles.taskName, item.isDone && styles.taskDone]}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskName: {
    fontSize: 18,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: 'grey',
  },
});
