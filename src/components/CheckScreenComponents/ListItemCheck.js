import {
  ListItem,
  Text
} from 'native-base'
import {
  Image,
  TouchableOpacity,
  View
} from 'react-native'
import React from 'react'
import { format, formatDistanceToNow, differenceInDays, subDays } from 'date-fns'

const ListItemCheck = ({ company, cost, date, checkRef, id, setID }) => {
  console.log(date)
  return (
  <>
    <ListItem>
      <TouchableOpacity onPress={() => {

        setID(id)
        checkRef.current.snapTo(1)
      }}
                        style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Image source={require('../../img/lukoil.jpg')} style={{ borderRadius: 50, width: 40, height: 40 }} />
        </View>
        <View style={{ flex: 4 }}>
          <Text style={{ color: 'black', fontWeight: '600', alignSelf: 'flex-start', fontSize: 17, lineHeight: 22 }}>{company}</Text>
          <Text style={{ color: 'grey', alignSelf: 'flex-start', fontSize: 12, lineHeight: 16 }}>
            Товарный чек  {format(new Date(date), 'MM.dd.yyyy')}
          </Text>
        </View>
        <Text style={{ fontWeight: '600', fontSize: 17, lineHeight: 22 }}>
          {cost} ₽
        </Text>

      </TouchableOpacity>
    </ListItem>
  </>
)
}

export default ListItemCheck
