import React, { useState, useEffect } from 'react';
import MapView, { Marker, View } from 'react-native-maps';
import { StyleSheet, Text, ScrollView, Dimensions, Image } from 'react-native';
import { getAll, postMessageHelper } from '../Helper';
import { Title } from 'react-native-paper';

export default function MapScreen({ screenProps }) {
  // console.log(screenProps);
  const [messages, setMessages] = useState([]);
  useEffect(()=>{
    getAll()
      .then(({ data }) => {
        const allMessages = data.map(message => {
          console.log(message);
          message.longitude = parseFloat(message.coordinate.long);
          message.latitude = parseFloat(message.coordinate.lat);
          return message;
        });
        setMessages(allMessages);
      })
      .catch(err => console.log(err));
  }, [])
  
  const { latitude, longitude } = screenProps.location.coords;
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };

  // const messages = [
  //   { latitude: 29.971426, longitude: -90.072072 },
  //   { latitude: 29.965022, longitude: -90.072675 },
  //   { latitude: 29.967577, longitude: -90.070677 },
  // ];

  const [dropMarker, setDropMarker] = useState({});
  return (
    <ScrollView style={styles.container}>
      <MapView
        style={styles.mapStyle}
        initialRegion={region}
        showsUserLocation={true}
        userTrackingMode={true}
        onPress={event => setDropMarker(event.nativeEvent.coordinate)}
      >
        {dropMarker.latitude !== undefined &&
          dropMarker.longitude !== undefined && (
            <Marker
              coordinate={{
                latitude: dropMarker.latitude,
                longitude: dropMarker.longitude,
              }}
              key={dropMarker.key}
              onPress={() =>
                console.log(
                  `Leave a message at latitude ${dropMarker.latitude} and longitude ${dropMarker.longitude}?`,
                )
              }
            >
              <Image
                source={require('../assets/images/message.png')}
                style={{ height: 45, width: 35 }}
              />
            </Marker>
          )}
        {messages.map((message, i) => {
          return (
            <MapView.Marker
              coordinate={{
                latitude: message.latitude,
                longitude: message.longitude,
              }}
              key={i}
              onPress={() =>
                console.log(
                  `You are at latitude ${message.latitude} and longitude ${message.longitude}`,
                )
              }
            />
          );
        })}
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
