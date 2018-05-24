import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { colors, fontSizes } from '~/styles'
import { parseTitle } from '~/utils/parse'
import { VirtualizedList, FlatList } from 'react-native'

import fromJS from 'immutable'

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native'

import {
  POABusNavigationBar,
  FlashNotification,
  BusInfo,
  NavbarDetails,
} from '~/components'

const { width } = Dimensions.get('window')
const SCHEDULE_ITEM_WIDTH = (width * 0.25)

BusDetails.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSaveBus: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  schedules: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool.isRequired,
}

export default function BusDetails (props) {

  setBackgroundColor = (schedule) => {
    return schedule.get('cadeirante') ? {backgroundColor: 'rgba(3, 169, 244, 0.08)'} : {}
  }

  function Schedules (props) {
    return (
      <View style={styles.schedulesContainer}>
        <VirtualizedList
          data={props.schedules}
          getItem={(data, index) => {
            let items = []
            for (let i = 0; i < 4; i++) {
              const item = data.get(index * 4 + i)
              item && items.push(item)
              item && console.log(item.get('horario'))
            }
            return items
          }}
          getItemCount={(data) => data.size}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View key={index} style={{flexDirection: 'row'}}>
                {item.map((elem, i) => (
                  <View key={i} style={[styles.scheduleItem, this.setBackgroundColor(elem)]}>
                    <Text key={i} style={styles.scheduleTime}>{elem.get('horario')}</Text>
                  </View>
                ))}
              </View>
            )
          }}
        />
      </View>
    )
  }

  function ScheduleDirection (props) {
    const directionTitle = parseTitle(props.directionsInfo.get('sentido'))
    let weekDaysType = props.directionsInfo.keySeq().toArray()
    weekDaysType = weekDaysType.filter((item) => item !== 'sentido')
    return (
      <View>
        <View style={styles.directionTextContainer}>
          <Text style={styles.directionText}>
            Sentido: {directionTitle}
          </Text>
        </View>
        {weekDaysType.map((weekDayType, index) => (
          <View key={index}>
            <View style={styles.dayTypeContainer}>
              <Text key={index} style={styles.directionTitle}>{parseTitle(weekDayType)}</Text>
            </View>
            <Schedules key={index} schedules={props.directionsInfo.get(weekDayType)}/>
          </View>
        ))}
      </View>
    )
  }

  function BusSchedules (props) {
    const directions = props.busInfo.keySeq().toArray()
    return directions.map((direction, index) => (
            <ScheduleDirection key={index} directionsInfo={props.busInfo.get(direction)} />
           ))
  }

  return (
    <View style={styles.container}>
      <POABusNavigationBar title={`Horários de ${props.code}`}
        leftButton={
          <TouchableOpacity onPress={props.onBack}>
            <EntypoIcon name='chevron-thin-left' color={colors.blue} size={14}>
              <Text style={{color: '#4A90E2'}}>Voltar</Text>
            </EntypoIcon>
          </TouchableOpacity>
        } rightButton={
          <TouchableOpacity style={styles.saveBusBtn} onPress={props.onSaveBus}>
            <Icon name={`favorite${props.isFavorite ? '' : '-border'}`}
              color={colors.red} size={20}/>
          </TouchableOpacity>
        }
      />
      {props.showNotification
        ? <FlashNotification text={props.notificationText}
            onHideNotification={props.onHideNotification} />
        : null}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, {fontFamily: Platform.OS === 'android'
          ? 'Roboto' : 'Helvetica Neue'}]}>{props.name}</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps={'always'}>
        <BusSchedules busInfo={props.schedules} />
      </ScrollView>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 15,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: fontSizes.primary,
  },
  schedulesContainer: {
    margin: 20,
    marginBottom: 40,
    paddingBottom: 100,
  },
  scheduleItem: {
    width: (SCHEDULE_ITEM_WIDTH - 10),
    padding: 10,
    maxHeight: 40,
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: colors.border,
  },
  scheduleTime: {
  },
  scheduleIcon: {
  },
  directionTextContainer: {
    padding: 10,
    backgroundColor: '#eceff1',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  directionText: {
    fontSize: 15,
  },
  saveBusBtn: {
    width: '20%',
    height: '20%',
  },
  dayTypeContainer: {
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  }
})
