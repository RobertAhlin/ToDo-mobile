//app/styles.ts

import { StyleSheet } from 'react-native';

export const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  listItem: {
    marginBottom: 10,
  },
  listButton: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  taskContainer: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#e0e0e0', // Default background for tasks
    padding: 10,
    borderRadius: 5,
  },
  taskRowEdit: {
    backgroundColor: 'white', // Background when in edit mode
  },
  taskName: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black', // Default text color
  },
  taskNameEdit: {
    color: 'black', // Text color when in edit mode
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonDone: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  footerInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    color: 'black',
  },
  footerButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  footerButtonText: {
    color: 'white',
  },
  newTaskFooter: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  newTaskFooterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    // Add flex to make sure the input and button align correctly
    flex: 1,
  },
  
  newTaskInput: {
    flex: 1, // Ensure the input takes up available space
    borderWidth: 1,
    padding: 10,
    marginRight: 10, // Add some margin to the right of the input
    borderRadius: 5,
    borderColor: '#ccc',
    color: 'black',
  },
  
  newTaskButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: 40, // Set width for the button
    alignItems: 'center',
  },
  newTaskButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  listItem: {
    marginBottom: 10,
  },
  listButton: {
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 5,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  taskContainer: {
    padding: 10,
    borderColor: '#777',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#1a1a1a', // Default background for tasks in dark mode
    padding: 10,
    borderRadius: 5,
  },
  taskRowEdit: {
    backgroundColor: 'white', // Background when in edit mode
  },
  taskName: {
    fontSize: 16,
    marginLeft: 10,
    color: 'white', // Default text color
  },
  taskNameEdit: {
    color: 'black', // Text color when in edit mode
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonDone: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#555',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  footerInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderColor: '#777',
    color: 'white',
  },
  footerButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  footerButtonText: {
    color: 'white',
  },
  newTaskFooter: {
    marginTop: 10,
    backgroundColor: '#2c2c2c',
  },
  newTaskFooterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#555',
  },
  newTaskInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderColor: '#777',
    color: 'white',
  },
  newTaskButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
  },
  newTaskButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
