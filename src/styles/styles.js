import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    marginBottom: 13,
    backgroundColor: '#fff',
    elevation: 20,
  },
  input: {
    flex: 1,
    padding: 7,
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  authContainer: {
   width:'100%' ,
    borderRadius: 30,
    padding: 20,
    backgroundColor: 'transparent',
  },
  imageBackground: {
    flex: 1,
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  input: {
    elevation:20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius:30,
    padding:7,
    marginBottom: 13,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3b9b50',
    padding: 10,
    borderRadius: 300,
    marginTop:20,
    width:200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toggleText: {
    fontWeight: 'bold',
    color: '#888',
    fontSize: 16,
  },
  selectedToggleText: {
    color: '#3b9b50',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color:'white',
  },
  bottomContainer: {
    marginTop: 30,
  },
  emailText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeModal: {
    color: '#3b9b50',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default styles;
