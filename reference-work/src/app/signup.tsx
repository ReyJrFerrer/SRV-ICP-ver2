import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const signupSchema = zod.object({
    username: zod.string().min(3, { message: 'Username must be at least 3 characters long' }),
    email: zod.string().email({ message: 'Invalid email address' }),
    password: zod.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        // .regex(/(?=.*[0-9])/, { message: 'Password must contain a number' })
        // .regex(/(?=.*[A-Z])/, { message: 'Password must contain an uppercase letter' })
        // .regex(/(?=.*[a-z])/, { message: 'Password must contain a lowercase letter' })
        // .regex(/(?=.*[!@#$%^&*])/, { message: 'Password must contain a special character' })
});

export default function SignUp() {
    const { control, handleSubmit, formState } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    const [userType, setUserType] = useState<'customer' | 'provider'>('customer');
    const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

    const onSignUp = async (data: zod.infer<typeof signupSchema>) => {
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: { 
                        provider_type: userType, 
                        username: data.username, 
                        display_name: data.username
                    },
                }
            });

            if (error) throw error;

            setUnconfirmedEmail(data.email);
            Alert.alert("Verify Email", "Please check your email and confirm your account before logging in.");
        } catch (error: any) {
            console.error("Signup Error:", error);
            Alert.alert('Signup Error', error.message || "An unknown error occurred.");
        }
    };

    const resendConfirmationEmail = async () => {
        if (!unconfirmedEmail) return;

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: unconfirmedEmail,
            });

            if (error) throw error;

            Alert.alert('Success', 'A new confirmation email has been sent.');
        } catch (error: any) {
            console.error("Resend Email Error:", error);
            Alert.alert('Error', error.message || "Could not resend email.");
        }
    };

    return (
        <ImageBackground source={require('../../assets/images/sample-bg.jpg')} style={styles.backgroundImage}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={styles.subtitle}>Create an account to get started</Text>

                    <Controller
                        control={control}
                        name='username'
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    placeholder='Username'
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor={'#aaa'}
                                    autoCapitalize='none'
                                    editable={!formState.isSubmitting}
                                />
                                {error && <Text style={styles.error}>{error.message}</Text>}
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name='email'
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    placeholder='Email'
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor={'#aaa'}
                                    autoCapitalize='none'
                                    editable={!formState.isSubmitting}
                                />
                                {error && <Text style={styles.error}>{error.message}</Text>}
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name='password'
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    placeholder='Password'
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    secureTextEntry
                                    placeholderTextColor={'#aaa'}
                                    autoCapitalize='none'
                                    editable={!formState.isSubmitting}
                                />
                                {error && <Text style={styles.error}>{error.message}</Text>}
                            </>
                        )}
                    />

                    <Text style={styles.radioTitle}>Select User Type:</Text>
                    <View style={styles.radioGroup}>
                        <TouchableOpacity
                            style={[styles.radioButton, userType === 'customer' && styles.radioSelected]}
                            onPress={() => setUserType('customer')}
                        >
                            <Text style={styles.radioText}>Customer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.radioButton, userType === 'provider' && styles.radioSelected]}
                            onPress={() => setUserType('provider')}
                        >
                            <Text style={styles.radioText}>Provider</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit(onSignUp)} disabled={formState.isSubmitting}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>

                    {unconfirmedEmail && (
                        <TouchableOpacity style={styles.resendButton} onPress={resendConfirmationEmail}>
                            <Text style={styles.resendButtonText}>Resend Confirmation Email</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        width: '100%',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#ddd',
        marginBottom: 32,
    },
    input: {
        width: '90%',
        padding: 12,
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        fontSize: 16,
        color: '#000',
    },
    radioTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
        width: '90%',
    },
    radioButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    radioSelected: {
        backgroundColor: '#6a1b9a',
    },
    radioText: {
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#6a1b9a',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    resendButton: {
        marginTop: 10,
        padding: 10,
    },
    resendButtonText: {
        color: '#ffcc00',
        textDecorationLine: 'underline',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 16,
        textAlign: 'left',
        width: '90%',
    },
});
