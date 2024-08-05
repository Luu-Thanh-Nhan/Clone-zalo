import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";

const Read = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { url } = route.params;

    return (
        <View style={styles.container}>
            <WebView
                source={{
                    uri: `${url}`,
                }}
                style={styles.webview}
            />
            <Text style={{ position: 'absolute', width: '100%', top: 400, textAlign: 'center', fontSize: 17, lineHeight: 30, paddingHorizontal: 15 }}>
                You can read the document when the device has finished loading !!
            </Text>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
        marginTop: 20,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    backButtonText: {
        fontSize: 16,
        color: "#333",
    },
});

export default Read;