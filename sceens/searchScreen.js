import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, FlatList} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config';

export default class SearchSceen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allTransactions: [],
            lastVisibleTransaction: null,
            search: ""
        }
    }

    componentDidMount = async()=>{
    
    }

    fetchMoreTransactions = async()=>{
        if(text[0] === "b"){
            const query = await db.collection("transactions").where("bookId", "==", text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            query.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }else if(text[0] === "s"){
            const query = await db.collection("transactions").where("studentId", "==", text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            query.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
    }

    searchTransactions = async(text)=>{
        if(text[0] === "b"){
            const query = await db.collection("transactions").where("bookId", "==", text).get();
            query.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }else if(text[0] === "s"){
            const query = await db.collection("transactions").where("studentId", "==", text).get();
            query.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
    }

    render(){
        return(
            /**<ScrollView>
                {this.state.allTransactions.map((transaction)=>{
                    return(
                        <View style={{borderBottomWidth: 2}}>
                            <Text>{transaction.bookId}</Text>
                            <Text>{transaction.studentId}</Text>
                            <Text>{transaction.transactionType}</Text>
                        </View>
                    )
                })}
            </ScrollView>**/
            
            <View style={styles.container}>
                <View>
                    <TextInput style={styles.textInput}
                    onChangeText={text=>{
                        this.setState({
                            search: text
                        })
                    }}/>

                    <TouchableOpacity style={styles.button}
                    onPress={()=>{
                        this.searchTransactions(this.state.search);
                    }}>
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                </View>

                <FlatList data={this.state.allTransactions} renderItem={({item})=>(
                    <View style={{borderBottomWidth: 2}}>
                        <Text>{item.bookId}</Text>
                        <Text>{item.studentId}</Text>
                        <Text>{item.transactionType}</Text>
                    </View>
                )} keyExtractor={(item, index)=>index.toString()}
                onEndReached={this.fetchMoreTransactions}
                onEndReachedThreshold={0.7}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: "10%"
    },
    textInput:{
        borderColor: "black",
        borderWidth: 5,
        borderRadius: 10,

        width: "80%",
        height: 35,

        alignSelf: "center",
        fontSize: 24,

        height: 50
    },
    button:{
        backgroundColor: "orange",
        width: "27%",
        alignSelf: "center",
        margin: 10
    },
    buttonText:{
        textAlign: "center",
        fontSize: 35
    }
})