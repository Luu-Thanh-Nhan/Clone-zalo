import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera/legacy';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TypeHTTP, api } from '../utils/api';
const QRCodeScanner = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const route = useRoute()
    const { pathName } = route.params
    const navigation = useNavigation()

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        if (data) {
            api({
                type: TypeHTTP.GET,
                path: `/users/${JSON.parse(data)}`,
                sendToken: true
            })
                .then(response => {
                    navigation.navigate('UserProfile', { user: response, pathName })
                })
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 30, left: 10, zIndex: 22 }} >
                <Icon name='arrow-left' style={{ color: 'white', fontSize: 30, marginRight: 10 }} />
            </TouchableOpacity>
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type?.back}
                onBarCodeScanned={handleBarCodeScanned}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    camera: {
        flex: 1,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'black',
        padding: 10,
    },
});

export default QRCodeScanner;
