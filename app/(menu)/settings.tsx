import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function Example() {
    const [form, setForm] = useState({
        emailNotifications: true,
        pushNotifications: false,
    });
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FBF9F4' }}>
            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <FeatherIcon name="arrow-left" size={24} color="#481E30" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ayarlar</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.section, { paddingTop: 4 }]}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <View style={styles.sectionBody}>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                            }}
                            style={styles.profile}>
                            <Image
                                alt=""
                                source={{
                                    uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
                                }}
                                style={styles.profileAvatar} />

                            <View style={styles.profileBody}>
                                <Text style={styles.profileName}>John Doe</Text>

                                <Text style={styles.profileHandle}>john@example.com</Text>
                            </View>

                            <FeatherIcon
                                color="#bcbcbc"
                                name="chevron-right"
                                size={22} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.sectionBody}>
                        {/* Language Option */}
                        <View style={[styles.rowWrapper, styles.rowFirst]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Language</Text>

                                <View style={styles.rowSpacer} />

                                <Text style={styles.rowValue}>English</Text>

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>

                        {/* Location Option */}


                        {/* Email Notifications Option */}
                        <View style={styles.rowWrapper}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Email Notifications</Text>

                                <View style={styles.rowSpacer} />

                                <Switch
                                    onValueChange={emailNotifications =>
                                        setForm({ ...form, emailNotifications })
                                    }
                                    style={{transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                    value={form.emailNotifications} />
                            </View>
                        </View>

                        {/* Push Notifications Option */}
                        <View style={[styles.rowWrapper, styles.rowLast]}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Push Notifications</Text>

                                <View style={styles.rowSpacer} />

                                <Switch
                                    onValueChange={pushNotifications =>
                                        setForm({ ...form, pushNotifications })
                                    }
                                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                    value={form.pushNotifications} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Resources Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resources</Text>

                    <View style={styles.sectionBody}>
                        {/* Contact Us Option */}
                        <View style={[styles.rowWrapper, styles.rowFirst]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Contact Us</Text>

                                <View style={styles.rowSpacer} />

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>

                        {/* Report Bug Option */}
                        <View style={styles.rowWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Report Bug</Text>

                                <View style={styles.rowSpacer} />

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>

                        {/* Rate in App Store Option */}
                        <View style={styles.rowWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Rate in App Store</Text>

                                <View style={styles.rowSpacer} />

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>

                        {/* Terms and Privacy Option */}
                        <View style={[styles.rowWrapper, styles.rowLast]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={styles.rowLabel}>Terms and Privacy</Text>

                                <View style={styles.rowSpacer} />

                                <FeatherIcon
                                    color="#481E30"
                                    name="chevron-right"
                                    size={19} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Log Out Option */}
                <View style={styles.section}>
                    <View style={styles.sectionBody}>
                        <View
                            style={[
                                styles.rowWrapper,
                                styles.rowFirst,
                                styles.rowLast,
                                { alignItems: 'center' },
                            ]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}>
                                <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                                    Log Out
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.contentFooter}>App Version 2.24 #50491</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    /** Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 12,
        backgroundColor: '#FBF9F4',
        elevation: 2,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: 12,
        zIndex: 1000,
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '600',
        color: '#481E30',
    },
    /** Content */
    content: {
        paddingHorizontal: 16,
    },
    contentFooter: {
        marginTop: 24,
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
        color: '#a69f9f',
    },
    /** Section */
    section: {
        paddingVertical: 12,
    },
    sectionTitle: {
        margin: 8,
        marginLeft: 12,
        fontSize: 13,
        letterSpacing: 0.33,
        fontWeight: '500',
        color: '#481E30',
        textTransform: 'uppercase',
    },
    sectionBody: {
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    profile: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        marginRight: 12,
    },
    profileBody: {
        marginRight: 'auto',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#481E30',
    },
    profileHandle: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: '400',
        color: '#858585',
    },
    /** Row */
    row: {
        height: 44,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 12,

    },
    rowWrapper: {
        paddingLeft: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#f0f0f0',
    },
    rowFirst: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    rowLabel: {
        fontSize: 16,
        letterSpacing: 0.24,
        color: '#481E30',
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#481E30',
        marginRight: 4,
    },
    rowLast: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    rowLabelLogout: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '600',
        color: '#481E30',
    },
});
