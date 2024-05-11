//Importa todos los componentes de la librería 'react'
import * as React from 'react';
//Importa los componentes Button, View. StyleSheet, TextInput y Alert de la librería 'react-native'
import { Button, View, StyleSheet, TextInput, Alert, FlatList, SafeAreaView, Text, StatusBar  } from 'react-native';

const App = () => {
  //Se declara una variable de estado
  //Revisar https://reactjs.org/docs/hooks-state.html
  const [todo, onChangeTodo] = React.useState('');
  const [todoList, setTodoList] = React.useState([])

  React.useEffect( () => {
    doFetch().then(async (resp) => {
      console.log("todo en effect --> ", resp)
      setTodoList(resp)
    })
  }, [todo])


  const alert = async (message) => {
    Alert.alert(
      'TODO CREADO!',
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  };

  const doFetch = async () => {
    return await fetch('http://localhost:3000/get_todos', {
          method: "GET"
        })
      .then((res) => {
        console.log("json ---> ", JSON.stringify(res))
        res.json()
        
        })
      .then((data) => {
        console.log("response ---> ", data)
        return data
        });
  };

  const saveTodo = async () => {
  return await fetch('http://localhost:3000/agrega_todo', {
        method: "POST",
        body: JSON.stringify({"todo": todo}),
        headers: {'Content-Type': 'application/json'}
      })
    .then(async(res) => {
      if(res['status'] == 201) {
        await alert(`TODO: "${todo}" creado`)
          .then((res) => {
            console.log("ALERT ---> ", res)
          })
          .catch((err) => {
            console.log("ERROR EN ALERT ---> ", err)
          })
      }
      res.json()
      })
    .catch((err) => {
      console.log("response ---> ", err)
      // return data
      // }).catch((err) => {
      //   console.log("ERROR DOING FETCH ---> ", err)
      // })
    });
  };

  const Item = ({title}: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  textInput: {
    height: 40,
    padding: 8,
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {},
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="todo"
        textContentType="default"
        keyboardType="default"
        onChangeText={(text) => onChangeTodo(text)}
      />

      <Button
        style={styles.button}
        title="Agregar todo"
        onPress={() => saveTodo()}
      />

    <SafeAreaView style={styles.container}>
      <FlatList
        data={todoList}
        renderItem={({item}) => <Item title={item.todo} />}
        keyExtractor={item => item.todo_id}
      />
    </SafeAreaView>

    </View>
  );
};


export default App;
