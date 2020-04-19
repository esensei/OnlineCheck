import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,

  },
  canvas: {
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    paddingHorizontal: 5
  },
  buttonTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  settingsButton: {
    marginTop: 40,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 25,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 0, width: 0 }, // IOS
    shadowOpacity: 0.3, // IOS
    shadowRadius: 3.3, //IOS
    backgroundColor: '#fff',
    elevation: 2, // Android

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  panel: {
    height: 950,
    paddingTop: 14,
    paddingHorizontal: 32,
    backgroundColor: 'white',
  },
  headerSheet: {
    backgroundColor: 'white',
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOpacity: 0.3, // IOS
    shadowRadius: 2.3, //IOS    shadowRadius: 5.3,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  dateTitle: {
    marginHorizontal:16,
    fontWeight: '600',
    marginVertical: 16,
    fontSize: 20,
    lineHeight: 24,
    color: 'black'
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  image: {
    resizeMode: 'contain',
    width: 200,
    alignSelf: 'center',
    height: 900
  }
})

export default styles
