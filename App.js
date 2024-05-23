//Importa todos los componentes de la librería 'react'
import * as React from 'react';
//Importa los componentes Button, View. StyleSheet, TextInput y Alert de la librería 'react-native'
import {
	Button,
	View,
	StyleSheet,
	TextInput,
	Alert,
	FlatList,
	SafeAreaView,
	Text,
	StatusBar,
} from 'react-native';

const App = () => {
	//Se declara una variable de estado
	//Revisar https://reactjs.org/docs/hooks-state.html
	const [todo, onChangeTodo] = React.useState('');
	const [todoList, setTodoList] = React.useState([]);

	React.useEffect(() => {
		let res = doFetch();
	}, []);

	const alert = async (message) => {
		Alert.alert(
			'TODO CREADO!',
			message,
			[{ text: 'OK', onPress: () => console.log('OK Pressed') }],
			{ cancelable: false }
		);
	};

	const doFetch = () => {
		try {
			fetch('https://eighty-pets-worry.loca.lt/get_todos')
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					let todos = JSON.parse(data);
					setTodoList(todos.todos);
					return todos.todos;
				});
		} catch (err) {
			console.log('Error on fetch: ', err);
		}
	};

	const saveTodo = async () => {
		console.log('todo ', todo);
		try {
			return await fetch('https://eighty-pets-worry.loca.lt/agrega_todo', {
				method: 'POST',
				body: JSON.stringify({ todo: todo }),
				headers: { 'Content-Type': 'application/json' },
			})
				.then(async (res) => {
					if (res['status'] == 201) {
						doFetch();
						await alert(`TODO: "${todo}" creado`)
							.then((res) => {
								console.log('ALERT ---> ', res);
							})
							.catch((err) => {
								console.log('ERROR EN ALERT ---> ', err);
							});
					}
					res.json();
				})
				.catch((err) => {
					console.log('response ---> ', err);
				});
		} catch (err) {
			console.log('error on save ', err);
		}
	};

	const Item = ({ title }) => {
		let item = title.item;
		return (
			<View style={styles.item}>
				<Text>TODO # {item.todo_id}</Text>
				<Text style={styles.title}>{item.todo}</Text>
			</View>
		);
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			marginTop: StatusBar.currentHeight || 0,
		},
		item: {
			backgroundColor: 'lightgreen',
			padding: 20,
			marginVertical: 8,
			marginHorizontal: 16,
			borderRadius: 15,
		},
		title: {
			fontSize: 28,
			marginLeft: 15,
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
				placeholder='todo'
				textContentType='default'
				keyboardType='default'
				onChangeText={(text) => onChangeTodo(text)}
			/>

			<Button
				style={styles.button}
				title='Agregar todo'
				onPress={() => saveTodo()}
			/>

			<FlatList
				data={todoList}
				renderItem={(item) => <Item title={item} />}
				keyExtractor={(item) => item.todo_id}
			/>
		</View>
	);
};

export default App;
