import { KeyboardAvoidingView, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'

const Login = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    loginUser = async (email,password) => {
      // take out password
      try{
          await firebase.auth().signInWithEmailAndPassword(email,password)
      } catch (error){
        alert(error)
      }
    }

    // forget password
    const forgetPassword = () => {
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert('Password reset email sent!')
        })
        .catch(error => {
            alert(error)
        })
    }
//@
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={{fontWeight:'bold', fontSize:26,}}>
          Login
        </Text>
        <KeyboardAvoidingView style={{marginTop:40}}>
          <TextInput style={styles.textInput} 
            placeholder="Email" 
            onChangeText={(email) => setEmail(email)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput style={styles.textInput} 
            placeholder="Password" 
            onChangeText={(password)=> setPassword(password)}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
            onPress={()=>loginUser(email,password)}
            style={styles.button}
        >
          <Text style={{fontWeight:'bold', fontSize:22}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>navigation.navigate('Registration')}
          style={{marginTop:20,}}
        >
          <Text style={{fontSize:16, fontWeight:'bold'}}>
            Don't have an account? Sign up here
          </Text>
          
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>{forgetPassword()}}
          style={{marginTop:20,}}
        >
          <Text style={{fontSize:16, fontWeight:'bold'}}>
            Forget Password?
          </Text>
          
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex:1,  
    alignItems:'center',
    marginTop:100,
  },
  textInput: {
    paddingTop: 20,
    paddingBottom:10,
    width:400,
    fontSize: 20,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    marginTop:50,
    height:70,
    width:250,
    backgroundColor:'#8AB6A9',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
  }
});