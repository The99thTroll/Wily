import { Component } from "react"
import * as React from "react";
import {View, Text, TouchableOpacity, TextInput, StyleSheet} from "react-native"
import {Header} from "react-native-elements"
import firebase from "firebase";
import { Alert } from "react-native";

export default class LoginScreen extends React.Component{
    constructor(){
        super();

        this.state = {
            emailId: "",
            password: ""
        }
    }

    login = async(email, password)=>{
        if(email && password){
            try{
                const response = await firebase.auth().signInWithEmailAndPassword(email, password);
                if(response){
                    console.log("e")
                    this.props.navigation.navigate('BookTransactions')
                }
            }catch(error){
                Alert.alert(error.message);
                // console.log(error.code)
                // switch(error.code){
                //     case 'auth/user-not-found':
                //         Alert.alert("This email does not exist")
                //         break
                //     case 'auth/wrong-password':
                //         Alert.alert("Incorrect password!")
                //         break
                // }
            }
        }else{
            Alert.alert("Please fill in the required fields")
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <Header
                centerComponent={{
                    text: "Wily App",
                    style: { fontSize: 30, color: "white", fontWeight: "bold"},
                  }}/>

                <TextInput
                onChangeText={(text)=>{
                    this.setState({
                        emailId: text
                    })
                }}
                placeholder="Student Email"
                style={styles.textInput}/>

                <TextInput
                onChangeText={(text)=>{
                    this.setState({
                        password: text
                    })
                }}
                placeholder="Password"
                secureTextEntry={true}
                style={styles.textInput}/>

                <TouchableOpacity style={styles.submitButton}
                onPress={
                    ()=>{
                        this.login(this.state.emailId, this.state.password);
                    }
                }>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput:{
        alignSelf: "center",
        height: 32.5,
        fontSize: 25,

        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 2.5,

        width: "65%",
        marginTop: 25,
        padding: 5
    },
    submitButton:{
        alignSelf: "center",
        marginTop: 50
    },
    submitText:{
        fontSize: 30
    }
})