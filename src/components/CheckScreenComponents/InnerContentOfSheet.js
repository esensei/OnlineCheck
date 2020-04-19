import {
  Image,
  TouchableOpacity,
  View,
  Text
} from 'react-native'
import React, {useState, useEffect} from 'react'
import styles from '../../styles'
import { useSelector } from 'react-redux'

const InnerContentOfSheet = ({ title, id }) => {
  const imagesOfCheck = useSelector(state => state.checkImages)
  const [path, setPath] = useState("")
  useEffect(() => {
    id !== -1 ?     setPath(imagesOfCheck[id].path)
      : null
  }, [id])

  return (
  <View style={styles.panel}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Image source={require('../../img/lukoil.jpg')} style={{ borderRadius: 50, width: 57, height: 57 }} />
      </View>
      <View style={{ flex: 4 }}>
        <Text style={{ color: 'black', fontWeight: '600', alignSelf: 'flex-start', fontSize: 17, lineHeight: 22 }}>{title}</Text>
        <Text style={{ color: 'grey', alignSelf: 'flex-start', fontSize: 12, lineHeight: 16 }}>
          Товарный чек {id}
        </Text>
      </View>
    </View>

    <Image
              style={{
                resizeMode: 'contain',
                width: '100%',
                marginTop: -60,
                height: 900
              }}
              source={{ uri: `${path}` }}
            />
    <TouchableOpacity style={{ backgroundColor: '#F5F5F5', borderRadius: 20, paddingVertical: 9, paddingHorizontal: 29, marginTop: -62 }}>
      <Text style={{ textAlign: 'center', lineHeight: 22, fontSize: 17, fontWeight: '600' }}>Удалить чек</Text>
    </TouchableOpacity>
  </View>
)}

export default InnerContentOfSheet
