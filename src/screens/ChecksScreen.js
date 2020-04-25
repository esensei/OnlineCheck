import React, { useState, useRef, useEffect } from 'react'
import {
  Image,
  Dimensions,
  View
} from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet'
import {
  Body,
  Container,
  Header,
  Text,
  Title
} from 'native-base'
import { useSelector } from 'react-redux'
import { format, formatDistanceToNow, differenceInDays, subDays } from 'date-fns'
import Animated from 'react-native-reanimated'
import COLORS from '../constants/Colors'
import styles from '../styles'
import NowEmptyChecks from '../assets/checks_screen/NowEmptyChecks.svg'
import { HeaderOfSheet, InnerContentOfSheet, ListItemCheck } from '../components/CheckScreenComponents'
const RNFS = require('react-native-fs')


const ChecksScreen = () => {
  const [fall, setFall] = useState(new Animated.Value(1))
  const [ID, setID] = useState(-1)
  const [nameOfCompany, setNameOfCompany] = useState("")

  const imagesOfCheck = useSelector(state => state.checkImages)

  const checkRef = useRef(null)
  const { canvas, dateTitle, content, container, header } = styles

  return (
    <Container style={container}>
      <Header style={{ backgroundColor: 'white' }}>
        <Body>
          <Title style={header}>Мои чеки</Title>
        </Body>
      </Header>

      <BottomSheet
        snapPoints={[-10, 300, '80%']}
        renderContent={() => <InnerContentOfSheet  id={ID} title={nameOfCompany} />}
        renderHeader={() => <HeaderOfSheet  />}
        ref={checkRef}
        callbackNode={fall}
        initialSnap={0}
        enabledInnerScrolling
      />
      <Animated.View style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 0.9)) }}>
        {imagesOfCheck.length === 0 ?
          <Animated.View style={{marginTop: 100, alignItems: "center", justifyContent: 'center'}}>
            <NowEmptyChecks style={{ flex: 1 }} />
          </Animated.View>
          :
          <>
          <View>
            <Text style={dateTitle}>Сегодня</Text>
          </View>
            {imagesOfCheck.length > 0 && imagesOfCheck.map((res, index) => (
              differenceInDays(res.date, new Date()) === 0 ?

                  <ListItemCheck clFunc={setNameOfCompany} company={res.title} path={res.path} id={res.id} setID={setID} checkRef={checkRef} cost="599.4" date={res.date.toString()} />

                : null
            ))}


            {/*{imagesOfCheck.map((res, index) => {*/}
            {/*  console.log(`file://${RNFS.DocumentDirectoryPath}/${res.path}`)*/}
            {/*  return (*/}
            {/*    <Card key={index}>*/}
            {/*      <CardItem style={{ backgroundColor: COLORS.green }}>*/}
            {/*        <Left>*/}
            {/*          <Thumbnail source={require('../img/logoOnCheck.png')} />*/}
            {/*          <Body>*/}
            {/*            <Text style={{ color: 'white' }}>Лукойл</Text>*/}
            {/*            <Text style={{ color: 'rgb(209,243,248)' }} note>Товарный чек</Text>*/}
            {/*          </Body>*/}
            {/*        </Left>*/}
            {/*      </CardItem>*/}
            {/*      <CardItem style={canvas}>*/}

            {/*        <Image*/}
            {/*          style={{*/}
            {/*            resizeMode: 'contain',*/}
            {/*            width: '100%',*/}
            {/*            height: 900*/}
            {/*          }}*/}
            {/*          source={{ uri: `${res.path}` }}*/}
            {/*        />*/}
            {/*      </CardItem>*/}
            {/*    </Card>)*/}
            {/*})}*/}
          </>}


      </Animated.View>
    </Container>
  )
}

export default ChecksScreen
