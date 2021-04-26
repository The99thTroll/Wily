import React, {Component} from 'react';
import {Text, View, StyleSheet, Alert, TextInput} from 'react-native';
import {BarCodeScanner} from "expo-barcode-scanner";
import * as Permissions from 'expo-permissions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config';
import * as firebase from 'firebase';

export default class BookTransactionScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedData: "",
            buttonState: "normal",
            scannedBookId: "",
            scannedStudentId: "",
            bookName: ""
        }
    }

    initiateBookIssue = async()=>{
        db.collection("transactions").add({
            'studentId': this.state.scannedStudentId,
            'bookId': this.state.scannedBookId,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': 'issue'
        })

        db.collection('books').doc(this.state.scannedBookId).update({
            'bookAvailability': false
        })

        db.collection('students').doc(this.state.scannedStudentId).update({
            'booksCheckedOut': firebase.firestore.FieldValue.increment(1)
        })

        console.log(db.collection('books').doc(this.state.scannedBookId).get())
        Alert.alert(this.state.bookName + " Was Issued Successfully!");

        this.setState({
            scannedBookId: "",
            scannedStudentId: ""
        })
    }

    initiateBookReturn = async()=>{
        db.collection("transactions").add({
            'studentId': this.state.scannedStudentId,
            'bookId': this.state.scannedBookId,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': 'return'
        })

        db.collection('books').doc(this.state.scannedBookId).update({
            'bookAvailability': true
        })

        db.collection('students').doc(this.state.scannedStudentId).update({
            'booksCheckedOut': firebase.firestore.FieldValue.increment(-1)
        })

        Alert.alert(this.state.bookName + " Was Returned Successfully!");
        
        this.setState({
            scannedBookId: "",
            scannedStudentId: "",
        })
    }

    checkBookEligibility = async()=>{
        const bookRef = await db.collection('books').where("bookId", "==", this.state.scannedBookId).get();
        var transactionType = "";

        if(bookRef.docs.length == 0){
            transactionType = false;
        }

        bookRef.docs.map(document => {
            var book = document.data()

            if(book.bookAvailability){
                transactionType = "issue"
            }else{
                transactionType = "return"
            }

            this.setState({
                bookName: book.bookDetails.title
            })
        })

        return transactionType
    }

    checkStudentEligibilityForIssue = async()=>{
        const studentRef = await db.collection("students").where("studentId", "==", this.state.scannedStudentId).get();
        var isStudentEligible = ""

        if(studentRef.docs.length == 0){
            isStudentEligible = false;
            Alert.alert("Student does not exist");
            this.setState({
                scannedStudentId: "",
                scannedBookId: ""
            })
        }else{
            studentRef.docs.map(document => {
                var student = document.data();
                if(student.booksCheckedOut < 2){
                    isStudentEligible = true;
                }else{
                    isStudentEligible = false;
                    Alert.alert("You can not check out more than 2 books!")
                    this.setState({
                        scannedStudentId: "",
                        scannedBookId: ""
                    })
                }
            })
        }

        return isStudentEligible
    }

    checkStudentEligibilityForReturn = async()=>{
        const transactionRef = await db.collection("transactions").where("bookId", "==", this.state.scannedBookId).limit(1).get();
        var isStudentEligible = "";

        transactionRef.docs.map(document => {
            var lastBookTransaction = document.data();
            if(lastBookTransaction.studentId === this.state.scannedStudentId){
                isStudentEligible = true
            }else{
                isStudentEligible = false
                Alert.alert("You don't have this book checked out")
                this.setState({
                    scannedStudentId: "",
                    scannedBookId: ""
                })
            }
        })

        return isStudentEligible
    }

    handleTransaction = async()=>{
        var transactionType = await this.checkBookEligibility();

        if(!transactionType){
            Alert.alert("Book not found");
            this.setState({
                scannedBookId: "",
                scannedStudentId: ""
            })
        }else if(transactionType === "issue"){
            var isStudentEligible = await this.checkStudentEligibilityForIssue();
            if(isStudentEligible){
                this.initiateBookIssue();
            }
        }else{
            var isStudentEligible = await this.checkStudentEligibilityForReturn();
            if(isStudentEligible){
                this.initiateBookReturn();
            }
        }
    }

    getCameraPermissions = async(id)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions: status === "granted",
            buttonState: id,
            scanned: false
        })
    }

    handleBarCodeScan = async({data})=>{
        const {buttonState} = this.state
        if(buttonState === "bookId"){
            this.setState({
                scanned: true, 
                scannedBookId: data, 
                buttonState: "normal"
            })
        }else if(buttonState === "studentId"){ 
            this.setState({
                scanned: true, 
                scannedStudentId: data, 
                buttonState: "normal"
            })
        }
    }

    render(){
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        if(buttonState !== "normal" && hasCameraPermissions){
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScan}
                style={StyleSheet.absoluteFillObject}/>
            )
        }else if(buttonState === "normal"){
            return(
                <View style={styles.container}>
                    <View style={styles.textInputAndButton}>
                        <TextInput style={styles.dataInput}
                        onChangeText={(text)=>{
                            this.setState({
                                scannedBookId: text.toLowerCase()
                            })
                        }}
                        value={this.state.scannedBookId}
                        placeholder="Book ID"
                        fontStyle={this.state.scannedBookId.length == 0 ? 'italic' : 'normal'}
                        placeholderTextColor="#a6c8ff"/>
                        <TouchableOpacity style={styles.button}
                        onPress={
                            ()=>{
                                this.getCameraPermissions('bookId')
                            }
                        }>
                            <Text style={styles.buttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textInputAndButton}>
                        <TextInput style={styles.dataInput}
                        value={this.state.scannedStudentId}
                        onChangeText={(text)=>{
                            this.setState({
                                scannedStudentId: text.toLowerCase()
                            })
                        }}
                        placeholder="Student ID"
                        fontStyle={this.state.scannedStudentId.length == 0 ? 'italic' : 'normal'}
                        placeholderTextColor="#a6c8ff"/>
                        <TouchableOpacity style={styles.button}
                        onPress={
                            ()=>{
                                this.getCameraPermissions('studentId');
                            }
                        }>
                            <Text style={styles.buttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.submitButton}
                    onPress={
                        async()=>{
                            this.handleTransaction();
                        }
                    }>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    output:{
        textAlign: "center",
        fontSize: 25,
        width: "95%"
    },
    button:{
        backgroundColor: "#4affc6",
        height: 50,
        justifyContent: "center",
        borderWidth: 2.5,
        borderLeftWidth: 0
    },
    buttonText:{
        fontSize: 27,
        padding: 5
    },
    dataInput:{
        borderWidth: 2.5,
        height: 50,
        width: "60%",
        borderRightWidth: 0,
        fontSize: 25
    },
    textInputAndButton:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        width: "100%"
    },
    submitButton:{
        marginTop: 25,
        backgroundColor: "#1db2f2",
        borderWidth: 2
    },
    submitButtonText:{
        fontSize: 30,
        padding: 5
    },
})

/* 
   ____
 / ___|
|  |__
 \__  |
 __/  /
|____/
*/