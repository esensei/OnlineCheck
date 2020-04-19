import React from 'react'
import { View } from 'react-native'
import styles from '../../styles'

const HeaderOfSheet = () => (
  <View style={styles.headerSheet}>
    <View style={styles.panelHeader}>
      <View style={styles.panelHandle} />
    </View>
  </View>
)

export default HeaderOfSheet
